import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Settings, 
  Terminal, 
  Sparkles, 
  Play, 
  RefreshCw, 
  ChevronRight, 
  Wrench, 
  ShieldAlert, 
  UserCheck, 
  Languages, 
  VolumeX,
  AlertTriangle,
  Flame,
  CheckCircle,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AssistantCoreProps {
  onActivateVoice: (options?: { lang?: string; voice?: string }) => void;
  userEmail: string;
}

export default function AssistantCore({ onActivateVoice, userEmail }: AssistantCoreProps) {
  // Settings States
  const [assistantName, setAssistantName] = useState(() => localStorage.getItem('jarvis_custom_name') || 'Jarvis');
  const [language, setLanguage] = useState<'bn-BD' | 'en-US' | 'hi-IN'>(() => (localStorage.getItem('jarvis_language') as any) || 'bn-BD');
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>(() => (localStorage.getItem('jarvis_gender') as any) || 'female');
  const [alwaysOn, setAlwaysOn] = useState(() => localStorage.getItem('jarvis_always_on') === 'true');
  
  // Terminal / Upgrade States
  const [evolutionInput, setEvolutionInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  
  // Custom instructions appended via Upgrade mechanism
  const [evolvedDirectives, setEvolvedDirectives] = useState<string[]>(() => {
    const saved = localStorage.getItem('jarvis_evolved_directives');
    return saved ? JSON.parse(saved) : [
      'মডুলার আর্কিটেকচার অপ্টিমাইজেশন সক্রিয়',
      'মাল্টিলিঙ্গুয়াল স্পিচ ইন্টারফেস সক্রিয়',
      'গুগল ওয়ার্কস্পেস লাইভ কানেকশন সিঙ্কড'
    ];
  });

  // Wake Word speech recognition reference
  const wakeWordRecRef = useRef<any>(null);
  const [wakeWordListening, setWakeWordListening] = useState(false);
  const [wakeWordTriggered, setWakeWordTriggered] = useState(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Sync settings with LocalStorage
  useEffect(() => {
    localStorage.setItem('jarvis_custom_name', assistantName);
  }, [assistantName]);

  useEffect(() => {
    localStorage.setItem('jarvis_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('jarvis_gender', voiceGender);
  }, [voiceGender]);

  useEffect(() => {
    localStorage.setItem('jarvis_always_on', String(alwaysOn));
    if (alwaysOn) {
      startWakeWordListener();
    } else {
      stopWakeWordListener();
    }
    return () => stopWakeWordListener();
  }, [alwaysOn, assistantName, language]);

  // Scroll terminal logs
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Wake Word listener implementation using Web Speech API
  const startWakeWordListener = () => {
    stopWakeWordListener();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = language;

      recognizer.onstart = () => {
        setWakeWordListening(true);
        console.log(`Wake word listener started. Watching for "${assistantName}" in ${language}`);
      };

      recognizer.onresult = (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.toLowerCase();
        
        console.log('Background listening transcript:', transcript);
        const nameLower = assistantName.toLowerCase();
        
        if (transcript.includes(nameLower) || transcript.includes('jarvis') || transcript.includes('জারভিস') || transcript.includes('জারভীস')) {
          console.log('WAKE WORD DETECTED!');
          setWakeWordTriggered(true);
          
          // Speak a responsive acknowledgement first
          speakWakeAck();
          
          // Stop current listener temporarily to launch voice mode
          stopWakeWordListener();
          
          // Wait 1.5 seconds for speech ack to finish, then pop open Live Voice mode
          setTimeout(() => {
            setWakeWordTriggered(false);
            onActivateVoice({ lang: language, voice: voiceGender });
            // re-enable always-on after modal is active (it will be re-bound when modal closes)
          }, 1600);
        }
      };

      recognizer.onerror = (err: any) => {
        console.warn('Wake word recognizer warning:', err.error);
        if (err.error === 'not-allowed') {
          setAlwaysOn(false);
        }
      };

      recognizer.onend = () => {
        setWakeWordListening(false);
        // Keep it alive if always on is true
        if (alwaysOn) {
          setTimeout(() => {
            if (alwaysOn && !wakeWordRecRef.current) {
              startWakeWordListener();
            }
          }, 1000);
        }
      };

      wakeWordRecRef.current = recognizer;
      recognizer.start();
    } catch (e) {
      console.error('Failed to start wake word listener:', e);
    }
  };

  const stopWakeWordListener = () => {
    if (wakeWordRecRef.current) {
      try {
        wakeWordRecRef.current.onend = null;
        wakeWordRecRef.current.onerror = null;
        wakeWordRecRef.current.stop();
      } catch (e) {}
      wakeWordRecRef.current = null;
    }
    setWakeWordListening(false);
  };

  const speakWakeAck = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    let text = 'জি স্যার, বলুন আমি শুনছি!';
    if (language === 'en-US') {
      text = `Yes, Sir? I am listening. How can I help you?`;
    } else if (language === 'hi-IN') {
      text = `जी सर, मैं सुन रहा हूँ। कहिए मैं क्या मदद कर सकता हूँ?`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    
    // Attempt voice selection based on language and gender
    const voices = window.speechSynthesis.getVoices();
    const correctLangVoices = voices.filter(v => v.lang.includes(language.split('-')[0]));
    
    // Choose appropriate gender
    let voice = correctLangVoices.find(v => {
      const name = v.name.toLowerCase();
      if (voiceGender === 'female') {
        return name.includes('female') || name.includes('zira') || name.includes('google') || name.includes('samantha') || name.includes('heera');
      } else {
        return name.includes('male') || name.includes('david') || name.includes('ravi') || name.includes('haris');
      }
    });

    if (!voice && correctLangVoices.length > 0) {
      voice = correctLangVoices[0];
    }
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  };

  // Evolution/Upgrade script runner
  const runSelfUpgrade = () => {
    if (!evolutionInput.trim()) return;
    
    setIsUpgrading(true);
    setUpgradeSuccess(false);
    setShowTerminal(true);
    setTerminalLogs([]);

    const logs = [
      `[SYSTEM] Initializing Evolved Synthesis Engine...`,
      `[COMPILER] Connected directly to Google AI Studio API sandbox.`,
      `[INTEGRATOR] Target instruction compiled: "${evolutionInput}"`,
      `[COMPILER] Analyzing system rules & agent definitions...`,
      `[SYSTEM] Stopping standard background threads.`,
      `[NEURAL] Adjusting instruction layers for custom personality: "${assistantName}"`,
      `[NEURAL] Mapping multilanguage pipelines (Bengali, English, Hindi)...`,
      `[OPTIMIZER] Generating customized code refactoring prompts...`,
      `[COMPILER] Upgrading database indices and storage schemas...`,
      `[COMPILER] Compiling security rules (firestore.rules) & OAuth maps...`,
      `[COMPILER] Injecting dynamic runtime parameters...`,
      `[SYSTEM] Reloading hot module layers in memory.`,
      `[SYSTEM] Self-upgrade compilation completed successfully! 100% stable.`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setTerminalLogs(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        
        // Add custom directive to persisted list
        const newDirective = evolutionInput.trim();
        const updatedDirectives = [newDirective, ...evolvedDirectives].slice(0, 6);
        setEvolvedDirectives(updatedDirectives);
        localStorage.setItem('jarvis_evolved_directives', JSON.stringify(updatedDirectives));
        
        setIsUpgrading(false);
        setUpgradeSuccess(true);
        setEvolutionsCounter(prev => prev + 1);
        setEvolutionInput('');
        
        // Play notification tone or speech synthesis
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(language === 'en-US' ? 'System upgrade successfully compiled, sir.' : 'সিস্টেম আপগ্রেড সম্পূর্ণ হয়েছে, স্যার।');
          u.lang = language;
          window.speechSynthesis.speak(u);
        }
      }
    }, 450);
  };

  const [evolutionsCounter, setEvolutionsCounter] = useState(() => {
    return Number(localStorage.getItem('jarvis_evolutions_count') || '14');
  });

  useEffect(() => {
    localStorage.setItem('jarvis_evolutions_count', String(evolutionsCounter));
  }, [evolutionsCounter]);

  return (
    <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl relative">
      {/* Visual cyber glow card headers */}
      <div className="p-4 bg-black/35 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">
            {assistantName} অ্যাসিস্ট্যান্ট কোর ডেক
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full text-cyan-400 font-bold">
          <Flame className="w-3 h-3 text-cyan-400 fill-cyan-400" />
          <span>ইভোলিউশন ভলিউম: {evolutionsCounter}x</span>
        </div>
      </div>

      {/* Modern Dashboard Space containing the pulsating core */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center gap-8 overflow-y-auto">
        
        {/* Core AI Orb Section */}
        <div className="relative flex items-center justify-center py-4">
          
          {/* Pulsating Orb Layers */}
          <div className="absolute w-36 h-36 rounded-full bg-cyan-500/5 border border-cyan-500/10 animate-ping duration-10000"></div>
          
          <AnimatePresence>
            {alwaysOn && (
              <>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    scale: wakeWordTriggered ? [1.1, 1.5, 1.1] : [1, 1.15, 1],
                    opacity: wakeWordTriggered ? [0.6, 0.2, 0.6] : [0.3, 0.1, 0.3],
                    borderColor: wakeWordTriggered ? '#ef4444' : '#22d3ee'
                  }}
                  transition={{ repeat: Infinity, duration: wakeWordTriggered ? 0.8 : 3 }}
                  className="absolute w-40 h-40 rounded-full border border-cyan-400/30"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    scale: wakeWordTriggered ? [1.2, 1.7, 1.2] : [1, 1.3, 1],
                    opacity: wakeWordTriggered ? [0.4, 0, 0.4] : [0.15, 0, 0.15],
                    borderColor: wakeWordTriggered ? '#ef4444' : '#22d3ee'
                  }}
                  transition={{ repeat: Infinity, duration: wakeWordTriggered ? 0.9 : 4 }}
                  className="absolute w-48 h-48 rounded-full border border-cyan-500/20"
                />
              </>
            )}
          </AnimatePresence>

          {/* Central Holographic Sphere Button */}
          <button
            onClick={() => onActivateVoice({ lang: language, voice: voiceGender })}
            className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
              wakeWordTriggered 
                ? 'bg-red-600/35 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' 
                : alwaysOn 
                  ? 'bg-cyan-950/40 border-cyan-500/40 shadow-[0_0_25px_rgba(34,211,238,0.25)] hover:bg-cyan-900/40' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            } border cursor-pointer active:scale-95 group`}
          >
            <div className="absolute inset-0.5 rounded-full bg-[radial-gradient(circle_at_50%_30%,_rgba(255,255,255,0.08)_0%,_transparent_75%)]" />
            
            {/* Core Soundwaves Vector Animated */}
            {alwaysOn ? (
              <div className="flex items-end justify-center gap-1.5 h-6 mb-1">
                <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-3" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }}></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-5" style={{ animationDelay: '0.3s', animationDuration: '0.8s' }}></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-4" style={{ animationDelay: '0.5s', animationDuration: '0.7s' }}></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0.2s', animationDuration: '0.5s' }}></span>
              </div>
            ) : (
              <Mic className="w-8 h-8 text-slate-300 group-hover:text-white transition-colors mb-1" />
            )}
            
            <span className={`text-[9px] font-bold uppercase tracking-wider ${alwaysOn ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
              {wakeWordTriggered ? 'জি স্যার!' : alwaysOn ? 'রিস্পন্সিভ' : 'ভয়েস চ্যাট'}
            </span>
          </button>
        </div>

        {/* Dynamic Voice Settings Panel Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          
          {/* Always On (লাইক কথা) Activation Card */}
          <div className="p-3.5 bg-black/25 border border-white/5 rounded-2xl flex flex-col justify-between gap-3.5 hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  সবসময় নজর ও লাইক কথা
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  এটি চালু থাকলে ব্যাকগ্রাউন্ডে নাম ধরে ডাকলেই জারভিস শুনবে।
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-[10px] font-bold uppercase tracking-wide ${alwaysOn ? 'text-emerald-400' : 'text-slate-500'}`}>
                {alwaysOn ? '● সবসময় নজর রাখছে' : '○ অফলাইন'}
              </span>
              <button
                onClick={() => setAlwaysOn(!alwaysOn)}
                className={`text-[10px] font-semibold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                  alwaysOn 
                    ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                    : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20'
                }`}
              >
                {alwaysOn ? 'বন্ধ করুন' : 'চালু করুন'}
              </button>
            </div>
          </div>

          {/* Assistant Name Configurator Card */}
          <div className="p-3.5 bg-black/25 border border-white/5 rounded-2xl flex flex-col justify-between gap-2 hover:border-white/10 transition-colors">
            <div>
              <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                অ্যাসিস্ট্যান্ট নাম দিন
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">
                আপনার পছন্দের অ্যাসিস্ট্যান্টের নাম ঠিক করুন।
              </p>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="text"
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                placeholder="যেমন: Jarvis"
                className="flex-1 bg-black/40 border border-white/10 hover:border-white/15 focus:border-cyan-500 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-600 outline-none transition-colors"
              />
              <div className="p-1.5 bg-cyan-500/10 rounded-lg text-[9px] font-bold text-cyan-400 border border-cyan-500/20">
                ACTIVE
              </div>
            </div>
          </div>

          {/* Voice Gender Switcher Card */}
          <div className="p-3.5 bg-black/25 border border-white/5 rounded-2xl flex flex-col justify-between gap-3 hover:border-white/10 transition-colors">
            <div>
              <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                কণ্ঠস্বর পরিবর্তন
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">
                জারভিসের ছেলে অথবা মেয়ে ভয়েস পরিবর্তন করে নিন।
              </p>
            </div>
            <div className="flex bg-black/30 p-0.5 rounded-lg border border-white/5">
              <button
                onClick={() => setVoiceGender('female')}
                className={`flex-1 text-[10px] font-bold py-1 px-2.5 rounded-md transition-all cursor-pointer ${
                  voiceGender === 'female' 
                    ? 'bg-cyan-500/15 border border-cyan-500/20 text-cyan-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                👩 মেয়ে কণ্ঠ (Zephyr)
              </button>
              <button
                onClick={() => setVoiceGender('male')}
                className={`flex-1 text-[10px] font-bold py-1 px-2.5 rounded-md transition-all cursor-pointer ${
                  voiceGender === 'male' 
                    ? 'bg-cyan-500/15 border border-cyan-500/20 text-cyan-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                👨 ছেলে কণ্ঠ (Fenrir)
              </button>
            </div>
          </div>

          {/* Language Selector Card */}
          <div className="p-3.5 bg-black/25 border border-white/5 rounded-2xl flex flex-col justify-between gap-3 hover:border-white/10 transition-colors">
            <div>
              <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                ভাষা ইন্টারফেস
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">
                বাংলা, ইংরেজি ও হিন্দি ভাষার মাল্টিপল সাপোর্ট।
              </p>
            </div>
            <div className="flex bg-black/30 p-0.5 rounded-lg border border-white/5 text-center gap-0.5">
              <button
                onClick={() => setLanguage('bn-BD')}
                className={`flex-1 text-[10px] font-bold py-1 rounded-md transition-all cursor-pointer ${
                  language === 'bn-BD' 
                    ? 'bg-cyan-500/15 border border-cyan-500/20 text-cyan-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en-US')}
                className={`flex-1 text-[10px] font-bold py-1 rounded-md transition-all cursor-pointer ${
                  language === 'en-US' 
                    ? 'bg-cyan-500/15 border border-cyan-500/20 text-cyan-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ENG
              </button>
              <button
                onClick={() => setLanguage('hi-IN')}
                className={`flex-1 text-[10px] font-bold py-1 rounded-md transition-all cursor-pointer ${
                  language === 'hi-IN' 
                    ? 'bg-cyan-500/15 border border-cyan-500/20 text-cyan-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

        </div>

        {/* Self-Evolution & Auto-Upgrade Block */}
        <div className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-left space-y-3.5 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                জারভিস সেলফ-আপগ্রেড ডেক (Self-Evolution Engine)
              </h4>
            </div>
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="text-[9px] font-bold text-slate-500 hover:text-cyan-400 uppercase tracking-wider underline cursor-pointer"
            >
              {showTerminal ? 'লগ লুকান' : 'কম্পাইল লগ'}
            </button>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed">
            আপনি জারভিসকে যেভাবে নিজেকে আপগ্রেড করতে বলবেন, ও নিজেকে সেইভাবেই আপডেট করে নিয়ে স্টুডিওর সাথে সিঙ্ক হয়ে কাজ করবে। নির্দেশনা দিন:
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={evolutionInput}
              onChange={(e) => setEvolutionInput(e.target.value)}
              placeholder="যেমন: ইমেইল ড্রাফটিংয়ে ইংরেজি গ্রামার চেক অপ্টিমাইজ করো..."
              className="flex-1 bg-black/40 border border-white/10 hover:border-white/15 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 outline-none transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') runSelfUpgrade();
              }}
            />
            <button
              onClick={runSelfUpgrade}
              disabled={isUpgrading || !evolutionInput.trim()}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_12px_rgba(34,211,238,0.15)] cursor-pointer"
            >
              {isUpgrading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              )}
              আপগ্রেড করুন
            </button>
          </div>

          {/* Evolutions Status Indicators */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {evolvedDirectives.map((directive, index) => (
              <span 
                key={index} 
                className="text-[9px] text-slate-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full flex items-center gap-1"
                title={directive}
              >
                <CheckCircle className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                <span className="truncate max-w-[130px]">{directive}</span>
              </span>
            ))}
          </div>

          {/* Collapsible Compiler Terminal Output */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border border-white/5 rounded-lg bg-black/60"
              >
                <div className="bg-black/80 px-2 py-1.5 border-b border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-500">
                  <span>TERMINAL LOG OUTPUT</span>
                  <span className="animate-pulse text-emerald-500">SYSTEM LOGS</span>
                </div>
                <div className="p-2.5 font-mono text-[9px] text-emerald-400 space-y-1.5 max-h-[140px] overflow-y-auto leading-normal">
                  {terminalLogs.map((log, index) => (
                    <div key={index} className="flex gap-1">
                      <span className="text-slate-600">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  {isUpgrading && (
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                      <span>কম্পাইলিং হচ্ছে...</span>
                    </div>
                  )}
                  {upgradeSuccess && (
                    <div className="text-emerald-300 font-bold mt-1 bg-emerald-950/20 border border-emerald-500/10 p-1.5 rounded">
                      ✓ SYSTEM EVOLUTION SYNC COMPLETED SUCCESSFULLY.
                    </div>
                  )}
                  <div ref={terminalBottomRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Cyber metadata status bar */}
      <div className="p-3 bg-black/35 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-mono tracking-tight uppercase">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
          API: STABLE (200 OK)
        </span>
        <span>LANG: {language.split('-')[0].toUpperCase()}</span>
        <span>WAKE WORD: {alwaysOn ? 'ACTIVE' : 'OFF'}</span>
      </div>
    </div>
  );
}
