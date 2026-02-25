import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import SkillsPanel from './components/SkillsPanel';
import JobsPanel from './components/JobsPanel';
import SubAgentsPanel from './components/SubAgentsPanel';
import CalendarPanel from './components/CalendarPanel';
import SystemMetricsPanel from './components/SystemMetricsPanel';
import VoiceCommandBar from './components/VoiceCommandBar';
import { 
  LayoutDashboard, 
  Wrench, 
  Briefcase, 
  Users, 
  Calendar, 
  Activity,
  Mic,
  Cpu,
  Zap
} from 'lucide-react';

// Dynamic import for 3D canvas (no SSR)
const NeuralCore = lazy(() => import('./components/NeuralCore'));

const tabs = [
  { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
  { id: 'skills', label: 'SKILLS', icon: Wrench },
  { id: 'jobs', label: 'JOBS', icon: Briefcase },
  { id: 'agents', label: 'AGENTS', icon: Users },
  { id: 'calendar', label: 'CALENDAR', icon: Calendar },
  { id: 'metrics', label: 'METRICS', icon: Activity },
];

function LoadingCore() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-32 h-32 border-4 border-jarvis-cyan/30 border-t-jarvis-cyan rounded-full animate-spin" />
    </div>
  );
}

function OverviewPanel() {
  const skills = useStore((s) => s.skills);
  const jobs = useStore((s) => s.jobs);
  const subAgents = useStore((s) => s.subAgents);
  const metrics = useStore((s) => s.metrics);

  const activeSkills = skills.filter((s) => s.status === 'active').length;
  const runningJobs = jobs.filter((j) => j.status === 'running').length;
  const onlineAgents = subAgents.filter((a) => a.status !== 'offline').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      {/* Neural Core - Centerpiece */}
      <div className="col-span-2 lg:col-span-4 glass-panel rounded-xl p-6 relative overflow-hidden min-h-[300px]">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<LoadingCore />}>
            <NeuralCore />
          </Suspense>
        </div>
        <div className="relative z-10 text-center mt-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-orbitron text-4xl cyan-glow mb-2"
          >
            JARVIS NEURAL CORE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-jarvis-cyan-dim font-rajdhani text-lg"
          >
            OpenClaw Master Control • v2.6
          </motion.p>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-xl p-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-jarvis-cyan/20 rounded-lg">
            <Wrench className="w-5 h-5 text-jarvis-cyan" />
          </div>
          <span className="text-gray-400 text-sm">Active Skills</span>
        </div>
        <div className="font-orbitron text-3xl cyan-glow">{activeSkills}/{skills.length}</div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-panel rounded-xl p-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-jarvis-neon/20 rounded-lg">
            <Zap className="w-5 h-5 text-jarvis-neon" />
          </div>
          <span className="text-gray-400 text-sm">Running Jobs</span>
        </div>
        <div className="font-orbitron text-3xl magenta-glow">{runningJobs}/{jobs.length}</div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-panel rounded-xl p-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-jarvis-magenta/20 rounded-lg">
            <Users className="w-5 h-5 text-jarvis-magenta" />
          </div>
          <span className="text-gray-400 text-sm">Online Agents</span>
        </div>
        <div className="font-orbitron text-3xl magenta-glow">{onlineAgents}/{subAgents.length}</div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-panel rounded-xl p-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-jarvis-neon/20 rounded-lg">
            <Cpu className="w-5 h-5 text-jarvis-neon" />
          </div>
          <span className="text-gray-400 text-sm">Token Usage</span>
        </div>
        <div className="font-orbitron text-3xl text-jarvis-neon">
          {((metrics.tokensUsed / metrics.tokensLimit) * 100).toFixed(0)}%
        </div>
      </motion.div>

      {/* Mini panels */}
      <div className="col-span-2 lg:col-span-2 glass-panel rounded-xl p-4 overflow-hidden">
        <h3 className="font-orbitron text-sm cyan-glow mb-3">RECENT JOBS</h3>
        <div className="space-y-2 overflow-y-auto max-h-[200px]">
          {jobs.slice(0, 3).map((job) => (
            <div key={job.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{job.name}</span>
              <span className={`px-2 py-0.5 rounded text-xs uppercase ${
                job.status === 'running' ? 'bg-jarvis-neon/20 text-jarvis-neon' :
                job.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {job.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 lg:col-span-2 glass-panel rounded-xl p-4 overflow-hidden">
        <h3 className="font-orbitron text-sm magenta-glow mb-3">AGENT STATUS</h3>
        <div className="space-y-2 overflow-y-auto max-h-[200px]">
          {subAgents.slice(0, 3).map((agent) => (
            <div key={agent.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{agent.name}</span>
              <span className={`px-2 py-0.5 rounded text-xs uppercase ${
                agent.status === 'online' ? 'bg-jarvis-neon/20 text-jarvis-neon' :
                agent.status === 'busy' ? 'bg-jarvis-magenta/20 text-jarvis-magenta' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {agent.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);

  return (
    <div className="h-screen w-screen overflow-hidden bg-jarvis-void grid-bg scanlines">
      {/* Header */}
      <header className="h-16 glass-panel border-b border-jarvis-cyan/20 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-2 border-jarvis-cyan rounded-full flex items-center justify-center"
          >
            <div className="w-6 h-6 bg-jarvis-cyan rounded-full animate-pulse" />
          </motion.div>
          <h1 className="font-orbitron text-xl cyan-glow">JARVIS NEURAL CORE</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Mic className="w-4 h-4" />
            <span>Voice Active</span>
          </div>
          <div className="font-orbitron text-sm text-jarvis-cyan">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <nav className="w-20 glass-panel border-r border-jarvis-cyan/20 flex flex-col items-center py-4 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === tab.id
                  ? 'bg-jarvis-cyan/20 shadow-jarvis-glow'
                  : 'hover:bg-jarvis-cyan/10'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-jarvis-cyan' : 'text-gray-500'}`} />
              <span className={`text-[10px] ${activeTab === tab.id ? 'text-jarvis-cyan' : 'text-gray-500'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Panel Area */}
        <main className="flex-1 p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'overview' && <OverviewPanel />}
              {activeTab === 'skills' && <SkillsPanel />}
              {activeTab === 'jobs' && <JobsPanel />}
              {activeTab === 'agents' && <SubAgentsPanel />}
              {activeTab === 'calendar' && <CalendarPanel />}
              {activeTab === 'metrics' && <SystemMetricsPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Voice Command Bar */}
      <VoiceCommandBar />
    </div>
  );
}
