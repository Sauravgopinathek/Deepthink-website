export interface Decision {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
  criteria: DecisionCriteria[];
  status: 'draft' | 'analyzing' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  aiInsights?: string[];
  confidence?: number;
}

export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  scores: { [criteriaId: string]: number };
  totalScore?: number;
  aiRecommendation?: string;
}

export interface DecisionCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  aiSuggested?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'personal' | 'financial' | 'health' | 'relationships';
  priority: 'high' | 'medium' | 'low';
  deadline: Date;
  progress: number;
  milestones: Milestone[];
  status: 'active' | 'completed' | 'paused';
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
}

export interface AssessmentResult {
  category: string;
  score: number;
  description: string;
  recommendations: string[];
}

export interface CoreValue {
  id: string;
  name: string;
  description: string;
  importance: number;
  alignment: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'exercise' | 'tool' | 'video' | 'book' | 'course';
  category: string;
  readTime: number;
  url?: string;
  content?: string;
  author?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  rating?: number;
  reviews?: number;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  expertise: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  bio: string;
  languages: string[];
  timezone: string;
  availability: 'available' | 'busy' | 'offline';
  specializations: string[];
  menteeCount: number;
  responseTime: string;
  hourlyRate?: number;
  sessionTypes: ('video' | 'audio' | 'chat' | 'in-person')[];
  // Real platform integration fields
  platform: 'adplist' | 'mentorcruise' | 'calendly' | 'cal' | string;
  platformId: string;
  calendlyUrl?: string;
  linkedinUrl?: string;
  nextAvailableSlot?: string;
  availableSlots?: string[];
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  userId: string;
  title: string;
  description: string;
  scheduledAt: Date;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  type: 'video' | 'chat' | 'phone';
  notes?: string;
  recording?: string;
  chatHistory?: ChatMessage[];
  meetingUrl?: string;
  platform?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
}

export interface MentorshipRequest {
  id: string;
  userId: string;
  mentorId: string;
  subject: string;
  message: string;
  preferredTime: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  sessionType: 'video' | 'audio' | 'chat';
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  preferences: UserPreferences;
  subscription: 'free' | 'premium' | 'enterprise';
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    goalReminders: boolean;
    mentorUpdates: boolean;
    weeklyDigest: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showLocation: boolean;
    allowMentorRequests: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
}

export interface AIAssistant {
  id: string;
  name: string;
  type: 'decision' | 'career' | 'general';
  status: 'online' | 'thinking' | 'offline';
  capabilities: string[];
}

export interface AIConversation {
  id: string;
  userId: string;
  assistantId: string;
  messages: AIMessage[];
  context: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
  suggestions?: string[];
}

export interface VideoCallSession {
  id: string;
  participants: string[];
  status: 'waiting' | 'active' | 'ended';
  startTime: Date;
  endTime?: Date;
  recordingUrl?: string;
  chatMessages: ChatMessage[];
}

// Real mentor platform integration types
export interface MentorPlatformResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export interface SchedulingResult {
  success: boolean;
  meetingId?: string;
  meetingUrl?: string;
  scheduledTime?: string;
  mentor?: Mentor;
  message: string;
}

export interface MentorAvailability {
  available: boolean;
  slots: string[];
  nextAvailable?: string;
}