import React, { useState, useEffect } from 'react';
import { Play, Wind, Flower2, Pause, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface YogaPose {
  id: number;
  title: string;
  level: string;
  description: string;
  imageUrl: string;
  steps: string[];
  cSectionSafe: boolean;
  safetyNote: string;
}

const YOGA_POSES: YogaPose[] = [
  {
    id: 1,
    title: "Bridge Pose (Setu Bandhasana)",
    level: "Strengthening",
    description: "Strengthens the back, glutes, and hamstrings while opening the chest. Great for counteracting slouching from nursing.",
    imageUrl: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80",
    steps: [
      "Lie on your back with knees bent, feet flat on the floor hip-width apart.",
      "Place arms alongside the body, palms down.",
      "Press feet into the floor and gently lift your hips.",
      "Hold for 5-10 breaths, keeping your gaze straight up.",
      "Slowly lower your spine vertebra by vertebra."
    ],
    cSectionSafe: true,
    safetyNote: "Wait 6-8 weeks postpartum. Do not push hips too high to avoid overstretching the abdominals. Listen to your body."
  },
  {
    id: 2,
    title: "Cat-Cow Stretch",
    level: "Beginner",
    description: "Improves circulation in the spine and gently re-engages the core without heavy strain.",
    imageUrl: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=800&q=80",
    steps: [
      "Start on your hands and knees (tabletop position).",
      "Inhale, drop your belly slightly and lift your gaze (Cow).",
      "Exhale, round your spine toward the ceiling, tucking chin to chest (Cat).",
      "Move slowly with your breath for 1-2 minutes."
    ],
    cSectionSafe: true,
    safetyNote: "Generally safe. Avoid over-stretching the belly in 'Cow' pose. Focus more on the upper back rounding."
  },
  {
    id: 3,
    title: "Legs Up The Wall",
    level: "Restorative",
    description: "Reduces swelling in legs and feet, promotes deep relaxation, and helps with fatigue.",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    steps: [
      "Sit close to a wall.",
      "Lie on your back and swing your legs up the wall.",
      "Scoot your hips as close to the wall as comfortable.",
      "Rest arms by your sides and breathe deeply for 5 minutes."
    ],
    cSectionSafe: true,
    safetyNote: "Very safe. Great for recovery. Roll to your side slowly when getting up to protect your core."
  }
];

const MomCare: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'yoga' | 'breathe'>('yoga');
  const [breathingState, setBreathingState] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breatheTimer, setBreatheTimer] = useState(0);

  // Breathing Logic (4-4-4 Box Breathing)
  useEffect(() => {
    let interval: number;
    if (breathingState !== 'idle') {
      interval = window.setInterval(() => {
        setBreatheTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingState]);

  useEffect(() => {
    if (breathingState === 'idle') {
      setBreatheTimer(0);
      return;
    }

    // Cycle: Inhale (4s) -> Hold (4s) -> Exhale (4s)
    const cycleTime = breatheTimer % 12;
    if (cycleTime < 4) {
        if(breathingState !== 'inhale') setBreathingState('inhale');
    } else if (cycleTime < 8) {
        if(breathingState !== 'hold') setBreathingState('hold');
    } else {
        if(breathingState !== 'exhale') setBreathingState('exhale');
    }
  }, [breatheTimer, breathingState]);

  const toggleBreathing = () => {
    if (breathingState === 'idle') {
      setBreathingState('inhale');
      setBreatheTimer(0);
    } else {
      setBreathingState('idle');
      setBreatheTimer(0);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto pb-32 animate-fade-in">
      <div className="text-center mb-8 mt-4">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center text-teal-600 mx-auto mb-4 shadow-lg shadow-teal-100/50">
            <Flower2 size={32} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Mom's Wellness</h2>
        <p className="text-slate-500 font-medium">Your time to heal and breathe.</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8 relative">
        <button
          onClick={() => setActiveTab('yoga')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all z-10 ${
            activeTab === 'yoga' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400 hover:text-slate-500'
          }`}
        >
          Gentle Movement
        </button>
        <button
          onClick={() => setActiveTab('breathe')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all z-10 ${
            activeTab === 'breathe' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-500'
          }`}
        >
          Anti-Stress
        </button>
      </div>

      {activeTab === 'yoga' && (
        <div className="space-y-8 animate-slide-up">
          
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
             <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
             <p className="text-xs text-amber-800 font-medium leading-relaxed">
               Always wait for your doctor's clearance (usually 6 weeks) before starting exercise. Stop immediately if you feel pain or dizziness.
             </p>
          </div>

          {YOGA_POSES.map((pose, idx) => (
            <div 
                key={pose.id} 
                className="bg-white rounded-[2rem] overflow-hidden shadow-soft border border-slate-50 group"
                style={{animationDelay: `${idx * 0.1}s`}}
            >
              <div className="relative h-48 bg-slate-200">
                 <img src={pose.imageUrl} alt={pose.title} className="w-full h-full object-cover" />
                 <div className="absolute top-4 right-4">
                    {pose.cSectionSafe && (
                        <span className="bg-green-100/90 backdrop-blur text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                            <CheckCircle2 size={12} /> C-Section Safe
                        </span>
                    )}
                 </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">{pose.level}</span>
                    <h3 className="text-xl font-bold text-slate-800 mt-1">{pose.title}</h3>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">{pose.description}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
                        <Info size={14} /> How to do it
                    </h4>
                    <ol className="list-decimal list-outside ml-4 space-y-2">
                        {pose.steps.map((step, i) => (
                            <li key={i} className="text-sm text-slate-600 pl-1">{step}</li>
                        ))}
                    </ol>
                </div>

                <div className="flex gap-2 items-start bg-rose-50/50 p-3 rounded-xl">
                    <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-800 font-medium leading-relaxed">
                        <span className="font-bold">Safety Note:</span> {pose.safetyNote}
                    </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'breathe' && (
        <div className="flex flex-col items-center justify-center py-6 animate-fade-in">
          
          <div className="relative mb-14">
            {/* Breathing Circle Layers */}
            {breathingState !== 'idle' && (
                <>
                    <div className={`absolute inset-0 rounded-full bg-teal-100 mix-blend-multiply filter blur-xl opacity-70 transition-all duration-[4000ms] ${
                        breathingState === 'inhale' ? 'scale-150' : 'scale-100'
                    }`}></div>
                    <div className={`absolute inset-0 rounded-full bg-teal-50 opacity-50 transition-all duration-[4000ms] delay-100 ${
                        breathingState === 'inhale' ? 'scale-[1.8]' : 'scale-90'
                    }`}></div>
                </>
            )}

            <div className={`w-64 h-64 rounded-full flex items-center justify-center relative z-10 transition-all duration-[4000ms] ease-in-out shadow-2xl ${
                breathingState === 'idle' ? 'bg-gradient-to-br from-teal-50 to-teal-100 scale-100 shadow-teal-100' :
                breathingState === 'inhale' ? 'bg-gradient-to-br from-teal-100 to-teal-200 scale-110 shadow-teal-200' :
                breathingState === 'hold' ? 'bg-gradient-to-br from-teal-200 to-teal-300 scale-110 shadow-teal-300' :
                'bg-gradient-to-br from-teal-50 to-teal-100 scale-90 shadow-teal-100'
            }`}>
                 <div className={`w-52 h-52 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center transition-all duration-[4000ms] border border-white/50 ${
                     breathingState === 'exhale' ? 'scale-95' : 'scale-100'
                 }`}>
                     <div className="text-center">
                         {breathingState === 'idle' && <Flower2 size={56} className="text-teal-500 mx-auto mb-3" />}
                         {breathingState !== 'idle' && (
                             <span className="text-6xl font-light text-teal-600 font-variant-numeric tracking-tighter">
                                 {4 - (breatheTimer % 4)}
                             </span>
                         )}
                         <p className="text-teal-700 font-bold uppercase tracking-[0.2em] text-xs mt-3">
                             {breathingState === 'idle' ? 'Ready?' : breathingState}
                         </p>
                     </div>
                 </div>
            </div>
          </div>

          <button
            onClick={toggleBreathing}
            className={`px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
                breathingState === 'idle' 
                ? 'bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-teal-200' 
                : 'bg-white text-slate-500 border border-slate-100'
            }`}
          >
            {breathingState === 'idle' ? (
                <>
                    <Play size={20} fill="currentColor" /> Start Session
                </>
            ) : (
                <>
                    <Pause size={20} fill="currentColor" /> End Session
                </>
            )}
          </button>
          
          <div className="mt-10 bg-teal-50/50 p-4 rounded-2xl max-w-xs text-center border border-teal-50">
            <p className="text-teal-800 text-sm font-medium leading-relaxed">
                Box breathing (4-4-4) helps regulate the nervous system and reduce stress instantly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MomCare;