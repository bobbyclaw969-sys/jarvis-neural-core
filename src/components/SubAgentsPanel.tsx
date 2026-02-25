import { motion } from 'framer-motion';
import { useStore, type SubAgent } from '../store';
import { Users, Zap, Wifi, WifiOff, Cpu } from 'lucide-react';

function AgentCard({ agent, index }: { agent: SubAgent; index: number }) {
  const statusConfig = {
    online: { color: 'text-jarvis-neon', icon: Wifi, glow: 'shadow-jarvis-glow' },
    busy: { color: 'text-jarvis-magenta', icon: Zap, glow: 'shadow-jarvis-glow-magenta' },
    offline: { color: 'text-gray-500', icon: WifiOff, glow: '' },
  };

  const config = statusConfig[agent.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-panel rounded-lg p-4 glitch-hover ${config.glow}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${agent.status !== 'offline' ? 'bg-jarvis-cyan/20' : 'bg-gray-800'}`}>
            <Users className={`w-4 h-4 ${config.color}`} />
          </div>
          <div>
            <div className="font-orbitron text-sm cyan-glow">{agent.name}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              {agent.type}
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${config.color}`}>
          <Icon className="w-3 h-3" />
          <span className="text-xs uppercase">{agent.status}</span>
        </div>
      </div>

      {/* Health bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Health</span>
          <span className={agent.health > 70 ? 'text-jarvis-neon' : agent.health > 30 ? 'text-yellow-500' : 'text-red-500'}>
            {agent.health}%
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              agent.health > 70 ? 'bg-jarvis-neon' : agent.health > 30 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${agent.health}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
              boxShadow: agent.health > 70 ? '0 0 10px #00ffaa' : 'none',
            }}
          />
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Tasks completed: <span className="text-jarvis-cyan">{agent.tasksCompleted}</span>
      </div>
    </motion.div>
  );
}

export default function SubAgentsPanel() {
  const subAgents = useStore((s) => s.subAgents);

  return (
    <div className="glass-panel rounded-xl p-4 h-full overflow-hidden flex flex-col">
      <h2 className="font-orbitron text-lg magenta-glow mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-jarvis-magenta rounded-full animate-pulse" />
        SUB-AGENTS
      </h2>
      <div className="flex-1 overflow-y-auto grid grid-cols-1 gap-3 pr-2">
        {subAgents.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>
    </div>
  );
}
