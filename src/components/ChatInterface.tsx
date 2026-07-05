import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, MapPin, Volume2, Sparkles, User, BrainCircuit, Loader2, Link as LinkIcon, RefreshCw, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';

const generateSandboxResponse = (userInput: string): string => {
  const inputLower = userInput.toLowerCase();
  
  if (inputLower.includes('বাজার') || inputLower.includes('market') || inputLower.includes('analysis') || inputLower.includes('বিশ্লেষণ') || inputLower.includes('competitor') || inputLower.includes('প্রতিযোগী')) {
    return `### 📊 বাজার ও প্রতিযোগী বিশ্লেষণ প্রতিবেদন (স্যান্ডবক্স ডেমো)
আপনার অনুরোধ অনুযায়ী বাজার ও প্রতিযোগীদের নিয়ে একটি বিশ্লেষণমূলক প্রতিবেদন প্রস্তুত করা হলো:

| বিভাগ | বিবরণ | মূল প্রতিযোগী | বাজার প্রবণতা (২০২৬) |
| :--- | :--- | :--- | :--- |
| **SaaS / AI** | এআই ইন্টিগ্রেশন বৃদ্ধি পাচ্ছে | OpenDev, DevCorp | উচ্চ ক্রিয়াকলাপ, দ্রুত কাস্টমার অ্যাডপশন |
| **Fintech** | সিকিউর পেমেন্ট গেটওয়ে | Stripe, local APIs | কাস্টমাইজড ফ্রড ডিটেকশন মডেল |
| **No-Code** | অটোমেটেড ওয়ার্কফ্লো | Make, Zapier | ড্র্যাগ-এন্ড-ড্রপ ইন্টেলিজেন্ট কো-পাইলট |

**পরবর্তী পদক্ষেপসমূহ:**
১. ইউনিক ভ্যালু প্রোপজিশন (UVP) চিহ্নিত করা।
২. প্রথম ধাপে ক্লায়েন্ট একুইজিশনের জন্য কোল্ড ইমেইলের অটোমেশন সেটআপ করা।`;
  }
  
  if (inputLower.includes('বাজেট') || inputLower.includes('finance') || inputLower.includes('অর্থ') || inputLower.includes('টাকা') || inputLower.includes('হিসাব')) {
    return `### 💰 বাজেট ও আর্থিক পরিকল্পনা (স্যান্ডবক্স ডেমো)
আপনার ব্যবসার বর্তমান এবং আগামী কোয়ার্টারের সম্ভাব্য বাজেট বিশ্লেষণ:

- **ক্লাউড রিসোর্স ও হোস্টিং:** ২৫%
- **রিসার্চ ও এআই এপিআই কোটা:** ৩০% (লিমিট রি-চেক করা প্রয়োজন)
- **মার্কেটিং ও কাস্টমার একুইজিশন:** ৩৫%
- **অপারেশনাল খরচ:** ১০%

> **পরামর্শ:** কাস্টমার একুইজিশন খরচ কমানোর জন্য অর্গানিক এসইও এবং টেকনিক্যাল ব্লগিং শুরু করতে পারেন।`;
  }

  if (inputLower.includes('কোড') || inputLower.includes('code') || inputLower.includes('program') || inputLower.includes('api') || inputLower.includes('ডেভেলপার')) {
    return `### 💻 ডেভেলপার অ্যাসিস্ট্যান্ট (স্যান্ডবক্স ডেমো)
আপনার অনুরোধ করা কোড কাঠামোর একটি প্রোফেশনাল স্কেলেটন এখানে দেওয়া হলো:

\`\`\`typescript
// src/services/SandboxOptimizer.ts
export interface OptimizerConfig {
  retries: number;
  timeoutMs: number;
}

export class SandboxOptimizer {
  constructor(private config: OptimizerConfig) {}

  public async optimizeMetrics(data: any[]): Promise<any> {
    console.log("Optimizing structured metrics...");
    return data.map(item => ({
      ...item,
      optimized: true,
      timestamp: Date.now()
    }));
  }
}
\`\`\`
এটি অত্যন্ত মডুলার এবং এরর-হ্যান্ডলিং যুক্ত। আপনার প্রজেক্টের সার্ভার কানেকশন এখন সম্পূর্ণ স্বাভাবিক রয়েছে।`;
  }

  if (inputLower.includes('gmail') || inputLower.includes('mail') || inputLower.includes('ইমেইল') || inputLower.includes('ইনবক্স')) {
    return `### 📧 জিমেইল সারসংক্ষেপ (স্যান্ডবক্স ডেমো)
আপনার ইনবক্স থেকে সাম্প্রতিক জরুরি ইমেইলগুলোর একটি সংক্ষিপ্ত রূপ নিচে দেওয়া হলো:

১. **লিড ডেভেলপমেন্ট (moderninnovix@gmail.com):** "পরবর্তী কোয়ার্টারের কাস্টমাইজেশন নিয়ে কথা বলতে চাই।"
২. **বিলিং নোটিফিকেশন:** "আপনার ক্লাউড সার্ভিস রিসোর্স থ্রেশহোল্ড অতিক্রম করেছে।"

*দ্রষ্টব্য: আপনি আপনার মূল উইজেট থেকে সরাসরি আসল ইমেইলগুলো রিফ্রেশ করে দেখতে পারেন।*`;
  }

  // Default fallback
  return `### 🤖 জারভিস লোকাল স্যান্ডবক্স মোড
আসসালামু আলাইকুম! আপনার এপিআই কি-তে কোটা সীমাবদ্ধতা থাকায় আমি এখন **লোকাল স্যান্ডবক্স মোডে** উত্তর দিচ্ছি। 

আপনার প্রজেক্টের কার্যকারিতা প্রদর্শনের জন্য আমি এখনো প্রস্তুত:
- 📊 **মার্কেট বা বাজেট** নিয়ে জানতে চান? "বাজার বিশ্লেষণ" বা "বাজেট পরিকল্পনা" লিখে মেসেজ দিন।
- 💻 **কোড স্ট্রাকচার** দেখতে চান? "কোড অ্যাসিস্ট্যান্ট" লিখে মেসেজ দিন।
- 📧 **ইমেইল সামারি** চান? "জরুরি ইমেইল" লিখে মেসেজ দিন।

*টিপস: ব্রাউজারের এপিআই বিলিং ঠিক করতে Google AI Studio Settings-এ আপনার কোটা ও পেমেন্ট মেথড চেক করতে পারেন।*`;
};

interface ChatInterfaceProps {
  userEmail: string;
}

export default function ChatInterface({ userEmail }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: 'আসসালামু আলাইকুম! আমি **জারভিস**, আপনার ব্যক্তিগত এআই এক্সিকিউটিভ অ্যাসিস্ট্যান্ট। আজ আপনাকে কিভাবে সাহায্য করতে পারি? আপনার দৈনন্দিন কাজ, গুগল ক্যালেন্ডার শিডিউলিং, ইমেইল পরিচালনা বা যেকোনো তথ্যের জন্য আমাকে জিজ্ঞেস করতে পারেন।',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelType, setModelType] = useState<'standard' | 'complex' | 'fast'>('standard');
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isSandbox, setIsSandbox] = useState(false);
  
  // TTS State
  const [playingTtsId, setPlayingTtsId] = useState<string | null>(null);
  const ttsAudioCtxRef = useRef<AudioContext | null>(null);
  const activeTtsSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle geolocation retrieval when Maps Grounding is toggled
  useEffect(() => {
    if (useMaps && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.error('Error fetching location:', err);
        }
      );
    }
  }, [useMaps]);

  const stopAllTts = () => {
    activeTtsSourcesRef.current.forEach(src => {
      try { src.stop(); } catch(e){}
    });
    activeTtsSourcesRef.current = [];
    setPlayingTtsId(null);
  };

  // Convert base64 to float32 PCM data for 24kHz playback
  const base64ToFloat32 = (base64: string): Float32Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768;
    }
    return float32Array;
  };

  const playNativeTts = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = textToSpeak.replace(/[\*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      const voices = window.speechSynthesis.getVoices();
      const hasBengali = voices.find(v => v.lang.includes('bn'));
      if (hasBengali) {
        utterance.voice = hasBengali;
      }
      
      utterance.onend = () => {
        setPlayingTtsId(null);
      };
      utterance.onerror = () => {
        setPlayingTtsId(null);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingTtsId(null);
    }
  };

  const handlePlayTts = async (messageId: string, textToSpeak: string) => {
    if (playingTtsId === messageId) {
      stopAllTts();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    stopAllTts();
    setPlayingTtsId(messageId);

    if (isSandbox) {
      playNativeTts(textToSpeak);
      return;
    }

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: `Say clearly: ${textToSpeak.replace(/[\*#_]/g, '')}`,
          voiceName: 'Kore' // Puck, Kore, Fenrir, Zephyr
        })
      });

      if (!res.ok) throw new Error('TTS failed');

      const data = await res.json();
      if (!data.audio) throw new Error('No audio returned');

      if (!ttsAudioCtxRef.current) {
        ttsAudioCtxRef.current = new AudioContext({ sampleRate: 24000 });
      }

      const ctx = ttsAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const float32Data = base64ToFloat32(data.audio);
      const buffer = ctx.createBuffer(1, float32Data.length, 24000);
      buffer.copyToChannel(float32Data, 0);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      source.onended = () => {
        activeTtsSourcesRef.current = activeTtsSourcesRef.current.filter(s => s !== source);
        if (activeTtsSourcesRef.current.length === 0) {
          setPlayingTtsId(null);
        }
      };

      activeTtsSourcesRef.current.push(source);
      source.start(0);

    } catch (err) {
      console.error('TTS Playback Error, falling back to browser SpeechSynthesis:', err);
      playNativeTts(textToSpeak);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    stopAllTts();

    const userMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    if (isSandbox) {
      setTimeout(() => {
        const sandboxText = generateSandboxResponse(userText);
        const modelMsg: Message = {
          id: Math.random().toString(),
          role: 'model',
          text: sandboxText,
          modelUsed: 'local-sandbox',
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, modelMsg]);
        setLoading(false);
      }, 700);
      return;
    }

    try {
      // Map entire history for model memory
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          model: modelType,
          useSearch,
          useMaps,
          latLng: location
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          const data = await response.json().catch(() => ({}));
          if (data.error === 'QUOTA_EXHAUSTED') {
            throw new Error('QUOTA_EXHAUSTED');
          }
        }
        throw new Error('নেটওয়ার্ক ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।');
      }

      const data = await response.json();

      const modelMsg: Message = {
        id: Math.random().toString(),
        role: 'model',
        text: data.text,
        modelUsed: data.modelUsed,
        groundingChunks: data.groundingChunks,
        searchTriggered: data.searchTriggered,
        mapsTriggered: data.mapsTriggered,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, modelMsg]);

    } catch (err: any) {
      console.error(err);
      if (err.message === 'QUOTA_EXHAUSTED') {
        setIsSandbox(true);
        const sandboxText = generateSandboxResponse(userText);
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: 'model',
            text: `⚠️ **API Quota Limit Exhausted!**\n\n${sandboxText}`,
            modelUsed: 'local-sandbox',
            timestamp: new Date()
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: 'model',
            text: `দুঃখিত, কোনো একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন। (${err.message || 'Error'})`,
            timestamp: new Date()
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    stopAllTts();
    setMessages([
      {
        id: 'welcome-msg',
        role: 'model',
        text: 'চ্যাট হিস্টোরি মুছে ফেলা হয়েছে। আমি **জারভিস**, আপনাকে সাহায্য করতে প্রস্তুত!',
        timestamp: new Date(),
      }
    ]);
  };

  return (
    <div id="chat-container" className="flex flex-col h-[560px] border border-white/10 bg-white/5 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
      {/* Chat Header */}
      <div id="chat-header" className="flex items-center justify-between border-b border-white/5 bg-black/30 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="w-5 h-5 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]" />
          <div className="text-left">
            <h3 className="font-semibold text-white text-xs">Jarvis Workspace Chat</h3>
            <p className="text-[10px] text-slate-400 font-medium">ব্যক্তিগত সহকারী</p>
          </div>
        </div>

        {/* Model and Tools Selector */}
        <div className="flex items-center gap-2.5">
          {/* Model Type Selector */}
          <select 
            value={modelType} 
            onChange={(e) => setModelType(e.target.value as any)}
            className="text-[10px] font-bold border border-white/10 rounded-lg px-2 py-1.5 bg-slate-900 text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="standard" className="bg-slate-950">Standard (Gemini 3.5 Flash)</option>
            <option value="complex" className="bg-slate-950">Complex (Gemini 3.1 Pro)</option>
            <option value="fast" className="bg-slate-950">Fast (Gemini 3.1 Flash Lite)</option>
          </select>

          {/* Reset button */}
          <button 
            onClick={clearChat}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="চ্যাট হিস্টোরি মুছুন"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isSandbox && (
        <div className="bg-amber-950/30 border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-[10px] text-amber-200">
              <strong>লোকাল স্যান্ডবক্স মোড সক্রিয়:</strong> এপিআই কি-তে কোটা সীমাবদ্ধতার কারণে জারভিস এখন অফলাইন ডেমো মোডে চলছে।
            </span>
          </div>
          <button 
            onClick={() => setIsSandbox(false)}
            className="text-[9px] text-slate-400 hover:text-white underline font-bold cursor-pointer"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Chat messages Area */}
      <div id="chat-messages-scroll" className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0f]/20">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
              msg.role === 'user' 
                ? 'bg-white/10 text-slate-200 border-white/10' 
                : 'bg-gradient-to-tr from-cyan-600 to-blue-900 text-white border-cyan-500/30'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            {/* Content Bubble */}
            <div className="flex flex-col text-left">
              <div className={`p-3.5 rounded-2xl border ${
                msg.role === 'user' 
                  ? 'bg-white/5 text-slate-200 rounded-tr-none border-white/10' 
                  : 'bg-cyan-950/10 text-slate-100 rounded-tl-none border-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.02)]'
              }`}>
                {/* Text Content */}
                <div className="prose prose-xs max-w-none text-xs leading-relaxed break-words whitespace-pre-wrap text-slate-200">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {/* Grounding Citations */}
                {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-1.5">
                    {msg.groundingChunks.map((chunk, idx) => (
                      <a
                        key={idx}
                        href={chunk.uri}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-950/20 hover:bg-cyan-950/40 text-[10px] text-cyan-400 font-medium border border-cyan-500/10 transition-colors"
                      >
                        <LinkIcon className="w-3 h-3 text-cyan-500" />
                        <span className="truncate max-w-[120px]">{chunk.title || 'Source'}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp & Controls */}
              <div className={`flex items-center gap-2 mt-1.5 px-1 text-[10px] text-slate-500 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}>
                <span>{new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                
                {msg.role === 'model' && (
                  <>
                    <span>•</span>
                    <button 
                      onClick={() => handlePlayTts(msg.id, msg.text)}
                      className={`hover:text-cyan-400 transition-colors flex items-center gap-1 ${playingTtsId === msg.id ? 'text-cyan-400 font-bold' : ''}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      {playingTtsId === msg.id ? 'থামুন' : 'শুনুন'}
                    </button>
                    {msg.modelUsed && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-white/5 text-slate-500 font-medium ml-2 uppercase border border-white/5">
                        {msg.modelUsed.split('/').pop()}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[85%] mr-auto animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-900 text-white flex items-center justify-center shrink-0 border border-cyan-500/30">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-cyan-950/15 border border-cyan-500/15 text-xs text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              জারভিস চিন্তা করছেন...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input / Controls Footer */}
      <div id="chat-controls-pane" className="border-t border-white/5 p-3 bg-black/40 backdrop-blur-md">
        <form onSubmit={handleSendMessage} className="space-y-3">
          {/* Search/Maps Toggles */}
          <div className="flex items-center gap-4 px-1">
            <button
              type="button"
              onClick={() => {
                setUseSearch(!useSearch);
                setUseMaps(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold border transition-all ${
                useSearch 
                  ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.1)]' 
                  : 'border-white/10 hover:border-white/20 text-slate-400 bg-white/5'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              গুগল সার্চ গ্রাউন্ডিং
            </button>

            <button
              type="button"
              onClick={() => {
                setUseMaps(!useMaps);
                setUseSearch(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold border transition-all ${
                useMaps 
                  ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.1)]' 
                  : 'border-white/10 hover:border-white/20 text-slate-400 bg-white/5'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              গুগল ম্যাপস গ্রাউন্ডিং
            </button>
          </div>

          {/* Text Input Row */}
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="জারভিসকে কোনো প্রশ্ন করুন..."
              className="flex-1 text-xs px-3.5 py-2.5 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
              disabled={loading}
              required
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-xl transition-all disabled:opacity-40 shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
