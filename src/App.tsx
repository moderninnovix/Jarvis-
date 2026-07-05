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
      <header id="app-header" className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-cyan-600 to-blue-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(34,211,238,0.2)] border border-white/10">
            J
          </div>
          <div className="text-left">
            <h1 className="font-semibold text-white text-sm tracking-tight">Jarvis Workspace</h1>
            <p className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
              অনলাইন ইকোসিস্টেম
            </p>
          </div>
        </div>

        {/* Dynamic ticking Bengali clock from Design template */}
        <div className="text-center sm:text-right">
          <div className="text-base font-light text-white tracking-tight">{formattedTime}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">{formattedDate}</div>
        </div>

        {/* User profile, Live Voice button and Signout */}
        <div className="flex items-center flex-wrap gap-4">
          {/* Live Voice mode button */}
          <button
            onClick={() => setVoiceModeOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] border border-red-500/30"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            লাইভ ভয়েস চ্যাট
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
          />
        </div>

        {/* Right Side: Stark Industries Interactive Holographic HUD Grid */}
        <div id="workspace-dashboard-pane" className="xl:col-span-7 h-full flex flex-col">
          <JarvisHud 
            token={token} 
            onActivateVoice={() => setVoiceModeOpen(true)} 
            userEmail={user?.email || ''} 
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
