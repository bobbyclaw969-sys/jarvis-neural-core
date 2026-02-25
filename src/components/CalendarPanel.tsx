import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, List } from 'lucide-react';

export default function CalendarPanel() {
  const events = useStore((s) => s.events);
  const [view, setView] = useState<'month' | 'agenda'>('month');

  const calendarEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.start,
    end: e.end,
    backgroundColor: e.type === 'meeting' ? 'rgba(0, 255, 255, 0.3)' : 
                      e.type === 'task' ? 'rgba(255, 0, 255, 0.3)' : 
                      'rgba(0, 255, 170, 0.3)',
    borderColor: e.type === 'meeting' ? '#00ffff' : 
                  e.type === 'task' ? '#ff00ff' : 
                  '#00ffaa',
  }));

  return (
    <div className="glass-panel rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-orbitron text-lg cyan-glow flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          CALENDAR
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('month')}
            className={`p-2 rounded-lg transition-all ${
              view === 'month' ? 'bg-jarvis-cyan/30 text-jarvis-cyan' : 'text-gray-500 hover:text-jarvis-cyan'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('agenda')}
            className={`p-2 rounded-lg transition-all ${
              view === 'agenda' ? 'bg-jarvis-cyan/30 text-jarvis-cyan' : 'text-gray-500 hover:text-jarvis-cyan'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'month' ? (
          <motion.div
            key="month"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-hidden"
          >
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: '',
              }}
              height="100%"
              eventDisplay="block"
            />
          </motion.div>
        ) : (
          <motion.div
            key="agenda"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto space-y-2"
          >
            {events.map((event) => (
              <div
                key={event.id}
                className="glass-panel rounded-lg p-3 flex items-center gap-3"
              >
                <div
                  className={`w-1 h-12 rounded-full ${
                    event.type === 'meeting' ? 'bg-jarvis-cyan' :
                    event.type === 'task' ? 'bg-jarvis-magenta' : 'bg-jarvis-neon'
                  }`}
                />
                <div className="flex-1">
                  <div className="font-orbitron text-sm">{event.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(event.start).toLocaleDateString()} •{' '}
                    {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className="text-xs uppercase px-2 py-1 rounded bg-gray-800 text-gray-400">
                  {event.type}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
