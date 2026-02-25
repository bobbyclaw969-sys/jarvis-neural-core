import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Network, Zap, Users, GitBranch, Layers, Activity } from 'lucide-react';

// Claude Flow-style swarm visualization
interface SwarmNode {
  id: string;
  name: string;
  role: 'coordinator' | 'worker' | 'observer';
  status: 'active' | 'idle' | 'error';
  tasks: number;
  connections: string[];
}

const mockSwarmNodes: SwarmNode[] = [
  { id: '1', name: 'Coordinator-Alpha', role: 'coordinator', status: 'active', tasks: 12, connections: ['2', '3', '4'] },
  { id: '2', name: 'Worker-Code', role: 'worker', status: 'active', tasks: 8, connections: ['1', '3'] },
  { id: '3', name: 'Worker-Research', role: 'worker', status: 'active', tasks: 5, connections: ['1', '2', '4'] },
  { id: '4', name: 'Worker-Deploy', role: 'worker', status: 'idle', tasks: 3, connections: ['1', '3'] },
  { id: '5', name: 'Observer-Log', role: 'observer', status: 'active', tasks: 0, connections: ['1'] },
];

const roleColors = {
  coordinator: 'border-jarvis-cyan shadow-jarvis-glow',
  worker: 'border-jarvis-magenta',
  observer: 'border-gray-500',
};

const statusColors = {
  active: 'bg-jarvis-neon',
  idle: 'bg-gray-500',
  error: 'bg-red-500',
};

function SwarmNodeCard({ node, index }: { node: SwarmNode; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15 }}
      className={`glass-panel rounded-xl p-4 border-2 ${roleColors[node.role]} glitch-hover`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusColors[node.status]} animate-pulse`} />
          <span className="font-orbitron text-sm cyan-glow">{node.name}</span>
        </div>
        <span className="text-xs uppercase px-2 py-1 rounded bg-gray-800 text-gray-400">
          {node.role}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-gray-500">Tasks: <span className="text-jarvis-cyan">{node.tasks}</span></div>
        <div className="text-gray-500">Links: <span className="text-jarvis-magenta">{node.connections.length}</span></div>
      </div>

      {/* Connection lines visualization */}
      <div className="mt-3 flex gap-1">
        {node.connections.map((conn, i) => (
          <div key={i} className="flex-1 h-1 bg-gradient-to-r from-jarvis-cyan to-jarvis-magenta rounded" />
        ))}
      </div>
    </motion.div>
  );
}

function SwarmTopology() {
  return (
    <div className="relative h-48 bg-black/50 rounded-lg overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* Animated connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="100%" stopColor="#ff00ff" />
          </linearGradient>
        </defs>
        {/* Coordinator to workers */}
        <motion.line 
          x1="50%" y1="20%" x2="25%" y2="60%" 
          stroke="url(#lineGradient)" strokeWidth="2" 
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.line 
          x1="50%" y1="20%" x2="50%" y2="60%" 
          stroke="url(#lineGradient)" strokeWidth="2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.line 
          x1="50%" y1="20%" x2="75%" y2="60%" 
          stroke="url(#lineGradient)" strokeWidth="2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.6, repeat: Infinity, repeatDelay: 2 }}
        />
      </svg>

      {/* Node positions */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <div className="w-12 h-12 rounded-full border-2 border-jarvis-cyan bg-jarvis-cyan/20 flex items-center justify-center shadow-jarvis-glow">
          <Network className="w-6 h-6 text-jarvis-cyan" />
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/4 -translate-x-1/2">
        <div className="w-8 h-8 rounded-full border border-jarvis-magenta bg-jarvis-magenta/10 flex items-center justify-center">
          <Zap className="w-4 h-4 text-jarvis-magenta" />
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-8 h-8 rounded-full border border-jarvis-magenta bg-jarvis-magenta/10 flex items-center justify-center">
          <Zap className="w-4 h-4 text-jarvis-magenta" />
        </div>
      </div>
      
      <div className="absolute bottom-8 left-3/4 -translate-x-1/2">
        <div className="w-8 h-8 rounded-full border border-gray-500 bg-gray-500/10 flex items-center justify-center">
          <Activity className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
}

export default function SwarmPanel() {
  const swarmNodes = mockSwarmNodes;
  const activeNodes = swarmNodes.filter(n => n.status === 'active').length;

  return (
    <div className="glass-panel rounded-xl p-4 h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-orbitron text-lg cyan-glow flex items-center gap-2">
          <Network className="w-5 h-5" />
          SWARM ORCHESTRATION
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Active:</span>
          <span className="text-jarvis-neon font-orbitron">{activeNodes}/{swarmNodes.length}</span>
        </div>
      </div>

      {/* Topology visualization */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <GitBranch className="w-3 h-3" />
          Topology: Hierarchical
        </div>
        <SwarmTopology />
      </div>

      {/* Node cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <Users className="w-3 h-3" />
          Swarm Nodes
        </div>
        <div className="grid grid-cols-1 gap-2">
          {swarmNodes.map((node, i) => (
            <SwarmNodeCard key={node.id} node={node} index={i} />
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="grid grid-cols-3 gap-2">
          <button className="px-3 py-2 rounded-lg bg-jarvis-cyan/20 text-jarvis-cyan text-xs hover:bg-jarvis-cyan/30 transition-all">
            + Spawn
          </button>
          <button className="px-3 py-2 rounded-lg bg-jarvis-magenta/20 text-jarvis-magenta text-xs hover:bg-jarvis-magenta/30 transition-all">
            Sync
          </button>
          <button className="px-3 py-2 rounded-lg bg-gray-800 text-gray-400 text-xs hover:bg-gray-700 transition-all">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
