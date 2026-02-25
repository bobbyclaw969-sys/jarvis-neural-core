import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Command } from 'lucide-react';
import { useStore } from '../store';

const COMMANDS = [
  { cmd: 'status report', response: 'All systems operational. 4 jobs running, 3 agents online.' },
  { cmd: 'show skills', response: 'Displaying 6 active skills. 3 idle, 1 error.' },
  { cmd: 'run health check', response: 'Initiating security health check...' },
  { cmd: 'stop all jobs', response: 'Stopping all running jobs...' },
  { cmd: 'show calendar', response: 'Opening calendar view...' },
  { cmd: 'refresh metrics', response: 'Refreshing system metrics...' },
];

export default function VoiceCommandBar() {
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const setActiveTab = useStore((s) => s.setActiveTab);

  useEffect(() => {
    if (listening) {
      inputRef.current?.focus();
    }
  }, [listening]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.toLowerCase().trim();
    const matched = COMMANDS.find((c) => cmd.includes(c.cmd));

    if (matched) {
      setResponse(matched.response);
      setShowResponse(true);
      
      // Handle navigation commands
      if (cmd.includes('skill')) setActiveTab('skills');
      if (cmd.includes('calendar')) setActiveTab('calendar');
      
      setTimeout(() => setShowResponse(false), 3000);
    } else {
      setResponse(`Command "${input}" not recognized. Try "status report" or "show skills".`);
      setShowResponse(true);
      setTimeout(() => setShowResponse(false), 3000);
    }

    setInput('');
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
    >
      <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => setListening(!listening)}
          className={`p-2 rounded-full transition-all ${
            listening
              ? 'bg-jarvis-cyan/30 text-jarvis-cyan animate-pulse'
              : 'text-gray-500 hover:text-jarvis-cyan'
          }`}
        >
          {listening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2 text-gray-500">
          <Command className="w-4 h-4" />
          <span className="text-sm">Say "status report"</span>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command..."
            className="flex-1 bg-transparent border-none outline-none text-jarvis-cyan placeholder-gray-600 font-rajdhani"
          />
          <button
            type="submit"
            className="p-2 rounded-full bg-jarvis-cyan/20 text-jarvis-cyan hover:bg-jarvis-cyan/30 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <AnimatePresence>
        {showResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-2 left-0 right-0 glass-panel rounded-lg p-3 text-center"
          >
            <span className="text-jarvis-neon font-rajdhani">{response}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
