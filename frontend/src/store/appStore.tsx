import { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, AbilityProfile, UserRole, GuidanceConfig, TaskRecord } from '../types';

interface AppState {
  currentUser: User | null;
  currentRole: UserRole;
  abilityProfile: AbilityProfile | null;
  taskRecords: TaskRecord[];
  guidanceConfig: GuidanceConfig;
  isLoggedIn: boolean;
  currentPage: string;
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'SET_PROFILE'; payload: AbilityProfile }
  | { type: 'SET_GUIDANCE_CONFIG'; payload: Partial<GuidanceConfig> }
  | { type: 'LOGIN'; payload: { user: User; role: UserRole } }
  | { type: 'LOGOUT' }
  | { type: 'SET_PAGE'; payload: string }
  | { type: 'ADD_TASK_RECORD'; payload: TaskRecord }
  | { type: 'SET_TASK_RECORDS'; payload: TaskRecord[] };

const initialState: AppState = {
  currentUser: null,
  currentRole: 'patient',
  abilityProfile: null,
  taskRecords: [],
  guidanceConfig: {
    enabled: true,
    stepByStep: true,
    voicePrompts: true,
    visualHighlights: true,
    animations: true,
  },
  isLoggedIn: false,
  currentPage: 'dashboard',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_ROLE':
      const roleConfig = getRoleGuidanceConfig(action.payload);
      return { ...state, currentRole: action.payload, guidanceConfig: roleConfig };
    case 'SET_PROFILE':
      return { ...state, abilityProfile: action.payload };
    case 'SET_GUIDANCE_CONFIG':
      return { ...state, guidanceConfig: { ...state.guidanceConfig, ...action.payload } };
    case 'LOGIN':
      const loginRoleConfig = getRoleGuidanceConfig(action.payload.role);
      return {
        ...state,
        currentUser: action.payload.user,
        currentRole: action.payload.role,
        isLoggedIn: true,
        guidanceConfig: loginRoleConfig,
      };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'ADD_TASK_RECORD':
      return { ...state, taskRecords: [...state.taskRecords, action.payload] };
    case 'SET_TASK_RECORDS':
      return { ...state, taskRecords: action.payload };
    default:
      return state;
  }
}

function getRoleGuidanceConfig(role: UserRole): GuidanceConfig {
  switch (role) {
    case 'patient':
      return {
        enabled: true,
        stepByStep: true,
        voicePrompts: true,
        visualHighlights: true,
        animations: true,
      };
    case 'parent':
      return {
        enabled: true,
        stepByStep: false,
        voicePrompts: false,
        visualHighlights: true,
        animations: true,
      };
    case 'teacher':
      return {
        enabled: false,
        stepByStep: false,
        voicePrompts: false,
        visualHighlights: false,
        animations: true,
      };
    case 'admin':
      return {
        enabled: false,
        stepByStep: false,
        voicePrompts: false,
        visualHighlights: false,
        animations: false,
      };
    default:
      return initialState.guidanceConfig;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
