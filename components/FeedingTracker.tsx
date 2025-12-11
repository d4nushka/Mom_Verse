import React, { useState, useEffect } from 'react';
import { Play, Plus, Clock, Droplets, Pause } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FeedLog, FeedType } from '../types';
import { getFeedingLogs, saveFeedingLog } from '../services/storage';

const FeedingTracker: React.FC = () => {
  const [logs, setLogs] = useState<FeedLog[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeSide, setActiveSide] = useState<'Left' | 'Right' | null>(null);
  
  // Load logs from storage on mount
  useEffect(() => {
    const storedLogs = getFeedingLogs();
    // Only use simulated data if storage is empty for demo purposes
    if (storedLogs.length === 0) {
        const initialLogs: FeedLog[] = Array.from({ length: 5 }).map((_, i) => ({
            id: `init-${i}`,
            type: i % 2 === 0 ? FeedType.BOTTLE : FeedType.BREAST,
            timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            durationMinutes: i % 2 === 0 ? undefined : 15 + Math.floor(Math.random() * 20),
            amountMl: i % 2 === 0 ? 120 + Math.floor(Math.random() * 60) : undefined,
            side: (i % 2 === 0 ? undefined : (Math.random() > 0.5 ? 'Left' : 'Right')) as 'Left' | 'Right' | undefined
        })).reverse();
        initialLogs.forEach(log => saveFeedingLog(log)); // Seed db
        setLogs(initialLogs);
    } else {
        setLogs(storedLogs);
    }
  }, []);

  useEffect(() => {
    let interval: number;
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = (side: 'Left' | 'Right') => {
    if (isTimerRunning && activeSide === side) {
      // Stop
      setIsTimerRunning(false);
      const newLog: FeedLog = {
        id: Date.now().toString(),
        type: FeedType.BREAST,
        timestamp: new Date(),
        durationMinutes: Math.ceil(timerSeconds / 60),
        side: side
      };
      
      const updatedLogs = saveFeedingLog(newLog);
      setLogs(updatedLogs);
      setTimerSeconds(0);
      setActiveSide(null);
    } else {
      // Start
      setIsTimerRunning(true);
      setActiveSide(side);
    }
  };

  const addBottleLog = () => {
    const amount = prompt("Enter amount in ml:", "120");
    if (amount) {
      const newLog: FeedLog = {
        id: Date.now().toString(),
        type: FeedType.BOTTLE,
        timestamp: new Date(),
        amountMl: parseInt(amount)
      };
      const updatedLogs = saveFeedingLog(newLog);
      setLogs(updatedLogs);
    }
  };

  const chartData = logs.slice(0, 7).map(log => ({
    day: log.timestamp.toLocaleDateString('en-US', { weekday: 'short' }),
    amount: log.type === FeedType.BOTTLE ? log.amountMl : (log.durationMinutes || 0) * 10,
    type: log.type
  }));

  return (
    <div className="p-6 max-w-lg mx-auto pb-32">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Feeding Tracker</h2>

      {/* Timer Card */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-rose-50 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="text-6xl font-light text-slate-700 tracking-tight font-variant-numeric tabular-nums">
            {formatTime(timerSeconds)}
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className={`h-2 w-2 rounded-full ${isTimerRunning ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`}></span>
            <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">
              {isTimerRunning ? `Nursing ${activeSide}` : 'Timer Ready'}
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center relative z-10">
          <button
            onClick={() => toggleTimer('Left')}
            className={`flex-1 py-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
              activeSide === 'Left' && isTimerRunning
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-105'
                : 'bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-500'
            }`}
          >
            {activeSide === 'Left' && isTimerRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            <span className="font-semibold text-sm">Left</span>
          </button>
          
          <button
            onClick={() => toggleTimer('Right')}
            className={`flex-1 py-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
              activeSide === 'Right' && isTimerRunning
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-105'
                : 'bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-500'
            }`}
          >
             {activeSide === 'Right' && isTimerRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            <span className="font-semibold text-sm">Right</span>
          </button>
        </div>
        
        <button
          onClick={addBottleLog}
          className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-medium flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          <Plus size={18} />
          Add Bottle / Pump Entry
        </button>
      </div>

      {/* Stats & History */}
      <div className="grid gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Activity</h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                <Tooltip 
                  cursor={{fill: '#fff1f2', radius: 4}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}} 
                />
                <Bar dataKey="amount" radius={[6, 6, 6, 6]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === FeedType.BOTTLE ? '#c4b5fd' : '#fda4af'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">History</h3>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${log.type === FeedType.BREAST ? 'bg-rose-100 text-rose-500' : 'bg-lavender-100 text-lavender-500'}`}>
                    {log.type === FeedType.BREAST ? <Clock size={20} /> : <Droplets size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">{log.type}</p>
                    <p className="text-xs text-slate-400 font-medium">{log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-slate-50 rounded-lg text-sm font-bold text-slate-600">
                    {log.type === FeedType.BREAST ? `${log.durationMinutes}m` : `${log.amountMl}ml`}
                  </span>
                  {log.side && <p className="text-xs text-slate-400 mt-1">{log.side} side</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedingTracker;