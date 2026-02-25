import { motion } from 'framer-motion';
import { useStore, Job } from '../store';
import { Play, CheckCircle, Clock, XCircle } from 'lucide-react';

function JobCard({ job, index }: { job: Job; index: number }) {
  const statusConfig = {
    running: { color: 'text-jarvis-neon', icon: Play, bg: 'bg-jarvis-neon/20' },
    completed: { color: 'text-green-400', icon: CheckCircle, bg: 'bg-green-400/20' },
    pending: { color: 'text-jarvis-cyan-dim', icon: Clock, bg: 'bg-jarvis-cyan/20' },
    failed: { color: 'text-red-500', icon: XCircle, bg: 'bg-red-500/20' },
  };

  const config = statusConfig[job.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel rounded-lg p-4 glitch-hover"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-orbitron text-sm cyan-glow">{job.name}</span>
        <div className={`flex items-center gap-1 ${config.color}`}>
          <Icon className="w-4 h-4" />
          <span className="text-xs uppercase">{job.status}</span>
        </div>
      </div>

      {/* Stage visualization */}
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: job.totalStages }).map((_, i) => (
          <div key={i} className="flex-1 flex items-center">
            <div
              className={`h-1.5 flex-1 rounded ${
                i < job.stage
                  ? 'progress-bar'
                  : i === job.stage && job.status === 'running'
                  ? 'bg-jarvis-cyan/50 animate-pulse'
                  : 'bg-gray-800'
              }`}
            />
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500">
        Stage {job.stage} of {job.totalStages}
      </div>

      {job.startedAt && (
        <div className="text-xs text-gray-500 mt-2">
          Started: {new Date(job.startedAt).toLocaleTimeString()}
        </div>
      )}
    </motion.div>
  );
}

export default function JobsPanel() {
  const jobs = useStore((s) => s.jobs);

  return (
    <div className="glass-panel rounded-xl p-4 h-full overflow-hidden flex flex-col">
      <h2 className="font-orbitron text-lg cyan-glow mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-jarvis-neon rounded-full animate-pulse" />
        JOBS & PIPELINES
      </h2>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {jobs.map((job, i) => (
          <JobCard key={job.id} job={job} index={i} />
        ))}
      </div>
    </div>
  );
}
