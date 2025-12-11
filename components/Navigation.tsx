import React from 'react';
import { Home, Mic, Stethoscope, Baby, Flower2, BookHeart } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems: { id: ViewState; icon: React.ReactNode; label: string }[] = [
    { id: 'dashboard', icon: <Home size={22} />, label: 'Home' },
    { id: 'cry-analyzer', icon: <Mic size={22} />, label: 'Cry AI' },
    { id: 'feeding', icon: <Baby size={22} />, label: 'Feed' },
    { id: 'journal', icon: <BookHeart size={22} />, label: 'Journal' },
    { id: 'mom-care', icon: <Flower2 size={22} />, label: 'Care' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-50">
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-2xl shadow-slate-200/50 px-2 py-3 flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center p-1 rounded-2xl transition-all duration-300 w-full relative ${
                isActive
                  ? 'text-rose-500 -translate-y-2'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <div className={`p-3 rounded-2xl transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-rose-500 to-rose-400 text-white shadow-lg shadow-rose-200 ring-4 ring-white' : 'bg-transparent'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold mt-1 transition-all duration-300 absolute -bottom-4 ${isActive ? 'opacity-100 translate-y-0 text-slate-800' : 'opacity-0 translate-y-1'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;