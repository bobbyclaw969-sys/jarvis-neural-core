import { motion } from 'framer-motion';
import { useStore } from '../store';
import CircularGauge from './CircularGauge';
import { Cpu, HardDrive, DollarSign, Zap } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const mockTokenData = [
  { time: '00:00', tokens: 120000 },
  { time: '04:00', tokens: 180000 },
  { time: '08:00', tokens: 350000 },
  { time: '12:00', tokens: 520000 },
  { time: '16:00', tokens: 680000 },
  { time: '20:00', tokens: 750000 },
  { time: '24:00', tokens: 792000 },
];

const mockCostData = [
  { time: 'Mon', cost: 0.12 },
  { time: 'Tue', cost: 0.18 },
  { time: 'Wed', cost: 0.15 },
  { time: 'Thu', cost: 0.22 },
  { time: 'Fri', cost: 0.19 },
  { time: 'Sat', cost: 0.08 },
  { time: 'Sun', cost: 0.05 },
];

export default function SystemMetricsPanel() {
  const metrics = useStore((s) => s.metrics);

  return (
    <div className="glass-panel rounded-xl p-4 h-full overflow-hidden flex flex-col">
      <h2 className="font-orbitron text-lg cyan-glow mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-jarvis-cyan rounded-full animate-pulse" />
        SYSTEM METRICS
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col items-center">
          <CircularGauge
            value={metrics.cpu}
            max={100}
            label="CPU"
            color="#00ffff"
            size="sm"
          />
        </div>
        <div className="flex flex-col items-center">
          <CircularGauge
            value={metrics.memory}
            max={100}
            label="MEM"
            color="#ff00ff"
            size="sm"
          />
        </div>
        <div className="flex flex-col items-center">
          <CircularGauge
            value={metrics.disk}
            max={100}
            label="DISK"
            color="#00ffaa"
            size="sm"
          />
        </div>
      </div>

      {/* Token Usage Chart */}
      <div className="flex-1 min-h-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Token Usage
          </span>
          <span className="text-xs font-orbitron text-jarvis-cyan">
            {metrics.tokensUsed.toLocaleString()} / {metrics.tokensLimit.toLocaleString()}
          </span>
        </div>
        <div className="h-20 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTokenData}>
              <defs>
                <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="tokens"
                stroke="#00ffff"
                strokeWidth={2}
                fill="url(#tokenGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Chart */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Daily Cost
          </span>
          <span className="text-xs font-orbitron text-jarvis-neon">
            ${metrics.cost.toFixed(2)}
          </span>
        </div>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockCostData}>
              <defs>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff00ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff00ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="cost"
                stroke="#ff00ff"
                strokeWidth={2}
                fill="url(#costGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
