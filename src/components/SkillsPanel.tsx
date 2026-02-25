import { motion } from 'framer-motion';
import { useStore, type Skill } from '../store';
import { Activity, Zap, AlertCircle } from 'lucide-react';

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const statusColors = {
    active: 'text-jarvis-neon',
    idle: 'text-jarvis-cyan-dim',
    error: 'text-red-500',
  };

  const statusIcons = {
    active: <Activity className="w-3 h-3" />,
    idle: <Zap className="w-3 h-3" />,
    error: <AlertCircle className="w-3 h-3" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel rounded-lg p-3 glitch-hover"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-orbitron text-sm cyan-glow">{skill.name}</span>
        <div className={`flex items-center gap-1 ${statusColors[skill.status]}`}>
          {statusIcons[skill.status]}
          <span className="text-xs uppercase">{skill.status}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-2">{skill.description}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${skill.progress}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          />
        </div>
        <span className="text-xs font-orbitron text-jarvis-cyan">{skill.progress}%</span>
      </div>
    </motion.div>
  );
}

export default function SkillsPanel() {
  const skills = useStore((s) => s.skills);

  return (
    <div className="glass-panel rounded-xl p-4 h-full overflow-hidden flex flex-col">
      <h2 className="font-orbitron text-lg cyan-glow mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-jarvis-cyan rounded-full animate-pulse" />
        SKILLS
      </h2>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {skills.map((skill, i) => (
          <SkillCard key={skill.id} skill={skill} index={i} />
        ))}
      </div>
    </div>
  );
}
