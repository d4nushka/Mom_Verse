import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import { chatWithMomVerse } from '../services/geminiService';
import { ChatMessage } from '../types';

const WellnessChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm MomVerse. I'm here to support you with everything from baby care to your own recovery. How are you feeling today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithMomVerse(history, input);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again in a moment.", isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-lg mx-auto bg-white sm:rounded-3xl sm:shadow-lg sm:my-4 overflow-hidden relative">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 border-b border-rose-50 flex items-center gap-4 z-10 sticky top-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-lg">MomVerse</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <p className="text-xs text-slate-400 font-medium">Always here for you</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0 mt-auto">
                <Bot size={16} />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-br-sm'
                  : msg.isError 
                    ? 'bg-red-50 text-red-600 border border-red-100 rounded-bl-sm'
                    : 'bg-white text-slate-600 border border-slate-100 rounded-bl-sm'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>

            {msg.role === 'user' && (
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 shrink-0 mt-auto">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0 mt-auto">
                <Bot size={16} />
              </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm p-4 shadow-sm">
              <div className="flex space-x-2 items-center h-4">
                <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-50 pb-safe">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all text-slate-700 placeholder:text-slate-400 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2.5 bg-rose-500 text-white rounded-full disabled:opacity-50 disabled:bg-slate-300 hover:bg-rose-600 hover:scale-105 transition-all shadow-lg shadow-rose-200"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default WellnessChat;