import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff, Volume2, HelpCircle, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const generateDynamicSandboxResponse = (text: string, lang: string, name: string, userNickname: string, hasGreeted: boolean): string => {
  const inputLower = text.toLowerCase();
  const nickname = userNickname || 'স্যার';
  
  // Choose prefix based on whether we have already greeted the user
  let prefix = '';
  if (lang === 'en-US') {
    prefix = !hasGreeted ? `Hello ${nickname} Sir, respect. ` : `Yes ${nickname} Sir. `;
  } else if (lang === 'hi-IN') {
    prefix = !hasGreeted ? `नमस्ते ${nickname} सर। ` : `जी ${nickname} सर। `;
  } else {
    prefix = !hasGreeted ? `হ্যালো ${nickname} স্যার, নমস্কার। ` : `জি ${nickname} স্যার, `;
  }
  
  if (lang === 'en-US') {
    if (inputLower.includes('email') || inputLower.includes('mail') || inputLower.includes('write') || inputLower.includes('draft')) {
      return `${prefix}I have successfully drafted the email in English for you, Sir. Here is the draft: "Dear Partner, I hope this email finds you well. I would like to schedule a session next week to sync on our business strategy." Would you like me to send it?`;
    }
    if (inputLower.includes('market') || inputLower.includes('competitor') || inputLower.includes('analysis')) {
      return `${prefix}I am analyzing the market, Sir. Competitors are aggressively expanding AI capability. We should optimize our digital acquisition funnel.`;
    }
    if (inputLower.includes('code') || inputLower.includes('api') || inputLower.includes('developer') || inputLower.includes('server')) {
      return `${prefix}The server status is fully operational. I have refactored the optimization scripts, and our workspace connection is 100% active.`;
    }
    return `${prefix}I can hear you clearly. I am currently running in Local Sandbox Mode, but I am ready to assist you. How can I help?`;
  }

  if (lang === 'hi-IN') {
    if (inputLower.includes('email') || inputLower.includes('mail') || inputLower.includes('likh')) {
      return `${prefix}मैंने आपके लिए अंग्रेजी में एक पेशेवर ईमेल का मसौदा तैयार किया है। क्या मैं इसे भेज दूँ?`;
    }
    if (inputLower.includes('market') || inputLower.includes('budget') || inputLower.includes('paisa')) {
      return `${prefix}हमारा budget बिल्कुल नियंत्रण में है। होस्टिंग और विकास के लिए पर्याप्त वित्तीय संसाधन आवंटित हैं।`;
    }
    return `${prefix}मैं ऑफलाइन सैंडबॉक्स मोड में आपकी आवाज़ पूरी तरह सुन पा रहा हूँ। आप मुझसे अपने काम या व्यवसाय के बारे में कोई भी सवाल पूछ सकते हैं।`;
  }

  // Default to Bengali
  if (inputLower.includes('বাজার') || inputLower.includes('market') || inputLower.includes('analysis') || inputLower.includes('বিশ্লেষণ') || inputLower.includes('প্রতিযোগী') || inputLower.includes('competitor')) {
    return `${prefix}আমি বাজার বিশ্লেষণ করছি। আমাদের সেকশনে মূল প্রতিযোগী ওপেন ডেভ এবং ডেভ কর্পোরেশন। এআই ইন্টিগ্রেশন দ্রুত গতিতে বৃদ্ধি পাচ্ছে এবং আমাদের কাস্টমার একুইজিশনে মনোযোগ দেওয়া জরুরি।`;
  }
  if (inputLower.includes('বাজেট') || inputLower.includes('finance') || inputLower.includes('অর্থ') || inputLower.includes('টাকা') || inputLower.includes('হিসাব')) {
    return `${prefix}বর্তমান বাজেট অনুযায়ী আমাদের হোস্টিংয়ের জন্য পঁচিশ পারসেন্ট এবং মার্কেটিংয়ের জন্য পঁয়ত্রিশ পারসেন্ট বরাদ্দ রয়েছে। কাস্টমার একুইজিশনের খরচ নিয়ন্ত্রণ করা এই মুহূর্তে আমাদের মূল লক্ষ্য।`;
  }
  if (inputLower.includes('কোড') || inputLower.includes('code') || inputLower.includes('program') || inputLower.includes('api') || inputLower.includes('ডেভেলপার')) {
    return `${prefix}আমি লোকাল ডেমো মোডে একটি অত্যন্ত নিরাপদ এবং মডুলার অপ্টিমাইজার কোড স্ট্রাকচার রেডি করেছি। আপনার সার্ভার কানেকশন এখন সম্পূর্ণ স্বাভাবিক রয়েছে।`;
  }
  if (inputLower.includes('gmail') || inputLower.includes('mail') || inputLower.includes('ইমেইল') || inputLower.includes('ইনবক্স')) {
    return `${prefix}আপনার ইনবক্সে মডার্ন ইনোভিক্স থেকে একটি গুরুত্বপূর্ণ ক্লায়েন্ট মিটিংয়ের ইমেইল এসেছে। আমি এটি সুন্দর করে সামারি করে রেখেছি।`;
  }
  return `${prefix}জি স্যার, আমি লোকাল স্যান্ডবক্স মোডে আপনার কথা শুনতে পাচ্ছি। এপিআই কোটা সীমা অতিক্রমের কারণে আমি অফলাইনে আছি, তবে আপনি যেকোনো বিষয়ে আমাকে জিজ্ঞেস করতে পারেন।`;
};

interface VoiceModeProps {
  onClose: () => void;
  language?: 'bn-BD' | 'en-US' | 'hi-IN';
  voiceGender?: 'male' | 'female';
  assistantName?: string;
}

export default function VoiceMode({ onClose, language = 'bn-BD', voiceGender = 'male', assistantName = 'Jarvis' }: VoiceModeProps) {
  const [active, setActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jarvisIsSpeaking, setJarvisIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextStartTimeRef = useRef<number>(0);
  const [isSandbox, setIsSandbox] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Stop all active sources (to handle interruption immediately)
  const stopAllPlayback = () => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch (e) {
        // Already stopped
      }
    });
    activeSourcesRef.current = [];
    nextStartTimeRef.current = 0;
    setJarvisIsSpeaking(false);
  };

  const pcmToBase64 = (float32Array: Float32Array): string => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

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

  const playAudioChunk = (base64: string) => {
    const audioContext = outputAudioCtxRef.current;
    if (!audioContext || audioContext.state === 'suspended') return;

    setJarvisIsSpeaking(true);
    const float32Data = base64ToFloat32(base64);
    const buffer = audioContext.createBuffer(1, float32Data.length, 24000);
    buffer.copyToChannel(float32Data, 0);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
      if (activeSourcesRef.current.length === 0) {
        setJarvisIsSpeaking(false);
      }
    };

    activeSourcesRef.current.push(source);

    const now = audioContext.currentTime;
    if (nextStartTimeRef.current < now) {
      nextStartTimeRef.current = now + 0.05; // tiny latency buffer
    }

    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
  };

  const startLocalVoiceSession = () => {
    setError(null);
    setConnecting(true);
    setTranscription('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(language === 'en-US' ? 'Your browser does not support Speech Recognition. Please use Google Chrome.' : 'আপনার ব্রাউজারটি স্পিচ রিকগনিশন সমর্থন করে না। অনুগ্রহ করে ক্রোম ব্যবহার করুন।');
      setConnecting(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;

      recognition.onstart = () => {
        setConnecting(false);
        setActive(true);
        console.log(`Local Sandbox voice recognition started in ${language}`);
      };

      recognition.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setTranscription(resultText);
        
        const storedNickname = localStorage.getItem('jarvis_user_nickname') || 'স্যার';
        
        // Generate and speak response
        const reply = generateDynamicSandboxResponse(resultText, language, assistantName, storedNickname, hasGreeted);
        setHasGreeted(true);
        speakLocalResponse(reply);
      };

      recognition.onerror = (err: any) => {
        console.error('Local speech recognition error:', err);
        if (err.error !== 'no-speech') {
          setError(language === 'en-US' ? 'Failed to understand speech, please try again.' : 'কথা বুঝতে সমস্যা হয়েছে, দয়া করে আবার চেষ্টা করুন।');
          stopLocalVoiceSession();
        } else {
          // Just reset
          setActive(false);
          setConnecting(false);
        }
      };

      recognition.onend = () => {
        console.log('Local Speech recognition ended');
        // If not speaking, reset active state
        setTimeout(() => {
          if (!window.speechSynthesis.speaking) {
            setActive(false);
          }
        }, 1000);
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (err) {
      console.error(err);
      setError(language === 'en-US' ? 'Failed to start microphone.' : 'মাইক্রোফোন চালু করতে সমস্যা হয়েছে।');
      setConnecting(false);
    }
  };

  const speakLocalResponse = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    setJarvisIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    
    // Find voices for current language
    const voices = window.speechSynthesis.getVoices();
    const correctLangVoices = voices.filter(v => v.lang.includes(language.split('-')[0]));
    
    // Choose voice based on requested gender
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
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      setJarvisIsSpeaking(false);
      setActive(false);
    };

    utterance.onerror = () => {
      setJarvisIsSpeaking(false);
      setActive(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopLocalVoiceSession = () => {
    setActive(false);
    setConnecting(false);
    setJarvisIsSpeaking(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
      recognitionRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const startVoiceSession = async () => {
    setError(null);
    setConnecting(true);
    setTranscription('');

    try {
      // 1. Ask for mic permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      // 2. Setup AudioContexts (16kHz input, 24kHz output)
      inputAudioCtxRef.current = new AudioContext({ sampleRate: 16000 });
      outputAudioCtxRef.current = new AudioContext({ sampleRate: 24000 });

      // 3. Setup WebSocket connection
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const userNickname = localStorage.getItem('jarvis_user_nickname') || 'স্যার';
      const wsUrl = `${wsProtocol}//${window.location.host}/live?voice=${voiceGender}&lang=${language}&name=${encodeURIComponent(assistantName)}&nickname=${encodeURIComponent(userNickname)}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnecting(false);
        setActive(true);
        console.log('Voice WebSocket connected');

        // Setup processor node once connection is open
        const inputCtx = inputAudioCtxRef.current;
        if (!inputCtx) return;

        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const rawChannelData = e.inputBuffer.getChannelData(0);
            const base64PCM = pcmToBase64(rawChannelData);
            ws.send(JSON.stringify({ audio: base64PCM }));
          }
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.error) {
            if (msg.error === 'QUOTA_EXHAUSTED') {
              setIsSandbox(true);
              setError('QUOTA_EXHAUSTED');
            } else {
              setError(msg.error);
            }
            stopVoiceSession();
          }

          if (msg.audio) {
            playAudioChunk(msg.audio);
          }

          if (msg.text) {
            setTranscription((prev) => prev + ' ' + msg.text);
          }

          if (msg.interrupted) {
            console.log('Model interrupted by user voice');
            stopAllPlayback();
          }
        } catch (e) {
          console.error('Error parsing live WS message:', e);
        }
      };

      ws.onclose = () => {
        console.log('Voice WebSocket closed');
        stopVoiceSession();
      };

      ws.onerror = () => {
        setError('ভয়েস সার্ভারের সাথে সংযোগ স্থাপন করতে ব্যর্থ হয়েছে।');
        stopVoiceSession();
      };

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('QUOTA_EXHAUSTED')) {
        setIsSandbox(true);
        setError('QUOTA_EXHAUSTED');
      } else {
        setError('মাইক্রোফোন অ্যাক্সেস করতে ব্যর্থ হয়েছে। অনুগ্রহ করে পারমিশন চেক করুন।');
      }
      setConnecting(false);
    }
  };

  const stopVoiceSession = () => {
    setActive(false);
    setConnecting(false);

    // Stop and close mic stream
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    // Disconnect processors
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    // Close AudioContexts
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }

    stopAllPlayback();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  return (
    <div id="voice-overlay" className="fixed inset-0 bg-[#020205] z-50 flex flex-col justify-between p-8 text-cyan-400 font-mono overflow-hidden">
      
      {/* Visual background scanning lines & futuristic holographic backdrops */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(34,211,238,0.03),_rgba(0,0,0,0),_rgba(34,211,238,0.03))] bg-[size:100%_4px,_100%_100%] pointer-events-none opacity-45 z-0"></div>
      
      {/* Large faint glowing ambient center orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Top bar */}
      <div className="flex justify-between items-center max-w-2xl mx-auto w-full z-10">
        <div className="flex items-center gap-2">
          {isSandbox ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md">
              <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">SYSTEM OFFLINE: VOICE SANDBOX</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">JARVIS CORE VOICE ACTIVE</span>
            </div>
          )}
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-all px-3 py-1 border border-cyan-500/10 bg-cyan-500/5 hover:bg-cyan-500/20 rounded-lg text-xs cursor-pointer tracking-wider"
        >
          DISENGAGE [X]
        </button>
      </div>

      {/* Center Wave and Controls */}
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full flex-1 gap-12">
        <div className="relative flex items-center justify-center p-16">
          {/* Animated Wave Rings and Concentric Dials */}
          <div className="absolute w-80 h-80 border border-cyan-500/5 rounded-full pointer-events-none" />
          <div className="absolute w-72 h-72 border border-cyan-500/10 rounded-full border-dashed pointer-events-none" />
          
          <div className={`absolute w-64 h-64 border border-cyan-500/20 rounded-full border-dashed pointer-events-none ${active ? 'animate-[spin_25s_linear_infinite]' : 'animate-[spin_50s_linear_infinite]'}`}></div>
          <div className={`absolute w-56 h-56 border-2 border-cyan-500/10 rounded-full pointer-events-none ${active ? 'animate-[spin_12s_linear_infinite_reverse]' : 'animate-[spin_25s_linear_infinite_reverse]'}`} style={{ borderStyle: 'double' }}></div>

          {/* Dotted HUD Circle */}
          <svg className={`absolute w-60 h-60 pointer-events-none ${active ? 'animate-[spin_30s_linear_infinite]' : 'animate-[spin_60s_linear_infinite]'}`} viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#06b6d4" 
              strokeWidth="1.5" 
              strokeDasharray="4 8 16 4" 
              className="opacity-25"
            />
          </svg>

          {/* Inner pulsating waves */}
          <AnimatePresence>
            {active && (
              <>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: jarvisIsSpeaking ? [1.1, 1.35, 1.1] : [1, 1.15, 1],
                    opacity: jarvisIsSpeaking ? [0.5, 0.15, 0.5] : [0.35, 0.1, 0.35],
                    borderColor: jarvisIsSpeaking ? '#22d3ee' : '#0891b2'
                  }}
                  transition={{ repeat: Infinity, duration: jarvisIsSpeaking ? 1.2 : 2.5, ease: 'easeInOut' }}
                  className="absolute w-44 h-44 rounded-full border border-cyan-400/40"
                />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0.3 }}
                  animate={{ 
                    scale: jarvisIsSpeaking ? [1.2, 1.55, 1.2] : [1, 1.25, 1],
                    opacity: jarvisIsSpeaking ? [0.35, 0, 0.35] : [0.15, 0, 0.15],
                    borderColor: jarvisIsSpeaking ? '#22d3ee' : '#0891b2'
                  }}
                  transition={{ repeat: Infinity, duration: jarvisIsSpeaking ? 1.5 : 3.2, ease: 'easeInOut' }}
                  className="absolute w-52 h-52 rounded-full border border-cyan-500/20"
                />
              </>
            )}
          </AnimatePresence>

          {/* Core Interactive Holographic Arc Reactor Trigger Button */}
          <button
            onClick={active ? (isSandbox ? stopLocalVoiceSession : stopVoiceSession) : (isSandbox ? startLocalVoiceSession : startVoiceSession)}
            disabled={connecting}
            className={`relative z-10 w-32 h-32 rounded-full border flex flex-col items-center justify-center transition-all duration-500 cursor-pointer active:scale-95 group ${
              active 
                ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.45)] hover:bg-cyan-900/50' 
                : 'bg-black/80 border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]'
            }`}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_50%_25%,_rgba(255,255,255,0.12)_0%,_transparent_75%)]" />

            {connecting ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-cyan-400">CONNECTING</span>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center">
                {/* Advanced Holographic Triangle / Circle */}
                <svg className={`w-20 h-20 transition-transform duration-500 ${active ? 'scale-110 animate-pulse' : 'scale-100 group-hover:scale-105'}`} viewBox="0 0 100 100">
                  <defs>
                    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {/* Outer Triangle energy ring */}
                  <polygon 
                    points="50,22 24,68 76,68" 
                    fill="none" 
                    stroke={active ? '#22d3ee' : '#0891b2'} 
                    strokeWidth="3" 
                    filter="url(#neon-glow)"
                    className="transition-colors duration-500"
                  />
                  <polygon 
                    points="50,29 30,64 70,64" 
                    fill={active ? 'rgba(34,211,238,0.15)' : 'rgba(6,182,212,0.05)'} 
                    stroke={active ? '#22d3ee' : '#0891b2'} 
                    strokeWidth="1.5" 
                    className="transition-colors duration-500"
                  />

                  {/* Concentric core dots */}
                  <circle cx="50" cy="53" r="10" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="50" cy="53" r="4" fill="#22d3ee" className={active ? 'animate-ping' : ''} />
                </svg>

                {/* Status caption overlay inside circle */}
                <span className="absolute bottom-3 text-[8px] font-bold tracking-widest text-cyan-300 uppercase opacity-75 group-hover:opacity-100 transition-all">
                  {active ? 'CLOSE CORE' : 'TAP TO VOICE'}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Informational Text & Transcripts */}
        <div className="text-center space-y-4 w-full">
          {connecting && (
            <p className="text-sm font-medium text-gray-400">
              {language === 'en-US' 
                ? `Establishing live voice connection with ${assistantName}...` 
                : language === 'hi-IN' 
                  ? `${assistantName} के साथ लाइव वॉयस कनेक्शन स्थापित किया जा रहा है...` 
                  : `${assistantName}-এর সাথে ভয়েস লাইভ সংযোগ তৈরি করা হচ্ছে...`}
            </p>
          )}
          {active && (
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-wider text-cyan-200">
                {jarvisIsSpeaking 
                  ? (language === 'en-US' 
                      ? `${assistantName.toUpperCase()} IS TRANSMITTING VOCAL DATA...` 
                      : language === 'hi-IN' 
                        ? `${assistantName.toUpperCase()} बोल रहा है...` 
                        : `${assistantName.toUpperCase()} কথা বলছেন...`)
                  : (language === 'en-US' 
                      ? `LISTENING FOR YOUR VOCAL DIRECTIVES, COMMAND NOW...` 
                      : language === 'hi-IN' 
                        ? `बोलिए, ${assistantName} सुन रहा है...` 
                        : `কথা বলুন, জারভিস শুনছেন...`)}
              </h3>
              <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase animate-pulse">
                {jarvisIsSpeaking ? `[ ${assistantName.toUpperCase()} TRANSMITTING ]` : '[ COGNITIVE LISTENING SYSTEM ONLINE ]'}
              </p>
              {transcription && (
                <div className="mt-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] max-h-[120px] overflow-y-auto text-xs text-cyan-300 max-w-md mx-auto leading-relaxed font-mono text-left">
                  <span className="text-[9px] text-cyan-500 uppercase block font-bold tracking-wider border-b border-cyan-500/10 pb-1 mb-1.5">REAL-TIME COGNITIVE TRANSCRIPTION</span>
                  {transcription}
                </div>
              )}
            </div>
          )}
          {!active && !connecting && (
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-widest text-cyan-300">
                {language === 'en-US' 
                  ? `${assistantName.toUpperCase()} NEURAL VOICE PORTAL` 
                  : language === 'hi-IN' 
                    ? `${assistantName.toUpperCase()} वॉयस चैनल` 
                    : `${assistantName.toUpperCase()} নিউরাল ভয়েস পোর্টাল`}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                {language === 'en-US' 
                  ? `Engage the cybernetic core to establish high-frequency real-time audio transmission.` 
                  : language === 'hi-IN' 
                    ? `वास्तविक समय में ${assistantName} से बात करने के लिए कोर को संलग्न करें।` 
                    : `লাইভ ভয়েস কম্যুনিকেশন চ্যানেল চালু করার জন্য সেন্ট্রাল আর্কে আলতো চাপুন।`}
              </p>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-xl max-w-md mx-auto text-xs text-red-400">
              {error === 'QUOTA_EXHAUSTED' ? (
                <div className="text-left space-y-1.5">
                  <p className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> এপিআই কোটা সীমা অতিক্রম করেছে!
                  </p>
                  <p className="text-[10px] text-gray-300 leading-relaxed">
                    আপনার জেমিনি লাইভ ভয়েস এপিআই কোটা শেষ হয়ে গেছে। আমরা আপনার জন্য <strong>লোকাল ভয়েস স্যান্ডবক্স মোড</strong> সক্রিয় করেছি যাতে আপনি ব্রাউজারের নিজস্ব স্পিচ-টু-টেক্সট ও স্পিচ-টু-স্পিচ ইঞ্জিন ব্যবহার করে জারভিসের সাথে কথা বলা চালিয়ে যেতে পারেন।
                  </p>
                  <button 
                    onClick={() => {
                      setIsSandbox(false);
                      setError(null);
                    }}
                    className="text-[9px] text-slate-400 hover:text-white underline font-bold cursor-pointer block mt-1"
                  >
                    লাইভ মোডে পুনরায় সংযোগ করুন
                  </button>
                </div>
              ) : (
                error
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar Hints */}
      <div className="max-w-md mx-auto w-full text-center text-[11px] text-gray-500 pb-4">
        {language === 'en-US' 
          ? `When you start speaking, ${assistantName} will listen. If you speak while ${assistantName} is talking, ${assistantName} will automatically pause to listen to you.` 
          : language === 'hi-IN' 
            ? `जब आप बोलना शुरू करेंगे, ${assistantName} सुनेगा। अगर आप ${assistantName} के बोलने के दौरान बात करेंगे, तो वह आपकी बात सुनने के लिए खुद रुक जाएगा।` 
            : `আপনি কথা বলা শুরু করলে ${assistantName} শুনবে। ${assistantName}-এর কথা বলার সময়ে আপনি কোনো কথা বললে ${assistantName} স্বয়ংক্রিয়ভাবে কথা থামিয়ে আপনার পরবর্তী বার্তা শুনবে।`}
      </div>
    </div>
  );
}
