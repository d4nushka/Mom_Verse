import React, { useEffect, useState } from 'react';
import { ViewState, User, VideoContent } from '../types';
import { Sun, Moon, Utensils, Heart, Sparkles, ChevronRight, Play, LogOut, User as UserIcon, Flower2 } from 'lucide-react';
import { generateMealPlan } from '../services/geminiService';
import { logoutUser } from '../services/storage';

interface DashboardProps {
  setView: (view: ViewState) => void;
  user: User;
  onLogout: () => void;
}

// Updated with verified working video IDs
const MOTIVATIONAL_VIDEOS: VideoContent[] = [
  {
    id: '1',
    title: 'How to Burp a Baby',
    author: 'Pampers',
    thumbnailUrl: 'https://img.youtube.com/vi/2g811Eo7K8U/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=2g811Eo7K8U',
    duration: '02:05'
  },
  {
    id: '2',
    title: '10 Min Postpartum Yoga',
    author: 'Sarah Beth Yoga',
    thumbnailUrl: 'https://img.youtube.com/vi/7J_dChXq58o/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=7J_dChXq58o',
    duration: '10:00'
  },
  {
    id: '3',
    title: 'Positive Affirmations for Moms',
    author: 'Mama Natural',
    thumbnailUrl: 'https://img.youtube.com/vi/w6eTDfkvPmo/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=w6eTDfkvPmo',
    duration: '10:05'
  }
];

const AFFIRMATIONS = [
  "I am exactly the mother my baby needs.",
  "My body is healing, and I am patient with myself.",
  "I trust my instincts and my ability to care for my child.",
  "It is okay to ask for help; it is a sign of strength.",
  "I am doing a great job, even on the hard days.",
  "This phase is temporary, but my love is forever.",
  "I am strong, capable, and deeply loved.",
  "Taking care of myself is part of taking care of my baby.",
  "I breathe in patience and breathe out stress.",
  "Every day, I am learning and growing with my baby."
];

const Dashboard: React.FC<DashboardProps> = ({ setView, user, onLogout }) => {
  const [dailyTip, setDailyTip] = useState<string | null>(null);
  const [dietType, setDietType] = useState<string>('Vegetarian');
  const [cuisine, setCuisine] = useState<string>('Indian');
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [affirmation, setAffirmation] = useState("");

  useEffect(() => {
    // Select a random affirmation when component mounts
    const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
    setAffirmation(AFFIRMATIONS[randomIndex]);
  }, []);

  const handleMealPlan = async () => {
      setIsLoadingPlan(true);
      setDailyTip(`Curating a nourishing ${cuisine} ${dietType} plan...`);
      try {
          const plan = await generateMealPlan(dietType, cuisine);
          setDailyTip(plan);
      } catch (e) {
          setDailyTip("Sorry, I couldn't get the meal plan right now. Please try again.");
      } finally {
          setIsLoadingPlan(false);
      }
  }

  const handleLogout = () => {
      if(window.confirm("Are you sure you want to logout?")) {
          logoutUser();
          onLogout();
      }
  }

  return (
    <div className="relative min-h-screen pb-28 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-lavender-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        
        {/* Header Section */}
        <header className="mb-8 mt-4 flex justify-between items-center animate-slide-up">
          <div>
              <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Hi, <span className="text-rose-500">{user.name.split(' ')[0]}</span>
              </h1>
          </div>
          <div className="flex gap-3">
              <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-white shadow-sm flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                  <LogOut size={18} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-rose-600 shadow-sm border border-white">
                  <UserIcon size={20} />
              </div>
          </div>
        </header>

        {/* Hero Greeting Card */}
        <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[2rem] p-8 text-white shadow-xl shadow-rose-200 mb-10 relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.98]" onClick={() => setView('chat')}>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 transform transition-transform group-hover:scale-110 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-400 opacity-20 rounded-full -ml-10 -mb-10 blur-xl"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 opacity-90">
                    <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                        <Sparkles size={14} className="text-yellow-100" />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase text-rose-50">Daily Affirmation</span>
                </div>
                <h2 className="text-2xl font-bold mb-6 leading-tight">"{affirmation}"</h2>
                <div className="flex items-center gap-2 text-sm font-semibold bg-white text-rose-600 w-fit px-5 py-2.5 rounded-full hover:bg-rose-50 transition-colors shadow-lg shadow-rose-900/10">
                    Chat with MomVerse <ChevronRight size={16} />
                </div>
            </div>
          </div>
        </div>

        {/* Quick Tools Grid */}
        <div className="mb-10 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
              My Toolkit
              <span className="h-px bg-slate-200/50 flex-1 rounded-full"></span>
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'feeding', icon: Utensils, label: 'Feeding', sub: 'Log & Track', color: 'indigo' },
                { id: 'cry-analyzer', icon: Sun, label: 'Cry AI', sub: 'Decode sounds', color: 'orange' },
                { id: 'symptom-checker', icon: Heart, label: 'Health', sub: 'Symptom Check', color: 'teal' },
                { id: 'mom-care', icon: Flower2, label: 'Mom Care', sub: 'Yoga & Zen', color: 'pink' }
              ].map((item, idx) => (
                <button 
                  key={item.id}
                  onClick={() => setView(item.id as ViewState)}
                  className="bg-white/70 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white hover:border-rose-200 hover:shadow-soft hover:-translate-y-1 transition-all text-left flex flex-col justify-between h-36 group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-${item.color}-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110`}></div>
                  
                  <div className={`w-12 h-12 rounded-2xl bg-${item.color}-50 text-${item.color}-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner-light`}>
                      <item.icon size={22} />
                  </div>
                  <div className="relative z-10">
                      <h3 className="font-bold text-slate-800 text-lg">{item.label}</h3>
                      <p className="text-slate-400 text-xs font-medium">{item.sub}</p>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Daily Insight Section */}
        <div className="mb-10 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <h3 className="text-sm font-bold text-slate-800 mb-4">Mom's Nutrition</h3>
            
            <div className="flex flex-col gap-3 mb-4">
                <div className="flex flex-col sm:flex-row gap-2">
                     <input 
                        type="text"
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                        placeholder="Cuisine (e.g. Mexican)"
                        className="flex-1 text-sm font-medium bg-white border border-rose-200 rounded-full px-4 py-2 text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 shadow-sm placeholder:text-slate-400"
                    />
                    
                    <div className="flex gap-2">
                        <select 
                            value={dietType}
                            onChange={(e) => setDietType(e.target.value)}
                            className="flex-1 sm:flex-none text-xs font-medium bg-white border border-rose-200 rounded-full px-3 py-2 text-slate-600 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="Vegetarian">Veg</option>
                            <option value="Non-Vegetarian">Non-Veg</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Pescatarian">Pescatarian</option>
                            <option value="Everything">Any</option>
                        </select>

                        <button 
                            onClick={handleMealPlan} 
                            disabled={isLoadingPlan || !cuisine}
                            className="text-white text-xs font-bold bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-full transition-all shadow-md shadow-rose-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                        >
                        {isLoadingPlan ? '...' : 'Create Plan'}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur p-6 rounded-3xl border border-white shadow-soft min-h-[80px] relative">
                {dailyTip ? (
                    <div className="prose prose-sm prose-rose text-slate-600 whitespace-pre-line leading-relaxed">
                        {dailyTip}
                    </div>
                ) : (
                    <div className="flex items-center gap-4 text-slate-500">
                        <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0 border border-green-100">
                          <Utensils size={20} />
                        </div>
                        <p className="text-sm font-medium leading-snug">Enter your preferred cuisine (e.g., Italian, Mexican, Korean) and diet to get a customized meal guide.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Motivational Videos */}
        <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
          <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
              For You to Watch
              <span className="h-px bg-slate-200/50 flex-1 rounded-full"></span>
          </h3>
          
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-6 px-6">
              {MOTIVATIONAL_VIDEOS.map(video => (
                  <a 
                    key={video.id} 
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-[260px] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-all block"
                  >
                      <div className="relative h-36 bg-slate-200 overflow-hidden">
                          {video.thumbnailUrl ? (
                              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                          ) : (
                              <div className="w-full h-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                  <span className="text-white text-xs z-10 font-medium opacity-80">Video Placeholder</span>
                              </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50">
                                  <Play size={24} fill="currentColor" className="ml-1" />
                              </div>
                          </div>
                          <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-bold">
                              {video.duration}
                          </span>
                      </div>
                      <div className="p-4">
                          <h4 className="font-bold text-slate-700 text-sm line-clamp-1 mb-1">{video.title}</h4>
                          <p className="text-xs text-rose-500 font-medium">{video.author}</p>
                      </div>
                  </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;