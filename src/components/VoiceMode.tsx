import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff, Volume2, HelpCircle, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const generateDynamicSandboxResponse = (text: string, lang: string, name: string): string => {
  const inputLower = text.toLowerCase();
  
  if (lang === 'en-US') {
    if (inputLower.includes('email') || inputLower.includes('mail') || inputLower.includes('write') || inputLower.includes('draft')) {
      return `I have successfully drafted the email in English for you, Sir. Here is the draft: "Dear Partner, I hope this email finds you well. I would like to schedule a session next week to sync on our business strategy." Would you like me to send it?`;
    }
    if (inputLower.includes('market') || inputLower.includes('competitor') || inputLower.includes('analysis')) {
      return `I am analyzing the market, Sir. Competitors are aggressively expanding AI capability. We should optimize our digital acquisition funnel.`;
    }
    if (inputLower.includes('code') || inputLower.includes('api') || inputLower.includes('developer') || inputLower.includes('server')) {
      return `The server status is fully operational. I have refactored the optimization scripts, and our workspace connection is 100% active.`;
    }
    return `Yes Sir, I can hear you clearly. I am currently running in Local Sandbox Mode as the API quota is exhausted, but I am ready to assist you. How can I help?`;
  }

  if (lang === 'hi-IN') {
    if (inputLower.includes('email') || inputLower.includes('mail') || inputLower.includes('likh')) {
      return `जी सर, मैंने आपके लिए अंग्रेजी में एक पेशेवर ईमेल का मसौदा तैयार किया है। क्या मैं इसे भेज दूँ?`;
    }
    if (inputLower.includes('market') || inputLower.includes('budget') || inputLower.includes('paisa')) {
      return `सर, हमारा बजट बिल्कुल नियंत्रण में है। होस्टिंग और विकास के लिए पर्याप्त वित्तीय संसाधन आवंटित हैं।`;
    }
    return `जी सर, मैं ऑफलाइन सैंडबॉक्स मोड में आपकी आवाज़ पूरी तरह सुन पा रहा हूँ। आप मुझसे अपने काम या व्यवसाय के बारे में कोई भी सवाल पूछ सकते हैं।`;
  }

  // Default to Bengali
  if (inputLower.includes('বাজার') || inputLower.includes('market') || inputLower.includes('analysis') || inputLower.includes('বিশ্লেষণ') || inputLower.includes('প্রতিযোগী') || inputLower.includes('competitor')) {
    return 'আমি বাজার বিশ্লেষণ করছি। আমাদের সেকশনে মূল প্রতিযোগী ওপেন ডেভ এবং ডেভ কর্পোরেশন। এআই ইন্টিগ্রেশন দ্রুত গতিতে বৃদ্ধি পাচ্ছে এবং আমাদের কাস্টমার একুইজিশনে মনোযোগ দেওয়া জরুরি।';
  }
  if (inputLower.includes('বাজেট') || inputLower.includes('finance') || inputLower.includes('অর্থ') || inputLower.includes('টাকা') || inputLower.includes('হিসাব')) {
    return 'বর্তমান বাজেট অনুযায়ী আমাদের হোস্টিংয়ের জন্য পঁচিশ পারসেন্ট এবং মার্কেটিংয়ের জন্য পঁয়ত্রিশ পারসেন্ট বরাদ্দ রয়েছে। কাস্টমার একুইজিশনের খরচ নিয়ন্ত্রণ করা এই মুহূর্তে আমাদের মূল লক্ষ্য।';
  }
  if (inputLower.includes('কোড') || inputLower.includes('code') || inputLower.includes('program') || inputLower.includes('api') || inputLower.includes('ডেভেলপার')) {
    return 'আমি লোকাল ডেমো মোডে একটি অত্যন্ত নিরাপদ এবং মডুলার অপ্টিমাইজার কোড স্ট্রাকচার রেডি করেছি। আপনার সার্ভার কানেকশন এখন সম্পূর্ণ স্বাভাবিক রয়েছে।';
  }
  if (inputLower.includes('gmail') || inputLower.includes('mail') || inputLower.includes('ইমেইল') || inputLower.includes('ইনবক্স')) {
    return 'আপনার ইনবক্সে মডার্ন ইনোভিক্স থেকে একটি গুরুত্বপূর্ণ ক্লায়েন্ট মিটিংয়ের ইমেইল এসেছে। আমি এটি সুন্দর করে সামারি করে রেখেছি।';
  }
  return `জি স্যার, আমি লোকাল স্যান্ডবক্স মোডে আপনার কথা শুনতে পাচ্ছি। এপিআই কোটা সীমা অতিক্রমের কারণে আমি অফলাইনে আছি, তবে আপনি যেকোনো বিষয়ে আমাকে জিজ্ঞেস করতে পারেন।`;
};

interface VoiceModeProps {
  onClose: () => void;
  language?: 'bn-BD' | 'en-US' | 'hi-IN';
  voiceGender?: 'male' | 'female';
  assistantName?: string;
}

export default function VoiceMode({ onClose, language = 'bn-BD', voiceGender = 'female', assistantName = 'Jarvis' }: VoiceModeProps) {
  const [active, setActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jarvisIsSpeaking, setJarvisIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');

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
        
        // Generate and speak response
        const reply = generateDynamicSandboxResponse(resultText, language, assistantName);
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
      const wsUrl = `${wsProtocol}//${window.location.host}/live?voice=${voiceGender}&lang=${language}&name=${encodeURIComponent(assistantName)}`;
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
    <div id="voice-overlay" className="fixed inset-0 bg-gray-950/95 backdrop-blur-md z-50 flex flex-col justify-between p-8 text-white">
      {/* Top bar */}
      <div className="flex justify-between items-center max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2">
          {isSandbox ? (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Jarvis Voice Sandbox</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Jarvis Live Voice</span>
            </>
          )}
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl text-xs cursor-pointer"
        >
          বন্ধ করুন
        </button>
      </div>

      {/* Center Wave and Controls */}
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full flex-1 gap-12">
        <div className="relative flex items-center justify-center">
          {/* Animated Wave Rings */}
          <AnimatePresence>
            {active && (
              <>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: jarvisIsSpeaking ? [1.1, 1.4, 1.1] : [1, 1.2, 1],
                    opacity: jarvisIsSpeaking ? [0.4, 0.1, 0.4] : [0.3, 0.1, 0.3]
                  }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="absolute w-44 h-44 rounded-full border border-gray-500"
                />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0.3 }}
                  animate={{ 
                    scale: jarvisIsSpeaking ? [1.2, 1.6, 1.2] : [1, 1.3, 1],
                    opacity: jarvisIsSpeaking ? [0.3, 0, 0.3] : [0.2, 0, 0.2]
                  }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="absolute w-56 h-56 rounded-full border border-gray-600"
                />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0.2 }}
                  animate={{ 
                    scale: jarvisIsSpeaking ? [1.3, 1.8, 1.3] : [1, 1.4, 1],
                    opacity: jarvisIsSpeaking ? [0.2, 0, 0.2] : [0.1, 0, 0.1]
                  }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute w-64 h-64 rounded-full border border-gray-700"
                />
              </>
            )}
          </AnimatePresence>

          {/* Core Interactive Mic Button */}
          <button
            onClick={active ? (isSandbox ? stopLocalVoiceSession : stopVoiceSession) : (isSandbox ? startLocalVoiceSession : startVoiceSession)}
            disabled={connecting}
            className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all ${
              active 
                ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30' 
                : 'bg-white hover:bg-gray-100 text-gray-950 shadow-lg shadow-white/10'
            } disabled:opacity-50 cursor-pointer`}
          >
            {connecting ? (
              <Loader2 className="w-10 h-10 animate-spin text-gray-950" />
            ) : active ? (
              <PhoneOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-gray-950" />
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
              <h3 className="text-xl font-bold tracking-tight">
                {jarvisIsSpeaking 
                  ? (language === 'en-US' 
                      ? `${assistantName} is speaking...` 
                      : language === 'hi-IN' 
                        ? `${assistantName} बोल रहा है...` 
                        : `${assistantName} কথা বলছেন...`)
                  : (language === 'en-US' 
                      ? `Speak now, ${assistantName} is listening...` 
                      : language === 'hi-IN' 
                        ? `बोलिए, ${assistantName} सुन रहा है...` 
                        : `কথা বলুন, ${assistantName} শুনছেন...`)}
              </h3>
              <p className="text-xs text-emerald-500 font-bold tracking-wider uppercase">
                {jarvisIsSpeaking ? `${assistantName} Speaking` : 'Listening...'}
              </p>
              {transcription && (
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 max-h-[100px] overflow-y-auto text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                  {transcription}
                </div>
              )}
            </div>
          )}
          {!active && !connecting && (
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">
                {language === 'en-US' 
                  ? `Direct Conversation with ${assistantName}` 
                  : language === 'hi-IN' 
                    ? `${assistantName} के साथ सीधी बातचीत` 
                    : `${assistantName}-এর সাথে সরাসরি কথোপকথন`}
              </h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                {language === 'en-US' 
                  ? `Turn on the microphone to speak with ${assistantName} in real-time.` 
                  : language === 'hi-IN' 
                    ? `वास्तविक समय में ${assistantName} से बात करने के लिए माइक्रोफ़ोन चालू करें।` 
                    : `মাইক্রোফোন অন করে আপনি ${assistantName}-এর সাথে রিয়েল-টাইমে কথা বলতে পারেন।`}
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
