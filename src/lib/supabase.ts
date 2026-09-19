import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ProjectStats, QuizSubmission, DetectionSubmission, QuizQuestionSummary } from '../types';
import {
  getLocalStats,
  saveLocalQuizResult,
  saveLocalDetectionResult,
  getLocalParticipantQuizResults,
  getLocalParticipantDetectionResults,
  saveLastParticipant
} from '../utils/storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key' &&
    supabaseUrl.startsWith('https://')
  );
};

let client: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
}

export const supabase = client;

/**
 * Save quiz submission to Supabase (or local storage fallback if not configured).
 */
export async function submitQuizResult(submission: {
  name: string;
  email: string;
  score: number;
  total_questions: number;
  questionsSummary?: QuizQuestionSummary[];
}): Promise<{ success: boolean; error?: string; isLocalFallback?: boolean }> {
  const percentage = Math.round((submission.score / submission.total_questions) * 100);
  const cleanEmail = submission.email.trim().toLowerCase();
  const cleanName = submission.name.trim();

  // Save last participant info for seamless session continuity
  saveLastParticipant({ name: cleanName, email: cleanEmail });

  if (!isSupabaseConfigured() || !supabase) {
    // Save to local storage fallback seamlessly
    saveLocalQuizResult({
      name: cleanName,
      email: cleanEmail,
      score: submission.score,
      total_questions: submission.total_questions,
      percentage,
      completed_at: new Date().toISOString(),
      questionsSummary: submission.questionsSummary
    });
    return { success: true, isLocalFallback: true };
  }

  try {
    // 1. Ensure user record exists in participants / users table
    let userId: string | null = null;

    const { data: existingUser, error: userFetchError } = await supabase
      .from('users')
      .select('id, name')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (userFetchError && userFetchError.code !== 'PGRST116') {
      console.warn('User lookup warning:', userFetchError);
    }

    if (existingUser?.id) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ name: cleanName, email: cleanEmail }])
        .select('id')
        .single();

      if (createError) {
        console.warn('User insert warning, proceeding with anonymous submission:', createError);
      } else {
        userId = newUser?.id || null;
      }
    }

    // 2. Insert into quiz_results
    const { data: insertedQuiz, error: quizError } = await supabase
      .from('quiz_results')
      .insert([
        {
          user_id: userId,
          score: submission.score,
          total_questions: submission.total_questions,
          percentage,
          completed_at: new Date().toISOString()
        }
      ])
      .select('id, completed_at')
      .maybeSingle();

    // Also persist in local storage as reliable cache with full questions breakdown
    saveLocalQuizResult({
      id: insertedQuiz?.id || undefined,
      user_id: userId || undefined,
      name: cleanName,
      email: cleanEmail,
      score: submission.score,
      total_questions: submission.total_questions,
      percentage,
      completed_at: insertedQuiz?.completed_at || new Date().toISOString(),
      questionsSummary: submission.questionsSummary
    });

    if (quizError) {
      console.error('Quiz result insert error:', quizError);
      return { success: true, isLocalFallback: true };
    }

    // 3. Insert into activity_logs
    try {
      await supabase
        .from('activity_logs')
        .insert([
          {
            user_id: userId,
            activity_type: 'quiz',
            score: submission.score,
            created_at: new Date().toISOString()
          }
        ]);
    } catch (e) {
      console.warn('Activity log notice:', e);
    }

    return { success: true, isLocalFallback: false };
  } catch (err) {
    console.error('Submit quiz exception:', err);
    saveLocalQuizResult({
      name: cleanName,
      email: cleanEmail,
      score: submission.score,
      total_questions: submission.total_questions,
      percentage,
      completed_at: new Date().toISOString(),
      questionsSummary: submission.questionsSummary
    });
    return { success: true, isLocalFallback: true };
  }
}

/**
 * Retrieve all quiz records for a participant by their email (and optional name)
 */
export async function getParticipantQuizRecords(
  email: string,
  name?: string
): Promise<{
  participant: { name: string; email: string; created_at?: string } | null;
  submissions: QuizSubmission[];
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name ? name.trim() : '';

  // 1. Get local cached records
  const localResults = getLocalParticipantQuizResults(cleanEmail, cleanName);

  if (!isSupabaseConfigured() || !supabase) {
    const participantName = localResults[0]?.name || cleanName || 'Participant';
    return {
      participant: localResults.length > 0 || cleanEmail ? {
        name: participantName,
        email: cleanEmail,
        created_at: localResults[0]?.completed_at || new Date().toISOString()
      } : null,
      submissions: localResults
    };
  }

  try {
    // 2. Fetch user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (userError && userError.code !== 'PGRST116') {
      console.warn('Supabase fetch participant user error:', userError);
    }

    let remoteSubmissions: QuizSubmission[] = [];

    if (user?.id) {
      const { data: rows, error: quizError } = await supabase
        .from('quiz_results')
        .select('id, user_id, score, total_questions, percentage, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (!quizError && rows) {
        remoteSubmissions = rows.map((r) => {
          // Check if local cache has detailed questionsSummary for this record
          const localMatch = localResults.find(
            (lr) => lr.id === r.id || (Math.abs(new Date(lr.completed_at || 0).getTime() - new Date(r.completed_at).getTime()) < 5000)
          );

          return {
            id: r.id,
            user_id: r.user_id,
            name: user.name || cleanName,
            email: user.email,
            score: r.score,
            total_questions: r.total_questions,
            percentage: r.percentage,
            completed_at: r.completed_at,
            questionsSummary: localMatch?.questionsSummary
          };
        });
      }
    }

    // Merge remote and local submissions seamlessly without duplicate items
    const mergedMap = new Map<string, QuizSubmission>();

    // Add remote first
    remoteSubmissions.forEach((sub) => {
      const key = `${sub.completed_at}_${sub.score}`;
      mergedMap.set(key, sub);
    });

    // Add local submissions that are not already present
    localResults.forEach((sub) => {
      const key = `${sub.completed_at}_${sub.score}`;
      if (!mergedMap.has(key)) {
        mergedMap.set(key, sub);
      }
    });

    const combinedSubmissions = Array.from(mergedMap.values()).sort((a, b) => {
      const timeA = a.completed_at ? new Date(a.completed_at).getTime() : 0;
      const timeB = b.completed_at ? new Date(b.completed_at).getTime() : 0;
      return timeB - timeA;
    });

    const participantInfo = user ? {
      name: user.name || cleanName || (combinedSubmissions[0]?.name ?? 'Participant'),
      email: user.email,
      created_at: user.created_at
    } : (combinedSubmissions.length > 0 ? {
      name: combinedSubmissions[0].name || cleanName || 'Participant',
      email: cleanEmail,
      created_at: combinedSubmissions[0].completed_at
    } : null);

    return {
      participant: participantInfo,
      submissions: combinedSubmissions
    };
  } catch (err) {
    console.warn('Lookup error in getParticipantQuizRecords, falling back to local:', err);
    return {
      participant: localResults.length > 0 ? {
        name: localResults[0]?.name || cleanName || 'Participant',
        email: cleanEmail,
        created_at: localResults[0]?.completed_at
      } : null,
      submissions: localResults
    };
  }
}

/**
 * Save detection scenario score to Supabase (or local storage fallback).
 */
export async function submitDetectionResult(submission: {
  name: string;
  email: string;
  score: number;
  total_scenarios: number;
}): Promise<{ success: boolean; error?: string; isLocalFallback?: boolean }> {
  const percentage = Math.round((submission.score / submission.total_scenarios) * 100);

  if (!isSupabaseConfigured() || !supabase) {
    saveLocalDetectionResult({
      name: submission.name.trim(),
      email: submission.email.trim().toLowerCase(),
      score: submission.score,
      total_scenarios: submission.total_scenarios,
      percentage,
      completed_at: new Date().toISOString()
    });
    return { success: true, isLocalFallback: true };
  }

  try {
    const cleanEmail = submission.email.trim().toLowerCase();
    const cleanName = submission.name.trim();

    let userId: string | null = null;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingUser?.id) {
      userId = existingUser.id;
    } else {
      const { data: newUser } = await supabase
        .from('users')
        .insert([{ name: cleanName, email: cleanEmail }])
        .select('id')
        .single();
      if (newUser) userId = newUser.id;
    }

    const { error: detectionError } = await supabase
      .from('detection_results')
      .insert([
        {
          user_id: userId,
          score: submission.score,
          total_scenarios: submission.total_scenarios,
          percentage,
          completed_at: new Date().toISOString()
        }
      ]);

    if (detectionError) {
      console.warn('Detection result insert warning:', detectionError);
      saveLocalDetectionResult({
        name: cleanName,
        email: cleanEmail,
        score: submission.score,
        total_scenarios: submission.total_scenarios,
        percentage,
        completed_at: new Date().toISOString()
      });
      return { success: true, isLocalFallback: true };
    }

    // Insert activity log
    try {
      await supabase
        .from('activity_logs')
        .insert([
          {
            user_id: userId,
            activity_type: 'detection',
            score: submission.score,
            created_at: new Date().toISOString()
          }
        ]);
    } catch {
      // Non-blocking
    }

    return { success: true, isLocalFallback: false };
  } catch (err) {
    console.error('Submit detection exception:', err);
    saveLocalDetectionResult({
      name: submission.name,
      email: submission.email,
      score: submission.score,
      total_scenarios: submission.total_scenarios,
      percentage,
      completed_at: new Date().toISOString()
    });
    return { success: true, isLocalFallback: true };
  }
}

/**
 * Check if a participant email has already been used to take the Quiz.
 * Enforces one attempt per participant email.
 */
export async function checkEmailAlreadyUsedForQuiz(email: string): Promise<{
  alreadyUsed: boolean;
  existingRecord?: QuizSubmission;
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { alreadyUsed: false };
  }

  // 1. Check local storage
  const localRecords = getLocalParticipantQuizResults(cleanEmail);
  if (localRecords.length > 0) {
    return {
      alreadyUsed: true,
      existingRecord: localRecords[0]
    };
  }

  // 2. Check Supabase database if configured
  if (!isSupabaseConfigured() || !supabase) {
    return { alreadyUsed: false };
  }

  try {
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (user?.id) {
      const { data: results, error } = await supabase
        .from('quiz_results')
        .select('id, user_id, score, total_questions, percentage, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1);

      if (!error && results && results.length > 0) {
        return {
          alreadyUsed: true,
          existingRecord: {
            id: results[0].id,
            user_id: results[0].user_id,
            name: user.name,
            email: user.email,
            score: results[0].score,
            total_questions: results[0].total_questions,
            percentage: results[0].percentage,
            completed_at: results[0].completed_at
          }
        };
      }
    }

    return { alreadyUsed: false };
  } catch (err) {
    console.warn('Error checking quiz email existence:', err);
    return { alreadyUsed: false };
  }
}

/**
 * Check if a participant email has already been used in the Detection Simulator.
 * Enforces one attempt per participant email.
 */
export async function checkEmailAlreadyUsedForDetection(email: string): Promise<{
  alreadyUsed: boolean;
  existingRecord?: DetectionSubmission;
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { alreadyUsed: false };
  }

  // 1. Check local storage
  const localRecords = getLocalParticipantDetectionResults(cleanEmail);
  if (localRecords.length > 0) {
    return {
      alreadyUsed: true,
      existingRecord: localRecords[0]
    };
  }

  // 2. Check Supabase database if configured
  if (!isSupabaseConfigured() || !supabase) {
    return { alreadyUsed: false };
  }

  try {
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (user?.id) {
      const { data: results, error } = await supabase
        .from('detection_results')
        .select('id, user_id, score, total_scenarios, percentage, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1);

      if (!error && results && results.length > 0) {
        return {
          alreadyUsed: true,
          existingRecord: {
            id: results[0].id,
            user_id: results[0].user_id,
            name: user.name,
            email: user.email,
            score: results[0].score,
            total_scenarios: results[0].total_scenarios,
            percentage: results[0].percentage,
            completed_at: results[0].completed_at
          }
        };
      }
    }

    return { alreadyUsed: false };
  } catch (err) {
    console.warn('Error checking detection email existence:', err);
    return { alreadyUsed: false };
  }
}

/**
 * Retrieve all detection simulator records for a participant by email
 */
export async function getParticipantDetectionRecords(
  email: string,
  name?: string
): Promise<{
  submissions: DetectionSubmission[];
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name ? name.trim() : '';

  const localResults = getLocalParticipantDetectionResults(cleanEmail, cleanName);

  if (!isSupabaseConfigured() || !supabase) {
    return { submissions: localResults };
  }

  try {
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', cleanEmail)
      .maybeSingle();

    let remoteSubmissions: DetectionSubmission[] = [];

    if (user?.id) {
      const { data: rows, error } = await supabase
        .from('detection_results')
        .select('id, user_id, score, total_scenarios, percentage, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (!error && rows) {
        remoteSubmissions = rows.map((r) => ({
          id: r.id,
          user_id: r.user_id,
          name: user.name || cleanName,
          email: user.email,
          score: r.score,
          total_scenarios: r.total_scenarios,
          percentage: r.percentage,
          completed_at: r.completed_at
        }));
      }
    }

    const mergedMap = new Map<string, DetectionSubmission>();
    remoteSubmissions.forEach((sub) => {
      mergedMap.set(`${sub.completed_at}_${sub.score}`, sub);
    });
    localResults.forEach((sub) => {
      const key = `${sub.completed_at}_${sub.score}`;
      if (!mergedMap.has(key)) {
        mergedMap.set(key, sub);
      }
    });

    const combined = Array.from(mergedMap.values()).sort((a, b) => {
      const timeA = a.completed_at ? new Date(a.completed_at).getTime() : 0;
      const timeB = b.completed_at ? new Date(b.completed_at).getTime() : 0;
      return timeB - timeA;
    });

    return { submissions: combined };
  } catch (err) {
    console.warn('Error in getParticipantDetectionRecords:', err);
    return { submissions: localResults };
  }
}

/**
 * Fetch project activity statistics for CEP presentation
 */
export async function fetchProjectStats(): Promise<ProjectStats> {
  const localStats = getLocalStats();

  if (!isSupabaseConfigured() || !supabase) {
    return localStats;
  }

  try {
    // 0. Fetch unique registered users
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // 1. Fetch total quiz rows
    const { count: quizCount, error: quizError } = await supabase
      .from('quiz_results')
      .select('*', { count: 'exact', head: true });

    // 2. Fetch total detection rows
    const { count: detectionCount, error: detectError } = await supabase
      .from('detection_results')
      .select('*', { count: 'exact', head: true });

    // 3. Fetch average percentage
    const { data: scoreData, error: scoreError } = await supabase
      .from('quiz_results')
      .select('percentage');

    if (quizError || detectError) {
      return localStats;
    }

    // Unique participants: if 1 user does both quiz and detect, they are counted once
    const totalParticipants = Math.max(userCount || 0, localStats.totalParticipants);
    const totalQuizzes = Math.max(quizCount || 0, localStats.totalQuizAttempts);
    const totalDetections = Math.max(detectionCount || 0, localStats.totalDetectionAttempts);

    let avgScore = 0;
    if (scoreData && scoreData.length > 0) {
      const validScores = scoreData.map((s) => s.percentage).filter((p) => typeof p === 'number' && !isNaN(p));
      if (validScores.length > 0) {
        const sum = validScores.reduce((acc, curr) => acc + curr, 0);
        avgScore = Math.round(sum / validScores.length);
      }
    } else if (localStats.averageAwarenessScore > 0) {
      avgScore = localStats.averageAwarenessScore;
    }

    return {
      totalParticipants,
      totalQuizAttempts: totalQuizzes,
      totalDetectionAttempts: totalDetections,
      averageAwarenessScore: avgScore
    };
  } catch (err) {
    console.warn('Failed to fetch remote stats, returning local:', err);
    return localStats;
  }
}
