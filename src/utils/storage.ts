import { ProjectStats, QuizSubmission, DetectionSubmission } from '../types';

const QUIZ_STORAGE_KEY = 'cyberaware_quiz_submissions';
const DETECTION_STORAGE_KEY = 'cyberaware_detection_submissions';

export function saveLocalQuizResult(data: QuizSubmission): void {
  try {
    const existing = getLocalQuizResults();
    existing.push({ ...data, id: 'local_' + Date.now() });
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Error saving local quiz result:', e);
  }
}

export function getLocalQuizResults(): QuizSubmission[] {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const LAST_PARTICIPANT_KEY = 'cyberaware_last_participant';

export function saveLastParticipant(info: { name: string; email: string }): void {
  try {
    localStorage.setItem(LAST_PARTICIPANT_KEY, JSON.stringify(info));
  } catch {
    // Ignore storage quota
  }
}

export function getLastParticipant(): { name: string; email: string } | null {
  try {
    const raw = localStorage.getItem(LAST_PARTICIPANT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getLocalParticipantQuizResults(email: string, name?: string): QuizSubmission[] {
  const all = getLocalQuizResults();
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name ? name.trim().toLowerCase() : '';

  return all.filter((item) => {
    const itemEmail = item.email ? item.email.trim().toLowerCase() : '';
    const itemName = item.name ? item.name.trim().toLowerCase() : '';
    
    if (cleanEmail && itemEmail === cleanEmail) {
      return true;
    }
    if (cleanName && itemName.includes(cleanName)) {
      return true;
    }
    return false;
  }).sort((a, b) => {
    const timeA = a.completed_at ? new Date(a.completed_at).getTime() : 0;
    const timeB = b.completed_at ? new Date(b.completed_at).getTime() : 0;
    return timeB - timeA;
  });
}

export function saveLocalDetectionResult(data: DetectionSubmission): void {
  try {
    const existing = getLocalDetectionResults();
    existing.push({ ...data, id: 'local_' + Date.now() });
    localStorage.setItem(DETECTION_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Error saving local detection result:', e);
  }
}

export function getLocalDetectionResults(): DetectionSubmission[] {
  try {
    const raw = localStorage.getItem(DETECTION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getLocalParticipantDetectionResults(email: string, name?: string): DetectionSubmission[] {
  const all = getLocalDetectionResults();
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name ? name.trim().toLowerCase() : '';

  return all.filter((item) => {
    const itemEmail = item.email ? item.email.trim().toLowerCase() : '';
    const itemName = item.name ? item.name.trim().toLowerCase() : '';
    
    if (cleanEmail && itemEmail === cleanEmail) {
      return true;
    }
    if (cleanName && itemName && itemName.includes(cleanName)) {
      return true;
    }
    return false;
  }).sort((a, b) => {
    const timeA = a.completed_at ? new Date(a.completed_at).getTime() : 0;
    const timeB = b.completed_at ? new Date(b.completed_at).getTime() : 0;
    return timeB - timeA;
  });
}

const SCENARIOS_ANALYZED_KEY = 'cyberaware_scenarios_analyzed_count';

export function recordScenarioAnalyzed(): number {
  try {
    const current = getAnalyzedScenariosCount();
    const updated = current + 1;
    localStorage.setItem(SCENARIOS_ANALYZED_KEY, updated.toString());
    return updated;
  } catch {
    return 1;
  }
}

export function getAnalyzedScenariosCount(): number {
  try {
    const raw = localStorage.getItem(SCENARIOS_ANALYZED_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function getLocalStats(): ProjectStats {
  const quizzes = getLocalQuizResults();
  const detections = getLocalDetectionResults();
  const individualScenariosCount = getAnalyzedScenariosCount();

  // Deduplicate unique participants across both quizzes and detections
  // A participant who participates in BOTH quiz and detect is counted as 1 participant.
  const participantEmails = new Set<string>();
  quizzes.forEach((q) => {
    if (q.email && q.email.trim()) {
      participantEmails.add(q.email.trim().toLowerCase());
    } else if (q.name && q.name.trim()) {
      participantEmails.add(q.name.trim().toLowerCase());
    }
  });
  detections.forEach((d) => {
    if (d.email && d.email.trim()) {
      participantEmails.add(d.email.trim().toLowerCase());
    } else if (d.name && d.name.trim()) {
      participantEmails.add(d.name.trim().toLowerCase());
    }
  });

  const totalParticipants = participantEmails.size;

  // Deduplicate quizzes completed by participant email so 1 user cannot create duplicate quiz count
  const quizParticipantEmails = new Set<string>();
  quizzes.forEach((q) => {
    if (q.email && q.email.trim()) {
      quizParticipantEmails.add(q.email.trim().toLowerCase());
    } else if (q.name && q.name.trim()) {
      quizParticipantEmails.add(q.name.trim().toLowerCase());
    }
  });
  const totalQuizzes = quizParticipantEmails.size;

  // Real count of scenarios analyzed across all detection runs and evaluations
  const scenariosFromSubmissions = detections.reduce((acc, d) => acc + (d.total_scenarios || 1), 0);
  const totalDetections = Math.max(scenariosFromSubmissions, individualScenariosCount);

  // Compute real average score from actual user attempts
  const allPercentages: number[] = [];
  quizzes.forEach((q) => {
    if (typeof q.percentage === 'number' && !isNaN(q.percentage)) {
      allPercentages.push(q.percentage);
    }
  });

  detections.forEach((d) => {
    if (typeof d.percentage === 'number' && !isNaN(d.percentage)) {
      allPercentages.push(d.percentage);
    }
  });

  const avg = allPercentages.length > 0
    ? Math.round(allPercentages.reduce((acc, curr) => acc + curr, 0) / allPercentages.length)
    : 0;

  return {
    totalParticipants,
    totalQuizAttempts: totalQuizzes,
    totalDetectionAttempts: totalDetections,
    averageAwarenessScore: avg
  };
}
