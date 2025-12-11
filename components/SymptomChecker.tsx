import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Send, X, AlertTriangle, Loader2 } from 'lucide-react';
import { analyzeSymptom } from '../services/geminiService';

const SymptomChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [age, setAge] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !image) return;

    setLoading(true);
    setResult(null);

    try {
      let base64Image = undefined;
      let mimeType = undefined;

      if (image) {
        base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(image);
        });
        mimeType = image.type;
      }

      const response = await analyzeSymptom(text, age, base64Image, mimeType);
      setResult(response);
    } catch (err) {
      setResult("Sorry, I encountered an error analyzing the symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto pb-32">
       <div className="mb-8 mt-2 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Symptom Checker</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
          Not sure what that rash is? Describe it or snap a photo for supportive guidance.
        </p>
      </div>

      <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-full text-amber-600 shrink-0">
          <AlertTriangle size={16} />
        </div>
        <p className="text-xs text-amber-800 leading-relaxed mt-1">
          <strong>Safety First:</strong> I'm an AI companion, not a doctor. 
          For high fevers, breathing issues, or unresponsiveness, please call your pediatrician immediately.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-50 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Baby's Age</label>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 3 months"
              className="w-full p-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Symptoms</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe what you see..."
              className="w-full p-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all min-h-[120px] resize-none text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block w-full cursor-pointer group">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className="h-16 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-500 group-hover:border-rose-300 group-hover:bg-rose-50 transition-all">
                <Camera size={20} className="group-hover:text-rose-500" />
                <span className="text-sm font-medium group-hover:text-rose-600">Upload Photo (Optional)</span>
              </div>
            </label>
          </div>

          {imagePreview && (
            <div className="relative inline-block rounded-xl overflow-hidden shadow-md">
              <img src={imagePreview} alt="Preview" className="h-40 w-auto object-cover" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 backdrop-blur-sm hover:bg-black/70 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || (!text && !image)}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]
            ${loading || (!text && !image) 
              ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed' 
              : 'bg-gradient-to-r from-rose-500 to-rose-400 shadow-rose-200'}`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Thinking...
            </>
          ) : (
            <>
              <Send size={20} />
              Check Symptoms
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-soft border border-rose-50 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
            <ImageIcon className="text-rose-500" size={20} />
            Here's what I found
          </h3>
          <div className="prose prose-sm prose-slate max-w-none whitespace-pre-line leading-relaxed text-slate-600">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;