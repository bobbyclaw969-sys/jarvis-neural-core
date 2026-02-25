import { create } from 'zustand';

export interface Skill {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'idle' | 'error';
  progress: number;
  category: string;
}

export interface Job {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'pending' | 'failed';
  stage: number;
  totalStages: number;
  startedAt: string;
}

export interface SubAgent {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'busy' | 'offline';
  health: number;
  tasksCompleted: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'meeting' | 'task' | 'reminder';
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  tokensUsed: number;
  tokensLimit: number;
  cost: number;
}

interface AppState {
  skills: Skill[];
  jobs: Job[];
  subAgents: SubAgent[];
  events: CalendarEvent[];
  metrics: SystemMetrics;
  activeTab: string;
  voiceCommand: string;
  setActiveTab: (tab: string) => void;
  setVoiceCommand: (cmd: string) => void;
  updateMetrics: (metrics: Partial<SystemMetrics>) => void;
}

const mockSkills: Skill[] = [
  { id: '1', name: 'coding-agent', description: 'Code development and review', status: 'active', progress: 85, category: 'development' },
  { id: '2', name: 'gh-issues', description: 'GitHub issue management', status: 'active', progress: 100, category: 'devops' },
  { id: '3', name: 'github', description: 'GitHub operations', status: 'idle', progress: 0, category: 'devops' },
  { id: '4', name: 'weather', description: 'Weather data fetching', status: 'active', progress: 45, category: 'utility' },
  { id: '5', name: 'clawhub', description: 'Skill marketplace', status: 'idle', progress: 0, category: 'system' },
  { id: '6', name: 'healthcheck', description: 'Security audits', status: 'active', progress: 72, category: 'security' },
];

const mockJobs: Job[] = [
  { id: '1', name: 'Daily Briefing', status: 'completed', stage: 3, totalStages: 3, startedAt: '2026-02-25T08:00:00Z' },
  { id: '2', name: 'GitHub Sync', status: 'running', stage: 2, totalStages: 4, startedAt: '2026-02-25T10:30:00Z' },
  { id: '3', name: 'Memory Cleanup', status: 'pending', stage: 0, totalStages: 2, startedAt: '' },
  { id: '4', name: 'Health Check', status: 'running', stage: 1, totalStages: 5, startedAt: '2026-02-25T12:00:00Z' },
];

const mockSubAgents: SubAgent[] = [
  { id: '1', name: 'Builder-Agent', type: 'coding', status: 'busy', health: 95, tasksCompleted: 156 },
  { id: '2', name: 'Research-Agent', type: 'research', status: 'online', health: 100, tasksCompleted: 89 },
  { id: '3', name: 'Marketing-Agent', type: 'marketing', status: 'online', health: 88, tasksCompleted: 42 },
  { id: '4', name: 'Deploy-Agent', type: 'devops', status: 'offline', health: 0, tasksCompleted: 78 },
];

const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Team Standup', start: '2026-02-25T09:00:00Z', end: '2026-02-25T09:30:00Z', type: 'meeting' },
  { id: '2', title: 'Deploy v2.1', start: '2026-02-25T14:00:00Z', end: '2026-02-25T15:00:00Z', type: 'task' },
  { id: '3', title: 'Code Review', start: '2026-02-26T10:00:00Z', end: '2026-02-26T11:00:00Z', type: 'meeting' },
  { id: '4', title: 'Sprint Planning', start: '2026-02-27T13:00:00Z', end: '2026-02-27T14:30:00Z', type: 'meeting' },
];

const mockMetrics: SystemMetrics = {
  cpu: 42,
  memory: 67,
  disk: 34,
  tokensUsed: 792000,
  tokensLimit: 1000000,
  cost: 0.26,
};

export const useStore = create<AppState>((set) => ({
  skills: mockSkills,
  jobs: mockJobs,
  subAgents: mockSubAgents,
  events: mockEvents,
  metrics: mockMetrics,
  activeTab: 'overview',
  voiceCommand: '',
  setActiveTab: (tab) => set({ activeTab: tab }),
  setVoiceCommand: (cmd) => set({ voiceCommand: cmd }),
  updateMetrics: (metrics) => set((state) => ({ metrics: { ...state.metrics, ...metrics } })),
}));
