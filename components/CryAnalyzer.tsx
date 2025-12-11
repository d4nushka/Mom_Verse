import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, AlertCircle, ChevronLeft } from 'lucide-react';
import { analyzeCryAudio } from '../services/geminiService';

const CryAnalyzer: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleAnalysis;
      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      setResult(null);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          const analysisText = await analyzeCryAudio(base64String, 'audio/webm');
          setResult(analysisText);
        } catch (e) {
          setError("Failed to analyze audio. Please try again.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (e) {
      setError("Error processing audio.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto min-h-[85vh] flex flex-col items-center justify-between pb-28">
      <div className="w-full text-center mt-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Cry Translator</h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Hold the phone near your baby. We'll listen for cues about hunger, sleep, or discomfort.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full py-10 relative">
        
        {/* Ripple Effects */}
        {isRecording && (
          <>
            <div className="absolute w-64 h-64 bg-rose-200 rounded-full opacity-30 animate-ping"></div>
            <div className="absolute w-56 h-56 bg-rose-300 rounded-full opacity-20 animate-pulse"></div>
          </>
        )}

        <div className={`relative z-10 w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500`}>
          {isAnalyzing ? (
             <div className="flex flex-col items-center gap-4">
               <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
               <span className="text-rose-500 font-medium animate-pulse">Analyzing...</span>
             </div>
          ) : (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-32 h-32 rounded-full flex items-center justify-center shadow-glow transition-transform hover:scale-105 ${
                isRecording 
                  ? 'bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-rose-300/50' 
                  : 'bg-white text-rose-500 shadow-lg'
              }`}
            >
              {isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={40} />}
            </button>
          )}
        </div>
        
        <p className="mt-8 text-lg font-medium text-slate-600 transition-all">
          {isAnalyzing ? "Understanding cues..." : isRecording ? "Listening..." : "Tap to Listen"}
        </p>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-500 rounded-2xl flex items-center text-sm">
            <AlertCircle size={18} className="mr-2 shrink-0" />
            {error}
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="mt-8 w-full bg-white p-6 rounded-3xl shadow-soft border border-rose-50 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-300 to-purple-300"></div>
            <h3 className="font-bold text-slate-800 mb-3 text-lg">Here's what I think:</h3>
            <div className="prose prose-sm prose-slate max-w-none whitespace-pre-line text-slate-600 leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryAnalyzer;