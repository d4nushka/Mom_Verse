import React, { useState, useEffect } from 'react';
import { Save, Plus, X, Smile, Cloud, Coffee, Zap, CloudRain, BookHeart, PenLine } from 'lucide-react';
import { JournalEntry } from '../types';
import { getJournalEntries, saveJournalEntry } from '../services/storage';

const MOODS = [
  { id: 'happy', icon: Smile, label: 'Happy' },
  { id: 'calm', icon: Cloud, label: 'Calm' },
  { id: 'tired', icon: Coffee, label: 'Tired' },
  { id: 'stressed', icon: Zap, label: 'Stressed' },
  { id: 'sad', icon: CloudRain, label: 'Sad' },
] as const;

// Dynamic Styling Configuration
const MOOD_THEMES: Record<string, {
  bgPage: string;
  bgContainer: string;
  border: string;
  text: string;
  placeholder: string;
  button: string;
  iconActive: string;
  iconInactive: string;
  decor: React.ReactNode;
}> = {
  happy: {
    bgPage: 'bg-amber-50',
    bgContainer: 'bg-gradient-to-br from-yellow-50 to-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-900',
    placeholder: 'placeholder:text-amber-400/50',
    button: 'bg-amber-500 text-white shadow-amber-200',
    iconActive: 'text-amber-500 bg-amber-100 ring-amber-200',
    iconInactive: 'text-amber-300 hover:bg-amber-50',
    decor: (
      <>
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </>
    )
  },
  calm: {
    bgPage: 'bg-sky-50',
    bgContainer: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    border: 'border-sky-200',
    text: 'text-slate-700',
    placeholder: 'placeholder:text-sky-300/50',
    button: 'bg-sky-500 text-white shadow-sky-200',
    iconActive: 'text-sky-500 bg-sky-100 ring-sky-200',
    iconInactive: 'text-sky-300 hover:bg-sky-50',
    decor: (
      <>
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/40 to-transparent"></div>
      </>
    )
  },
  tired: {
    bgPage: 'bg-[#FDFBF7]', // Warm off-white
    bgContainer: 'bg-[#F5F5F0]', // Stone/Beige
    border: 'border-stone-200',
    text: 'text-stone-600',
    placeholder: 'placeholder:text-stone-300',
    button: 'bg-stone-500 text-white shadow-stone-200',
    iconActive: 'text-stone-600 bg-stone-200 ring-stone-300',
    iconInactive: 'text-stone-300 hover:bg-stone-100',
    decor: (
       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#78716c 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
    )
  },
  stressed: {
    bgPage: 'bg-purple-50',
    bgContainer: 'bg-gradient-to-br from-purple-50 to-fuchsia-50',
    border: 'border-purple-200',
    text: 'text-purple-900',
    placeholder: 'placeholder:text-purple-300/50',
    button: 'bg-purple-400 text-white shadow-purple-200',
    iconActive: 'text-purple-500 bg-purple-100 ring-purple-200',
    iconInactive: 'text-purple-300 hover:bg-purple-50',
    decor: (
      <>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      </>
    )
  },
  sad: {
    bgPage: 'bg-slate-100',
    bgContainer: 'bg-gradient-to-b from-slate-100 to-slate-200',
    border: 'border-slate-300',
    text: 'text-slate-600',
    placeholder: 'placeholder:text-slate-400/70',
    button: 'bg-slate-500 text-white shadow-slate-200',
    iconActive: 'text-slate-600 bg-slate-200 ring-slate-300',
    iconInactive: 'text-slate-400 hover:bg-slate-50',
    decor: (
       <div className="absolute top-0 w-full h-full bg-gradient-to-b from-blue-100/10 to-transparent pointer-events-none"></div>
    )
  }
};

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [newText, setNewText] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('calm');

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  const handleSave = () => {
    if (!newText.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      text: newText,
      mood: selectedMood as any
    };

    const updated = saveJournalEntry(entry);
    setEntries(updated);
    setNewText('');
    setIsWriting(false);
    // Keep the mood for continuity or reset? Resetting usually feels cleaner.
    setSelectedMood('calm'); 
  };

  const currentTheme = MOOD_THEMES[selectedMood] || MOOD_THEMES.calm;

  if (isWriting) {
    return (
      <div className={`min-h-screen pb-32 flex flex-col animate-slide-up transition-colors duration-700 ${currentTheme.bgPage}`}>
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm bg-white/30">
          <button 
            onClick={() => setIsWriting(false)}
            className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-slate-500 hover:bg-white transition-colors"
          >
            <X size={20} />
          </button>
          <span className={`font-bold transition-colors duration-500 ${currentTheme.text}`}>New Entry</span>
          <button 
            onClick={handleSave}
            disabled={!newText.trim()}
            className={`px-6 py-2 rounded-full font-bold text-sm shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:shadow-none ${currentTheme.button}`}
          >
            <Save size={16} /> Save
          </button>
        </div>

        <div className="flex-1 px-6 max-w-lg mx-auto w-full flex flex-col">
          
          {/* Mood Selector - Dynamic */}
          <div className="mb-6">
            <p className={`text-xs font-bold uppercase tracking-wider mb-4 text-center transition-colors duration-500 opacity-60 ${currentTheme.text}`}>
                How are you feeling right now?
            </p>
            <div className="flex justify-between items-center bg-white/40 p-2 rounded-3xl backdrop-blur-sm">
              {MOODS.map((mood) => {
                const isSelected = selectedMood === mood.id;
                const Icon = mood.icon;
                return (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                      isSelected 
                        ? `${currentTheme.iconActive} scale-110 shadow-sm ring-2` 
                        : `${currentTheme.iconInactive} scale-95 opacity-70`
                    }`}
                  >
                    <Icon size={24} />
                    {isSelected && <span className="text-[9px] font-bold mt-1">{mood.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor - Dynamic Theme */}
          <div className={`flex-1 rounded-[2rem] p-8 relative overflow-hidden transition-all duration-700 border ${currentTheme.bgContainer} ${currentTheme.border} shadow-sm`}>
             
             {/* Background Decor */}
             <div className="absolute inset-0 pointer-events-none transition-opacity duration-700">
                {currentTheme.decor}
             </div>

             <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4 opacity-50">
                    <p className={`text-xs font-bold uppercase tracking-wider ${currentTheme.text}`}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <PenLine size={20} className={currentTheme.text} />
                </div>
                
                <textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Pour your heart out..."
                    className={`w-full flex-1 bg-transparent border-none resize-none focus:ring-0 text-lg leading-relaxed transition-colors duration-500 ${currentTheme.text} ${currentTheme.placeholder}`}
                    autoFocus
                />
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Main List View
  return (
    <div className="p-6 max-w-lg mx-auto pb-32 min-h-screen">
       <div className="text-center mb-8 mt-4 animate-fade-in">
        <div className="w-16 h-16 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-full flex items-center justify-center text-lavender-600 mx-auto mb-4 shadow-lg shadow-lavender-100/50">
            <BookHeart size={32} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">My Journal</h2>
        <p className="text-slate-500 font-medium">Your safe space to vent, dream, and heal.</p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md border border-white p-8 rounded-[2rem] text-center shadow-soft animate-slide-up">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-300">
                <PenLine size={32} />
            </div>
            <h3 className="font-bold text-slate-700 mb-2">Start your journey</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Writing down your thoughts can significantly reduce stress and help you process the big emotions of motherhood.
            </p>
            <button 
                onClick={() => setIsWriting(true)}
                className="w-full py-4 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
            >
                <Plus size={20} /> Write First Entry
            </button>
        </div>
      ) : (
        <div className="space-y-4 animate-slide-up">
          <button 
             onClick={() => setIsWriting(true)}
             className="w-full py-4 mb-6 bg-white border-2 border-dashed border-rose-200 text-rose-500 rounded-2xl font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
          >
             <Plus size={20} /> New Entry
          </button>

          <div className="grid gap-4">
            {entries.map((entry) => {
               // Get theme color for the list item icon
               const theme = MOOD_THEMES[entry.mood] || MOOD_THEMES.calm;
               const MoodIcon = MOODS.find(m => m.id === entry.mood)?.icon || Cloud;
               
               return (
                  <div key={entry.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme.bgPage}`}>
                              <MoodIcon size={18} className={theme.text.replace('text-', 'text-opacity-80 text-')} />
                          </div>
                          <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                  {entry.timestamp.toLocaleDateString('en-US', { weekday: 'short' })}
                              </span>
                              <span className="text-sm font-bold text-slate-700">
                                  {entry.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                          </div>
                      </div>
                      <span className="text-[10px] font-medium text-slate-300 bg-slate-50 px-2 py-1 rounded-full">
                          {entry.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                        {entry.text}
                    </p>
                  </div>
               );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;