import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Zap, Cpu, Shield, GitBranch, Search, Database, Layers } from 'lucide-react';

interface AgentTemplate {
  id: string;
  name: string;
  role: 'coordinator' | 'worker' | 'observer' | 'specialist';
  description: string;
  category: string;
  icon: React.ReactNode;
}

const agentTemplates: AgentTemplate[] = [
  { id: 'coder', name: 'Codex Coder', role: 'worker', description: 'Write, refactor, and implement code', category: 'development', icon: <Cpu className="w-4 h-4" /> },
  { id: 'reviewer', name: 'Code Reviewer', role: 'worker', description: 'Review PRs, check quality, suggest improvements', category: 'development', icon: <Search className="w-4 h-4" /> },
  { id: 'researcher', name: 'Research Agent', role: 'worker', description: 'Web search, gather info, analyze data', category: 'research', icon: <Search className="w-4 h-4" /> },
  { id: 'coordinator', name: 'Swarm Coordinator', role: 'coordinator', description: 'Orchestrate multiple agents, manage tasks', category: 'orchestration', icon: <Layers className="w-4 h-4" /> },
  { id: 'memory', name: 'Memory Manager', role: 'specialist', description: 'Store and retrieve context, RAG operations', category: 'memory', icon: <Database className="w-4 h-4" /> },
  { id: 'security', name: 'Security Auditor', role: 'specialist', description: 'Scan for vulnerabilities, audit code', category: 'security', icon: <Shield className="w-4 h-4" /> },
  { id: 'github', name: 'GitHub Manager', role: 'worker', description: 'Manage issues, PRs, releases', category: 'devops', icon: <GitBranch className="w-4 h-4" /> },
];

const categories = ['all', 'development', 'research', 'orchestration', 'memory', 'security', 'devops'];

const roleColors = {
  coordinator: 'border-jarvis-cyan bg-jarvis-cyan/10',
  worker: 'border-jarvis-magenta bg-jarvis-magenta/10',
  specialist: 'border-jarvis-neon bg-jarvis-neon/10',
  observer: 'border-gray-500 bg-gray-500/10',
};

export default function AgentSpawner() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [spawnedAgents, setSpawnedAgents] = useState<AgentTemplate[]>([]);
  const [showSpawned, setShowSpawned] = useState(false);

  const filteredAgents = selectedCategory === 'all' 
    ? agentTemplates 
    : agentTemplates.filter(a => a.category === selectedCategory);

  const spawnAgent = (template: AgentTemplate) => {
    setSpawnedAgents([...spawnedAgents, { ...template, id: `${template.id}-${Date.now()}` }]);
  };

  const removeAgent = (id: string) => {
    setSpawnedAgents(spawnedAgents.filter(a => a.id !== id));
  };

  return (
    <div className="glass-panel rounded-xl p-4 h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-orbitron text-lg cyan-glow flex items-center gap-2">
          <Plus className="w-5 h-5" />
          AGENT SPAWNER
        </h2>
        <button 
          onClick={() => setShowSpawned(!showSpawned)}
          className="text-xs px-2 py-1 rounded bg-jarvis-cyan/20 text-jarvis-cyan"
        >
          Active ({spawnedAgents.length})
        </button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-1 rounded text-xs transition-all ${
              selectedCategory === cat 
                ? 'bg-jarvis-cyan/30 text-jarvis-cyan' 
                : 'text-gray-500 hover:text-jarvis-cyan'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Agent templates grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-2">
          {filteredAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-panel rounded-lg p-3 border-2 ${roleColors[agent.role]} glitch-hover`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded bg-gray-800">
                    {agent.icon}
                  </div>
                  <div>
                    <div className="font-orbitron text-sm cyan-glow">{agent.name}</div>
                    <div className="text-xs text-gray-500">{agent.description}</div>
                    <span className="text-[10px] uppercase px-1 py-0.5 rounded bg-gray-800 text-gray-400">
                      {agent.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => spawnAgent(agent)}
                  className="px-3 py-1 rounded-lg bg-jarvis-cyan/20 text-jarvis-cyan text-xs hover:bg-jarvis-cyan/30 transition-all flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  Spawn
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Spawned agents panel */}
      <AnimatePresence>
        {showSpawned && spawnedAgents.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-800"
          >
            <h3 className="font-orbitron text-sm text-jarvis-cyan mb-2">Active Agents</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {spawnedAgents.map(agent => (
                <div key={agent.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-jarvis-neon rounded-full animate-pulse" />
                    <span className="text-gray-300">{agent.name}</span>
                  </div>
                  <button
                    onClick={() => removeAgent(agent.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claude Flow reference */}
      <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
        <p>Using Claude Flow agent templates • 100+ skills available</p>
      </div>
    </div>
  );
}
