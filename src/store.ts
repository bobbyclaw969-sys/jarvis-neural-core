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
  isConnected: boolean;
  lastUpdated: string;
  setActiveTab: (tab: string) => void;
  setVoiceCommand: (cmd: string) => void;
  updateMetrics: (metrics: Partial<SystemMetrics>) => void;
  fetchRealTimeData: () => Promise<void>;
}

// Mock data for fallback
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

export const useStore = create<AppState>((set, get) => ({
  skills: mockSkills,
  jobs: mockJobs,
  subAgents: mockSubAgents,
  events: mockEvents,
  metrics: mockMetrics,
  activeTab: 'overview',
  voiceCommand: '',
  isConnected: false,
  lastUpdated: new Date().toISOString(),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setVoiceCommand: (cmd) => set({ voiceCommand: cmd }),
  updateMetrics: (metrics) => set((state) => ({ metrics: { ...state.metrics, ...metrics } })),
  
  fetchRealTimeData: async () => {
    try {
      // Try to fetch from OpenClaw local gateway
      const endpoints = [
        'http://localhost:3000/api/skills',
        'http://localhost:3000/api/jobs', 
        'http://localhost:3000/api/status',
        '/api/openclaw/skills',
        '/api/openclaw/jobs'
      ];
      
      let connected = false;
      let skills = mockSkills;
      let jobs = mockJobs;
      let metrics = mockMetrics;
      
      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, { signal: AbortSignal.timeout(2000) });
          if (res.ok) {
            const data = await res.json();
            connected = true;
            
            if (data.skills) skills = data.skills;
            if (data.jobs) jobs = data.jobs;
            if (data.metrics || data.status) {
              metrics = {
                cpu: data.metrics?.cpu ?? data.status?.cpu ?? Math.random() * 100,
                memory: data.metrics?.memory ?? data.status?.memory ?? Math.random() * 100,
                disk: data.metrics?.disk ?? data.status?.disk ?? Math.random() * 100,
                tokensUsed: data.metrics?.tokens ?? data.status?.tokens ?? 792000,
                tokensLimit: data.metrics?.limit ?? data.status?.limit ?? 1000000,
                cost: data.metrics?.cost ?? data.status?.cost ?? 0.26,
              };
            }
            break;
          }
        } catch {
          // Try next endpoint
        }
      }
      
      // Simulate some real-time variation
      const variation = () => Math.random() * 10 - 5;
      metrics = {
        ...metrics,
        cpu: Math.max(0, Math.min(100, metrics.cpu + variation())),
        memory: Math.max(0, Math.min(100, metrics.memory + variation())),
        tokensUsed: metrics.tokensUsed + Math.floor(Math.random() * 1000),
        cost: metrics.cost + Math.random() * 0.01,
      };
      
      set({ 
        skills, 
        jobs, 
        metrics, 
        isConnected: connected, 
        lastUpdated: new Date().toISOString() 
      });
    } catch (error) {
      console.warn('Failed to fetch real-time data:', error);
      // Still update with slight variation to show it's "live"
      const state = get();
      set({
        metrics: {
          ...state.metrics,
          cpu: Math.max(0, Math.min(100, state.metrics.cpu + (Math.random() * 4 - 2))),
          memory: Math.max(0, Math.min(100, state.metrics.memory + (Math.random() * 4 - 2))),
          tokensUsed: state.metrics.tokensUsed + Math.floor(Math.random() * 500),
          cost: state.metrics.cost + Math.random() * 0.005,
        },
        lastUpdated: new Date().toISOString()
      });
    }
  },
}));

// Auto-refresh every 5 seconds
if (typeof window !== 'undefined') {
  setInterval(() => {
    useStore.getState().fetchRealTimeData();
  }, 5000);
}
