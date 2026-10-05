export interface TopicVideo {
  title: string;
  channelName: string;
  thumbnailUrl: string;
  videoUrl?: string;
  youtubeId?: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  iconName: string;
  readTime: string;
  whatIsIt: string;
  howItWorks: string[];
  warningSigns: string[];
  exampleScenario: {
    title: string;
    context: string;
    attackerMethod: string;
    impact: string;
  };
  protectionTips: string[];
  videos?: TopicVideo[];
}

export type ScenarioVerdict = 'safe' | 'suspicious' | 'scam';

export interface DetectionScenario {
  id: string;
  title: string;
  channel: 'SMS' | 'Email' | 'WhatsApp' | 'Social Media' | 'Job Portal';
  sender: string;
  subjectOrHeader?: string;
  messageContent: string;
  timestamp: string;
  correctVerdict: ScenarioVerdict;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  explanation: string;
  redFlags: string[];
  safeActions: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

export interface Participant {
  id?: string;
  name: string;
  email: string;
  created_at?: string;
}

export interface QuizQuestionSummary {
  questionText: string;
  isCorrect: boolean;
  explanation: string;
  topic?: string;
}

export interface QuizSubmission {
  id?: string;
  user_id?: string;
  name?: string;
  email?: string;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at?: string;
  questionsSummary?: QuizQuestionSummary[];
}

export interface ParticipantProfile {
  id?: string;
  name: string;
  email: string;
  created_at?: string;
  quizSubmissions: QuizSubmission[];
}

export interface DetectionSubmission {
  id?: string;
  user_id?: string;
  name?: string;
  email?: string;
  score: number;
  total_scenarios: number;
  percentage: number;
  completed_at?: string;
}

export interface ProjectStats {
  totalParticipants: number;
  totalQuizAttempts: number;
  totalDetectionAttempts: number;
  averageAwarenessScore: number;
}
