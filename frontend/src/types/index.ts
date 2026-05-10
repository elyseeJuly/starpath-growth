export type UserRole = 'patient' | 'parent' | 'teacher' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AbilityProfile {
  id: number;
  user_id: number;
  social_ability: number;
  cognitive_ability: number;
  daily_living_ability: number;
  emotion_management: number;
  communication_ability: number;
  vocational_ability: number;
  adaptability: number;
  sensory_ability: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  steps: string[];
  category: string;
  created_at: string;
}

export interface TaskRecord {
  id: number;
  user_id: number;
  task_id: number;
  steps_completed: number;
  total_steps: number;
  intervention_count: number;
  quality_score: number;
  emotion_state: string;
  created_at: string;
}

export interface BehaviorRecord {
  id: number;
  user_id: number;
  record_type: string;
  data: Record<string, unknown>;
  recorded_by: number;
  created_at: string;
}

export interface InterventionSuggestion {
  user_id: number;
  suggestions: string[];
  focus_areas: string[];
}

export interface SimulationResult {
  id: number;
  scenario: string;
  patient_id: number | null;
  parameters: Record<string, unknown>;
  results: Record<string, unknown>;
  created_at: string;
}

export type EmotionType = 'calm' | 'anxious' | 'happy' | 'irritated';

export interface GuidedStep {
  id: string;
  title: string;
  description: string;
  highlightElement?: string;
  action?: () => void;
  nextStepId?: string;
}

export interface GuidanceConfig {
  enabled: boolean;
  stepByStep: boolean;
  voicePrompts: boolean;
  visualHighlights: boolean;
  animations: boolean;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'radio';
  required: boolean;
  collectType: 'manual' | 'device' | 'auto';
  visibleRoles: UserRole[];
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}
