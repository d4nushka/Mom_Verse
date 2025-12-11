import React, { useState } from 'react';
import { Sparkles, ArrowRight, Mail, Lock, User as UserIcon, Baby, ChevronLeft } from 'lucide-react';
import { loginUser, saveUser } from '../services/storage';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthView = 'login' | 'signup' | 'forgot';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    babyName: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));

      if (view === 'login') {
        const user = loginUser(formData.email, formData.password);
        onLogin(user);
      } else if (view === 'signup') {
        const newUser = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          babyName: formData.babyName,
          password: formData.password // storing strictly for mock persistence
        };
        saveUser(newUser);
        onLogin(newUser);
      } else if (view === 'forgot') {
        setSuccessMsg("If an account exists, we've sent a reset link to your email.");
        setTimeout(() => setView('login'), 3000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-lavender-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-500 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-rose-200 mb-4 transform rotate-3">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Mom<span className="text-rose-500">Verse</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">The Universe Every Mom Deserves.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-rose-100/50 overflow-hidden border border-white">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {view === 'login' && 'Welcome Back'}
                {view === 'signup' && 'Join MomVerse'}
                {view === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {view === 'login' && 'Enter your details to access your space.'}
                {view === 'signup' && 'Create your personal sanctuary.'}
                {view === 'forgot' && "Don't worry, it happens to the best of us."}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100 flex items-center">
                {error}
              </div>
            )}
             {successMsg && (
              <div className="mb-6 p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100 flex items-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {view === 'signup' && (
                <>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-transparent focus:bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="relative">
                    <Baby className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input
                      name="babyName"
                      type="text"
                      placeholder="Baby's Name (Optional)"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-transparent focus:bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-transparent focus:bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  onChange={handleInputChange}
                />
              </div>

              {view !== 'forgot' && (
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-transparent focus:bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {view === 'login' && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => setView('forgot')} className="text-sm text-rose-500 font-medium hover:text-rose-600">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-rose-200 hover:bg-rose-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Please wait...' : (
                   <>
                     {view === 'login' && 'Sign In'}
                     {view === 'signup' && 'Create Account'}
                     {view === 'forgot' && 'Send Reset Link'}
                     {!loading && <ArrowRight size={20} />}
                   </>
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            {view === 'login' ? (
              <p className="text-slate-500">
                New Mom? <button onClick={() => setView('signup')} className="text-rose-600 font-bold ml-1">Create Account</button>
              </p>
            ) : (
              <p className="text-slate-500">
                Already have an account? <button onClick={() => setView('login')} className="text-rose-600 font-bold ml-1">Log In</button>
              </p>
            )}
          </div>
        </div>

        {view === 'forgot' && (
            <button onClick={() => setView('login')} className="w-full mt-6 text-slate-500 flex items-center justify-center gap-2 hover:text-rose-500">
                <ChevronLeft size={16} /> Back to Login
            </button>
        )}
      </div>
    </div>
  );
};

export default Auth;
