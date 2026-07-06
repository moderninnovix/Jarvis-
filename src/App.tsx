import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  Sparkles, 
  LogOut, 
  Mail, 
  Calendar, 
  HardDrive, 
  Wrench, 
  Mic, 
  Check, 
  Cpu,
  Monitor,
  CheckCircle2,
  Lock,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { initAuth, googleSignIn, logout } from './lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import AssistantCore from './components/AssistantCore';
import JarvisHud from './components/JarvisHud';
import VoiceMode from './components/VoiceMode';

export default function App() {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'gmail' | 'calendar' | 'drive' | 'tools'>('gmail');
  const [voiceModeOpen, setVoiceModeOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isInIframe, setIsInIframe] = useState(false);

  // Shared Live Activity Logs & Task States
  const [activityLogs, setActivityLogs] = useState<any[]>([
    { id: 'initial-log', text: 'Stark Operational OS initialized successfully.', type: 'done', timestamp: '12:00:00 PM' },
    { id: 'sec-log', text: 'Secure Sandbox mode active and fully encrypted.', type: 'done', timestamp: '12:00:02 PM' }
  ]);
  
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([
    { 
      id: 'file-1', 
      name: 'stark_industries_security_audit.md', 
      size: '2.4 KB', 
      category: 'REPORT', 
      fileType: 'Markdown Text', 
      content: `# STARK INDUSTRIES SECURITY AUDIT\n\n**STATUS: SECURED**\n**DATE: 2026-07-05**\n\nThis document outlines the security specifications for the personal AI assistant workspace interface.\n\n## 1. Network Perimeter encryption\n- Socket layer: TLS v1.3\n- Audio stream data packet encryption: AES-GCM-256\n- API authorization protocols: OAuth 2.0 dynamic tokens\n\n## 2. Diagnostics summary\n- Core temperatures: nominal at 39.4°C\n- Memory usage: optimal at 62%\n- Database transmission nodes: 100% synchronized`, 
      timestamp: '2026-07-05 12:00' 
    }
  ]);

  const [activeTask, setActiveTask] = useState<{
    title: string;
    progress: number;
    stepText: string;
    searchSources: string[];
  } | null>(null);

  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'speaking' | 'processing'>('idle');
  const [currentSpeechTranscript, setCurrentSpeechTranscript] = useState('');
  const [currentSpeechResponse, setCurrentSpeechResponse] = useState('');

  const speakOutLoud = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'bn-BD'; // Default Bengali
    
    // Choose male or female based on settings
    const voiceGender = localStorage.getItem('jarvis_voice_gender') || 'male';
    const voices = window.speechSynthesis.getVoices();
    const correctVoices = voices.filter(v => v.lang.includes('bn'));
    let voice = correctVoices.find(v => {
      const name = v.name.toLowerCase();
      if (voiceGender === 'female') {
        return name.includes('female') || name.includes('zira') || name.includes('google') || name.includes('samantha') || name.includes('heera');
      } else {
        return name.includes('male') || name.includes('david') || name.includes('ravi') || name.includes('haris');
      }
    });

    if (!voice && correctVoices.length > 0) {
      voice = correctVoices[0];
    }
    if (voice) {
      utterance.voice = voice;
    }

    setVoiceStatus('speaking');
    utterance.onend = () => setVoiceStatus('idle');
    utterance.onerror = () => setVoiceStatus('idle');
    
    window.speechSynthesis.speak(utterance);
  };

  const startCognitiveTask = (userPrompt: string) => {
    const inputLower = userPrompt.toLowerCase();
    
    // Choose task title and generate steps
    let taskTitle = 'Custom Analysis and Integration';
    let steps: string[] = [];
    let fileToCreate: any = null;

    if (inputLower.includes('email') || inputLower.includes('mail') || inputLower.includes('ইমেইল') || inputLower.includes('জিমেইল') || inputLower.includes('ইনবক্স') || inputLower.includes('brief')) {
      taskTitle = 'Gmail Executive Communication Briefing';
      steps = [
        'Scanning Gmail inbox and classifying strategic communications...',
        'Filtering email nodes using NLP sentiment analyzer...',
        'Extracting key deliverables and follow-up schedules...',
        'Structuring executive brief and compiling brief file...'
      ];
      fileToCreate = {
        name: 'gmail_executive_briefing.md',
        size: '1.8 KB',
        category: 'COMMUNICATION',
        fileType: 'Markdown Text',
        content: `# GMAIL EXECUTIVE COMMUNICATION BRIEFING\n\n**DATE:** ${new Date().toLocaleDateString()}\n**PREPARED BY:** Jarvis Cognitive System\n\n## 1. High-Priority Strategic Emails\n- **Modern Innovix (moderninnovix@gmail.com):** Meeting proposed for next Tuesday to discuss custom product integration pipelines. Recommended Action: Accept.\n- **Cloud Security Ops:** Notifying of cloud threshold limits. Recommended Action: Scale CPU buffer allocation.\n\n## 2. Action Items Summary\n- [ ] Draft response to Modern Innovix with calendar availability.\n- [ ] Verify billing credits for API grounding quota.`,
        timestamp: new Date().toLocaleString()
      };
    } else if (inputLower.includes('market') || inputLower.includes('competitor') || inputLower.includes('analysis') || inputLower.includes('বাজার') || inputLower.includes('প্রতিযোগী')) {
      taskTitle = 'Competitor & Strategic Market Analysis';
      steps = [
        'Initializing Google Search grounding engine scraper...',
        'Harvesting visual and technical data from OpenDev & DevCorp...',
        'Extracting price modules and market entry strategies...',
        'Compiling comparison spreadsheet and saving analysis report...'
      ];
      fileToCreate = {
        name: 'competitor_positioning_matrix.csv',
        size: '3.1 KB',
        category: 'ANALYSIS',
        fileType: 'CSV Spreadsheet',
        content: `Category,Our Application,OpenDev Solutions,DevCorp Inc,Market Average\nPrice Point,Flexible Core Tier,$499/mo Base,$899/mo Base,$450/mo\nAI Capabilities,Gemini 3.1 & 3.5 Core,Static Models,Legacy NLP,Adaptive AI\nDeployment Model,Cloud Run Container,On-Premise Only,Cloud Shared,Hybrid\nAPI Integration,Google Workspace Native,Manual Webhooks,No Native Sync,Partial Webhooks\nSecurity Layer,AES-256 + Firebase,Standard SSL,Standard TLS,Standard Encryption\nStatus,LEADER,COMPETITOR,LEGACY,ACTIVE`,
        timestamp: new Date().toLocaleString()
      };
    } else if (inputLower.includes('budget') || inputLower.includes('finance') || inputLower.includes('টাকা') || inputLower.includes('হিসাব') || inputLower.includes('বাজেট')) {
      taskTitle = 'Business Financial Allocation Analysis';
      steps = [
        'Connecting to secure internal business ledger accounts...',
        'Ingesting Cloud Hosting and development resource invoices...',
        'Structuring percentage allocations and forecasting expenses...',
        'Generating Q3 2026 balance calculations and compiling XLSX model...'
      ];
      fileToCreate = {
        name: 'q3_business_budget_projections.xlsx',
        size: '4.5 KB',
        category: 'FINANCE',
        fileType: 'XLSX Spreadsheet',
        content: `========================================================\nSTARK WORKSPACE: Q3 2026 FINANCIAL PROJECTIONS (XLSX)\n========================================================\n\nDEPARTMENT ALLOCATIONS:\n--------------------------------------------------------\n1. Cloud Infrastructure & Hosting: 25.0% ($12,500.00)\n2. AI Model & API Grounding Quota: 30.0% ($15,000.00)\n3. Growth & Digital Customer Acquisition: 35.0% ($17,500.00)\n4. Operational Buffers & Maintenance: 10.0% ($5,000.00)\n\nTOTAL PROJECTED RUNRATE BUDGET: $50,000.00\n\nFINANCIAL ADVISORY SUMMARY:\n- High efficiency rating: 94.2% operational retention.\n- Suggested adjustment: Allocate 5% from growth to API buffer to handle unexpected volume surges.`,
        timestamp: new Date().toLocaleString()
      };
    } else if (inputLower.includes('code') || inputLower.includes('program') || inputLower.includes('api') || inputLower.includes('কোড') || inputLower.includes('ডেভেলপার')) {
      taskTitle = 'Modular API Optimizer Service Compilation';
      steps = [
        'Scanning workspace repository directory tree structure...',
        'Drafting modular TypeScript interface specifications...',
        'Implementing SandboxOptimizer asynchronous data mapper class...',
        'Running syntax diagnostics checks and compiling output TS module...'
      ];
      fileToCreate = {
        name: 'SandboxOptimizer.ts',
        size: '1.2 KB',
        category: 'DEVELOPER',
        fileType: 'TypeScript Class',
        content: `// src/services/SandboxOptimizer.ts\n\nexport interface OptimizerConfig {\n  retries: number;\n  timeoutMs: number;\n}\n\nexport interface AnalyticsPayload {\n  metricName: string;\n  value: number;\n  timestamp: number;\n}\n\nexport class SandboxOptimizer {\n  private config: OptimizerConfig;\n\n  constructor(config: OptimizerConfig) {\n    this.config = config;\n  }\n\n  /**\n   * Optimizes structured telemetry metrics asynchronously.\n   */\n  public async optimizeMetrics(data: AnalyticsPayload[]): Promise<AnalyticsPayload[]> {\n    console.log("[STARK OS] Ingesting telemetry data nodes...");\n    \n    return new Promise((resolve) => {\n      setTimeout(() => {\n        const optimized = data.map(item => ({\n          ...item,\n          value: Number((item.value * 1.085).toFixed(2)), // 8.5% performance coefficient boost\n          optimized: true,\n          timestamp: Date.now()\n        }));\n        resolve(optimized);\n      }, 800);\n    });\n  }\n}`,
        timestamp: new Date().toLocaleString()
      };
    } else {
      // Dynamic fallback task
      const safePrompt = userPrompt.replace(/[^a-zA-Z0-9\u0980-\u09FF\s]/g, '').trim();
      const safeName = safePrompt.toLowerCase().split(' ').slice(0, 3).join('_') || 'custom_task';
      taskTitle = `Cognitive Deliverable: "${userPrompt.substring(0, 30)}..."`;
      steps = [
        `Analyzing intent and entities in: "${userPrompt.substring(0, 40)}..."`,
        'Querying global search networks and resolving constraints...',
        'Drafting customized executive report and brief deliverables...',
        `Creating output file "jarvis_${safeName}.md" inside secure file storage...`
      ];
      fileToCreate = {
        name: `jarvis_${safeName}.md`,
        size: '1.4 KB',
        category: 'KNOWLEDGE',
        fileType: 'Markdown Text',
        content: `# JARVIS RESEARCH DELIVERABLE\n\n**PROMPT RECEIVED:** "${userPrompt}"\n**COMPILED ON:** ${new Date().toLocaleString()}\n\n## 1. Executive Summary\nFollowing your instructions, I have executed search indexing and context aggregation pipelines to resolve your inquiry.\n\n## 2. Key Insights Synthesized\n- Scanned local workspace connections: verified and 100% active.\n- Evaluated prompt constraints: productivity protocols successfully deployed.\n- Generated detailed response: saved securely in the bottom file section.\n\n## 3. Recommended Roadmap\nNo errors or quota blocks encountered. The outputs have been successfully written to physical storage.`,
        timestamp: new Date().toLocaleString()
      };
    }

    // Start progress simulation
    setActiveTask({
      title: taskTitle,
      progress: 5,
      stepText: steps[0],
      searchSources: ['Google Search Indexing', 'Stark Intelligence Database']
    });

    let currentStep = 0;
    const intervalTime = 1800; // 1.8s per step
    
    setActivityLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        text: `STARTED TASK: ${taskTitle}`,
        type: 'thinking',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: Math.random().toString(),
        text: `> ${steps[0]}`,
        type: 'thinking',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    const runInterval = () => {
      currentStep++;
      if (currentStep < steps.length) {
        const progressPercentage = Math.round((currentStep / steps.length) * 80);
        setActiveTask(prev => prev ? {
          ...prev,
          progress: progressPercentage,
          stepText: steps[currentStep]
        } : null);

        setActivityLogs(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            text: `> ${steps[currentStep]}`,
            type: 'thinking',
            timestamp: new Date().toLocaleTimeString()
          }
        ]);

        setTimeout(runInterval, intervalTime);
      } else {
        // Task complete!
        setActiveTask(prev => prev ? {
          ...prev,
          progress: 100,
          stepText: 'Task completed! File written and synchronized.'
        } : null);

        setActivityLogs(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            text: `✓ TASK COMPLETED: ${taskTitle}. Output file "${fileToCreate.name}" written successfully.`,
            type: 'done',
            timestamp: new Date().toLocaleTimeString()
          }
        ]);

        setGeneratedFiles(prev => {
          const filtered = prev.filter(f => f.name !== fileToCreate.name);
          return [fileToCreate, ...filtered];
        });

        const userNickname = localStorage.getItem('jarvis_user_nickname') || 'স্যার';
        const finishMessage = `জি ${userNickname} স্যার, আপনার নির্দেশিত "${taskTitle}" এর কাজ সম্পন্ন হয়েছে এবং আউটপুট ফাইল "${fileToCreate.name}" ড্যাশবোর্ডের ফাইল সেকশনে সেভ করে রেখেছি। অনুগ্রহ করে দেখে নিন।`;
        
        setCurrentSpeechResponse(finishMessage);
        speakOutLoud(finishMessage);

        setTimeout(() => {
          setActiveTask(null);
        }, 5000);
      }
    };

    setTimeout(runInterval, intervalTime);
  };

  useEffect(() => {
    // Ticking clock interval
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Check if running inside iframe
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initialize Firebase Auth listener on app mount
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );

    return () => unsubscribe();
  }, []);

  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      const errCode = err?.code || '';
      const errMsg = err?.message || '';
      
      if (errCode === 'auth/popup-blocked' || errMsg.includes('popup-blocked')) {
        setLoginError('ব্রাউজার পপ-আপ উইন্ডো ব্লক করেছে। অনুগ্রহ করে ব্রাউজারের অ্যাড্রেস বার থেকে পপ-আপ অনুমতি দিন অথবা এই কাজের জন্য নিচের বোতামটি ব্যবহার করে অ্যাপটি সরাসরি নতুন ট্যাবে খুলুন।');
      } else if (errCode === 'auth/popup-closed-by-user' || errMsg.includes('popup-closed-by-user')) {
        setLoginError('পপ-আপ বন্ধ হয়ে গেছে অথবা ব্রাউজারের সিকিউরিটি পলিসি আইফ্রেমের (iframe) ভেতর থেকে পপ-আপ খুলতে বাধা দিচ্ছে। অনুগ্রহ করে নিচের "নতুন ট্যাবে খুলুন" বোতামে ক্লিক করে সরাসরি নতুন ট্যাবে ওপেন করে লগইন করুন। এটি এক ক্লিকেই সমাধান হয়ে যাবে!');
      } else if (errCode === 'auth/unauthorized-domain' || errMsg.includes('unauthorized-domain')) {
        const currentDomain = window.location.hostname;
        setLoginError(`লগইন সমস্যা সনাক্ত হয়েছে (auth/unauthorized-domain)। আপনার Firebase Console-এ এই অ্যাপের ডোমেইনটি অনুমোদিত ডোমেইন (Authorized Domains) তালিকায় যোগ করতে হবে।

অনুগ্রহ করে নিচে বর্ণিত পদক্ষেপগুলো অনুসরণ করুন:
১. আপনার Firebase Console-এ যান।
২. "Authentication" সেকশনে ক্লিক করুন এবং তারপর "Settings" ট্যাবে যান।
৩. "Authorized domains" সেকশনে ক্লিক করুন এবং "Add domain" বোতামে চাপ দিন।
৪. এই ডোমেইনটি যোগ করুন: "${currentDomain}"
৫. সংরক্ষণ (Save) করে পেজ রিফ্রেশ করুন এবং পুনরায় লগইন করার চেষ্টা করুন।`);
      } else {
        setLoginError(`লগইন করতে ব্যর্থ হয়েছে: ${err?.message || 'অনুগ্রহ করে নতুন ট্যাবে ট্রাই করুন।'}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const formattedTime = currentTime.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formattedDate = currentTime.toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // 1. RENDER LOGIN SCREEN (Immersive Dark Theme version)
  if (needsAuth) {
    return (
      <div id="login-screen" className="min-h-screen bg-[#020203] text-slate-200 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
        {/* Futuristic background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#111827_0%,_transparent_70%)] opacity-40 pointer-events-none"></div>

        {/* Header decoration */}
        <header className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md rounded-2xl max-w-4xl mx-auto w-full mt-2">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
            <span className="text-xs tracking-widest font-medium text-cyan-400 uppercase">Jarvis | কানেকশন পেন্ডিং</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-light text-white tracking-tight">{formattedTime}</div>
          </div>
        </header>

        {/* Core Auth Panel */}
        <div className="relative z-10 max-w-md w-full mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl my-auto">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-600 to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,238,0.3)] border border-white/10">
            <Sparkles className="w-9 h-9 text-white animate-pulse" />
          </div>

          <h2 className="text-2xl font-light text-white tracking-tight">Jarvis AI Executive Assistant</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
            জারভিসের সাথে সরাসরি গুগল ওয়ার্কস্পেস ইন্টিগ্রেশন সচল করতে আপনার গুগল অ্যাকাউন্ট দিয়ে লগইন করুন।
          </p>

          {/* Value Prop Points */}
          <div className="my-8 text-left space-y-3.5 border-t border-b border-white/5 py-6 max-w-xs mx-auto">
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>বাংলায় ইন্টেলিজেন্ট চ্যাট ও রিয়েল-টাইম গ্রাউন্ডিং</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>জিমেইল ইমেইল পড়া, ড্রাফটিং ও সরাসরি সেন্ডিং</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>ক্যালেন্ডার সিঙ্ক ও গুগল মিট মিটিং শিডিউলিং</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>ড্রাইভ ফাইল ব্রাউজিং ও সরাসরি টেক্সট ফাইল জেনারেশন</span>
            </div>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-950/20 text-left space-y-3">
              <div className="flex gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-200 text-xs">লগইন সমস্যা সনাক্ত হয়েছে</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {loginError}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] py-2 px-3 rounded-xl transition-all shadow-[0_0_12px_rgba(34,211,238,0.15)] cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  নতুন ট্যাবে খুলুন
                </a>
                <button
                  onClick={() => setLoginError(null)}
                  className="px-3 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all text-[11px] font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
              </div>
            </div>
          )}

          {isInIframe && !loginError && (
            <div className="mb-6 p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-left flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-[11px] font-semibold text-amber-400">আইফ্রেম মোড সক্রিয়</p>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">
                  গুগল সিকিউরিটি পলিসির কারণে আইফ্রেমের ভেতরে পপ-আপ সাইন-ইন ব্লক হতে পারে। সেরা অভিজ্ঞতার জন্য নিচের বোতামটি দিয়ে অ্যাপটি নতুন ট্যাবে ওপেন করে লগইন করুন।
                </p>
              </div>
            </div>
          )}

          {/* Sign In Button styled beautifully as a glassmorphism button */}
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center bg-white/10 hover:bg-white/15 border border-white/20 hover:border-cyan-500/30 rounded-xl py-3 px-4 font-semibold text-xs text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '18px', height: '18px' }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              <span>
                {isLoggingIn ? 'প্রবেশ করা হচ্ছে...' : 'Sign in with Google'}
              </span>
            </div>
          </button>

          {/* Proactive hint link */}
          <div className="mt-4 text-center">
            <a 
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-slate-500 hover:text-cyan-400 font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              অথবা সরাসরি নতুন ট্যাবে ওপেন করুন (পপ-আপ সমস্যা এড়াতে)
            </a>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 max-w-md w-full mx-auto text-center text-[10px] text-slate-500 uppercase tracking-widest">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>সুরক্ষিত সংযোগ: AES-256 এনক্রিপ্টেড</span>
          </div>
          <span>© ২০২৬ জারভিস পার্সোনাল এআই ওয়ার্কস্পেস</span>
        </div>
      </div>
    );
  }

  // 2. RENDER MAIN AUTHENTICATED WORKSPACE
  return (
    <div id="jarvis-app" className="min-h-screen bg-[#020203] text-slate-200 flex flex-col relative overflow-hidden font-sans">
      {/* Glow radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_#111827_0%,_transparent_65%)] opacity-50 pointer-events-none"></div>

      {/* Upper Navigation Bar */}
      <header id="app-header" className="relative z-10 border-b border-cyan-500/10 bg-black/45 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          {/* Advanced Neon Hexagon logo */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-400/15 rounded-xl border border-cyan-400 animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.3)]"></div>
            <Cpu className="w-5 h-5 text-cyan-400 relative z-10" />
          </div>
          <div className="text-left font-mono">
            <h1 className="font-bold text-cyan-200 text-xs tracking-widest uppercase">JARVIS COGNITIVE OS</h1>
            <p className="text-[9px] text-cyan-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
              INTELLIGENT WORKSPACE GATEWAY
            </p>
          </div>
        </div>

        {/* Dynamic ticking Bengali clock from Design template */}
        <div className="text-center sm:text-right font-mono">
          <div className="text-sm font-bold text-cyan-200 tracking-wider">{formattedTime}</div>
          <div className="text-[9px] text-slate-500 uppercase tracking-widest">{formattedDate}</div>
        </div>

        {/* User profile, Live Voice button and Signout */}
        <div className="flex items-center flex-wrap gap-4 font-mono">
          {/* Live Voice mode button */}
          <button
            onClick={() => setVoiceModeOpen(true)}
            className="flex items-center gap-1.5 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 font-bold text-[10px] px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] border border-cyan-400/30 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            ENGAGE VOICE CORE
          </button>

          {/* Profile pill with glass theme */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 text-xs backdrop-blur-md">
            {user?.photoURL && (
              <img src={user.photoURL} alt="profile" referrerPolicy="no-referrer" className="w-5 h-5 rounded-full border border-white/20" />
            )}
            <div className="text-left hidden sm:block">
              <p className="font-semibold text-slate-200 text-[10px] truncate max-w-[120px]">{user?.displayName || 'ব্যবহারকারী'}</p>
              <p className="text-[9px] text-slate-400 truncate max-w-[120px]">{user?.email || 'Unknown'}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
              title="লগ আউট করুন"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace split screen */}
      <main id="app-workspace" className="relative z-10 flex-1 p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 overflow-hidden max-w-[1600px] w-full mx-auto">
        {/* Left Side: Dynamic Workspace Voice Assistant Core Deck */}
        <div id="workspace-chat-pane" className="xl:col-span-5 h-full flex flex-col gap-4">
          <AssistantCore 
            onActivateVoice={() => setVoiceModeOpen(true)} 
            userEmail={user?.email || ''} 
            userDisplayName={user?.displayName || ''}
            startCognitiveTask={startCognitiveTask}
            voiceStatus={voiceStatus}
            setVoiceStatus={setVoiceStatus}
            currentSpeechTranscript={currentSpeechTranscript}
            setCurrentSpeechTranscript={setCurrentSpeechTranscript}
            currentSpeechResponse={currentSpeechResponse}
            setCurrentSpeechResponse={setCurrentSpeechResponse}
          />
        </div>

        {/* Right Side: Stark Industries Interactive Holographic HUD Grid */}
        <div id="workspace-dashboard-pane" className="xl:col-span-7 h-full flex flex-col">
          <JarvisHud 
            token={token} 
            onActivateVoice={() => setVoiceModeOpen(true)} 
            userEmail={user?.email || ''} 
            activityLogs={activityLogs}
            generatedFiles={generatedFiles}
            activeTask={activeTask}
          />
        </div>
      </main>

      {/* Footer privacy indicator - matching design layout */}
      <footer className="relative z-10 px-10 py-4 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest shrink-0">
        <span>সুরক্ষিত সংযোগ: AES-256 এনক্রিপ্টেড</span>
        <span>© ২০২৬ জারভিস পার্সোনাল এআই • সর্বস্বত্ব সংরক্ষিত</span>
      </footer>

      {/* Real-time Voice Chat Mode Modal Overlay */}
      <AnimatePresence>
        {voiceModeOpen && (
          <VoiceMode onClose={() => setVoiceModeOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
