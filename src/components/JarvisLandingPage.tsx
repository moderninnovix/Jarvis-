import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Mic, 
  Mail, 
  Calendar, 
  HardDrive, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Clock, 
  Zap,
  DollarSign,
  Heart
} from 'lucide-react';

interface JarvisLandingPageProps {
  onLaunchDashboard: () => void;
  onLaunchAdmin: () => void;
}

export default function JarvisLandingPage({ onLaunchDashboard, onLaunchAdmin }: JarvisLandingPageProps) {
  // Calculator States
  const [teamSize, setTeamSize] = useState<number>(5);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  
  const estimatedHoursSaved = teamSize * hoursPerWeek * 4; // monthly
  const estimatedCostSaved = estimatedHoursSaved * 25; // assume $25/hour average value

  return (
    <div className="min-h-screen bg-[#020204] text-slate-200 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Interactive Cyber-Mesh Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_rgba(6,182,212,0.15)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_40%,_rgba(59,130,246,0.08)_0%,_transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      {/* Hero Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between gap-12 border-b border-white/5">
        <div className="flex-1 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded-full text-xs font-semibold text-cyan-400 uppercase tracking-widest animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            STARK ENTERPRISE PROTOCOL
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            জারভিস এআই <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              আপনার এক্সিকিউটিভ অ্যাসিস্ট্যান্ট
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            গুগল ওয়ার্কস্পেসের (Workspace) সাথে সরাসরি সংযুক্ত বিশ্বের প্রথম বাংলা ভয়েস এআই অপারেটিং সিস্টেম। জিমেইল রিডিং ও খসড়া তৈরি, ক্যালেন্ডার মিটিং শিডিউলিং, ড্রাইভ ডাটাবেজ এক্সেস এবং কগনিটিভ টাস্ক অটোমেশন এখন সায়েন্স-ফিকশন মুভির লেভেলে বাস্তব।
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={onLaunchDashboard}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm rounded-2xl transition-all hover:scale-105 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer group"
            >
              ড্যাশবোর্ড চালু করুন (Launch Workspace)
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={onLaunchAdmin}
              className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-cyan-300 font-semibold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              লাইভ ট্র্যাকিং ড্যাশবোর্ড (Live Admin)
            </button>
          </div>

          <div className="flex items-center gap-6 pt-6 text-slate-500 text-xs font-mono uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              <span>AES-256 SECURED</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-500" />
              <span>1,200+ ACTIVE USERS</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive UI Showcase */}
        <div className="flex-1 w-full max-w-xl relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-3xl blur-3xl opacity-60 pointer-events-none" />
          
          <div className="bg-[#020204]/90 border border-cyan-400/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden backdrop-blur-xl">
            {/* Header window control dots */}
            <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/75" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/75" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/75" />
              </div>
              <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">JARVIS INTERACTIVE PANEL</span>
            </div>

            {/* Simulated Live Interface */}
            <div className="space-y-4">
              <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Mic className="w-4 h-4 animate-pulse" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">ভয়েস রিকগনিশন ইনপুট</p>
                  <p className="text-xs text-slate-100 font-semibold italic">"জারভিস, মাহমুদের ইমেইলগুলো পড়ো ও মিটিং কনফার্ম করো।"</p>
                </div>
              </div>

              <div className="p-3 bg-blue-950/20 border border-blue-500/10 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">JARVIS COGNITIVE RESPONSE</span>
                  <span className="text-[8px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full">Done</span>
                </div>
                <p className="text-xs text-slate-300 text-left leading-relaxed">
                  "আমি আপনার ইনবক্স চেক করেছি। মাহমুদ হাসান ৫টি ইমেইল পাঠিয়েছেন। তার মধ্যে আপনার মিটিং সংক্রান্ত ইমেইলের একটি ডেমো ড্রাফট তৈরি করা হয়েছে এবং ক্যালেন্ডারে ৫ই জুলাই বিকাল ৩টায় মিটিং সিডিউল করেছি।"
                </p>
              </div>

              {/* Progress and indicators */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 bg-[#0a0a14] border border-white/5 rounded-xl">
                  <span className="text-[8px] text-slate-500 uppercase font-mono">WORKSPACE SYNC</span>
                  <p className="text-sm font-bold text-cyan-400">100% ONLINE</p>
                </div>
                <div className="p-3 bg-[#0a0a14] border border-white/5 rounded-xl">
                  <span className="text-[8px] text-slate-500 uppercase font-mono">LATENCY RATIO</span>
                  <p className="text-sm font-bold text-teal-400">120 MS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Bento Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-b border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">ফিচার কালেকশন</span>
          <h2 className="text-3xl font-bold text-white tracking-tight">আপনার কাজ করার ধারণাকে বদলে দেবে জারভিস</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            জারভিস শুধুমাত্র একটি এআই চ্যাটবট নয়, এটি আপনার সম্পূর্ণ কাজের গতিবিধি পর্যবেক্ষণ করে স্বয়ংক্রিয়ভাবে সার্ভিসগুলো সম্পাদন করতে পারে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 rounded-2xl transition-all hover:scale-[1.02] text-left space-y-4 group">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">রিয়েল-টাইম ভয়েস কন্ট্রোল</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              বাংলা এবং ইংরেজি ভয়েস কমান্ডের মাধ্যমে সরাসরি জারভিসের সাথে কথা বলুন। এটি অত্যন্ত নির্ভুলভাবে আপনার কথার টোন ও নির্দেশাবলী বুঝতে পারে।
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 rounded-2xl transition-all hover:scale-[1.02] text-left space-y-4 group">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">সম্পূর্ণ জিমেইল কন্ট্রোল</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              আপনার জিমেইল একাউন্ট সংযুক্ত করে ইমেইলগুলো বিশ্লেষণ করান। জারভিস প্রয়োজনীয় উত্তর ড্রাফট করে দিতে এবং আপনার অনুমতিতে সেন্ড করতে সক্ষম।
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 rounded-2xl transition-all hover:scale-[1.02] text-left space-y-4 group">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">স্মার্ট ক্যালেন্ডার শিডিউলিং</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              আপনার মিটিং রিকোয়েস্ট বিশ্লেষণ করে স্বয়ংক্রিয়ভাবে ক্যালেন্ডার চেক করে এবং গুগল মিট লিংকসহ ক্যালেন্ডার ইভেন্ট তৈরি ও সিঙ্ক করে দেয়।
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 rounded-2xl transition-all hover:scale-[1.02] text-left space-y-4 group">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">গুগল ড্রাইভ ও ফাইল ম্যানেজার</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              সরাসরি ড্রাইভ ফাইল বিশ্লেষণ করান। জারভিস কোনো রিপোর্টের খসড়া ফাইল তৈরি করে সেভ করে রাখতে পারে যাতে আপনি যেকোনো সময় দেখতে পারেন।
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 rounded-2xl transition-all hover:scale-[1.02] text-left space-y-4 group">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">কগনিটিভ টাস্ক ইঞ্জিন</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              মাল্টি-স্টেপ কগনিটিভ টাস্ক যেমন "বাজার গবেষণা করে পিডিএফ রিপোর্ট বানাও" এমন নির্দেশ দিলে জারভিস নিজে নিজে ব্যাকগ্রাউন্ডে ধাপে ধাপে কাজ করে ফাইল আউটপুট দেয়।
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 rounded-2xl transition-all hover:scale-[1.02] text-left space-y-4 group">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">এডভান্সড সিকিউরিটি গার্ড</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              আপনার সমস্ত ডাটা সরাসরি লোকাল গুগল এপিআই টোকেন দ্বারা এনক্রিপ্ট হয়ে কাজ করে। আমাদের সার্ভার বা অন্য কোথাও আপনার অনুমতি ছাড়া ডাটা স্টোর হয় না।
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Savings Calculator */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-b border-white/5 bg-gradient-to-b from-transparent to-cyan-950/5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-left space-y-6">
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">ROI ক্যালকুলেটর</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">জারভিস আপনার টিমের কতটা সময় ও খরচ বাঁচাবে?</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              টিম মেম্বারের সংখ্যা ও তাদের সপ্তাহে ইমেইল-শিডিউলিং বা রুটিন কাজে ব্যয় করা গড় সময়ের হিসাব দিয়ে দেখুন জারভিস ইন্টিগ্রেশনের মাধ্যমে কতটা বড় সাশ্রয় সম্ভব।
            </p>

            <div className="space-y-6 pt-4 max-w-md">
              {/* Slider 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">টিমের মোট সদস্য সংখ্যা (Team Size):</span>
                  <span className="text-cyan-400 font-mono font-bold">{teamSize} জন</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">জনপ্রতি গড় সাশ্রয়ী ঘন্টা/সপ্তাহ (Hours Saved):</span>
                  <span className="text-cyan-400 font-mono font-bold">{hoursPerWeek} ঘন্টা</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="30" 
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Calculator Output Display Card */}
          <div className="flex-1 w-full max-w-md bg-cyan-950/10 border-2 border-cyan-500/20 rounded-3xl p-8 relative overflow-hidden text-left shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-cyan-500/10 pb-2">অনুমিত মাসিক সাশ্রয়ী পরিসংখ্যান</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    সময় সাশ্রয়ী
                  </span>
                  <p className="text-2xl font-extrabold text-white font-mono">{estimatedHoursSaved} <span className="text-xs font-normal text-slate-400">ঘন্টা</span></p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-cyan-400" />
                    মূল্য সাশ্রয়ী
                  </span>
                  <p className="text-2xl font-extrabold text-white font-mono">${estimatedCostSaved.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span></p>
                </div>
              </div>

              <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/15">
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  💡 <strong>কার্যকরী মন্তব্য:</strong> জারভিস ব্যবহারের ফলে আপনার টিম দৈনিক ছোটখাটো কন্টেন্ট ও জিমেইল ড্রাফট বা ফাইল খোঁজার ঝামেলা এড়িয়ে সরাসরি গুরুত্বপূর্ণ ব্যবসায়িক সিদ্ধান্তে ফোকাস করতে পারবে।
                </p>
              </div>

              <button 
                onClick={onLaunchDashboard}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer text-center flex items-center justify-center gap-2"
              >
                এখনই ড্যাশবোর্ড চালু করুন
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing / Integration Tiers */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-b border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">ফ্ল্যাট প্ল্যানিং</span>
          <h2 className="text-3xl font-bold text-white tracking-tight">সহজ ও নমনীয় সাবস্ক্রিপশন প্ল্যান</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            কোনো লুকানো চার্জ নেই। আপনার টিম সাইজ অনুযায়ী উপযুক্ত প্ল্যানটি বেছে নিয়ে যেকোনো সময় আপগ্রেড করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1 */}
          <div className="p-8 bg-white/[0.01] border border-white/5 rounded-2xl text-left space-y-6 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] bg-slate-500/15 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase">পেশাদার স্টার্টার</span>
              <h3 className="text-xl font-bold text-white">সিঙ্গেল লর্ড</h3>
              <p className="text-xs text-slate-400 leading-relaxed">একক পেশাজীবী ও ফ্রিল্যান্সারদের জন্য উপযুক্ত সমাধান।</p>
              
              <div className="pt-2">
                <span className="text-3xl font-bold font-mono text-white">$29</span>
                <span className="text-slate-500 text-xs font-mono"> / প্রতি মাস</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/5">
                <li className="flex items-center gap-2">✓ ১ জন ইউজার সাপোর্ট</li>
                <li className="flex items-center gap-2">✓ বাংলা ভয়েস কমান্ড অ্যাসিস্ট্যান্ট</li>
                <li className="flex items-center gap-2">✓ সম্পূর্ণ জিমেইল ইন্টিগ্রেশন</li>
                <li className="flex items-center gap-2">✓ ক্যালেন্ডার শিডিউলিং লুপ</li>
              </ul>
            </div>
            
            <button 
              onClick={onLaunchDashboard}
              className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-cyan-500/30 text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
            >
              চালু করুন
            </button>
          </div>

          {/* Plan 2 - Recommended */}
          <div className="p-8 bg-cyan-950/10 border-2 border-cyan-500/40 rounded-2xl text-left space-y-6 relative overflow-hidden flex flex-col justify-between shadow-[0_0_25px_rgba(6,182,212,0.1)]">
            <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-500 text-black font-extrabold text-[8px] uppercase tracking-wider rounded-bl-xl font-mono">RECOMMENDED</div>
            <div className="space-y-4">
              <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full font-bold uppercase">স্মার্ট টিম গ্রোথ</span>
              <h3 className="text-xl font-bold text-white">বিজনেস টাইটান</h3>
              <p className="text-xs text-slate-400 leading-relaxed">উন্নতিশীল টিম এবং ছোট স্টার্টআপ বিজনেসের জন্য সর্বোত্তম পছন্দ।</p>
              
              <div className="pt-2">
                <span className="text-3xl font-bold font-mono text-cyan-300">$89</span>
                <span className="text-slate-500 text-xs font-mono"> / প্রতি মাস</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-cyan-500/10">
                <li className="flex items-center gap-2 text-cyan-300">✓ ১০ জন ইউজার সম্পূর্ণ ট্র্যাকিং</li>
                <li className="flex items-center gap-2">✓ প্রায়োরিটি কগনিটিভ টাস্ক ইঞ্জিন</li>
                <li className="flex items-center gap-2">✓ এডভান্সড ড্রাইভ ফাইল এনালিস্ট</li>
                <li className="flex items-center gap-2">✓ লাইভ এডমিন ড্যাশবোর্ড এক্সেস</li>
              </ul>
            </div>
            
            <button 
              onClick={onLaunchDashboard}
              className="w-full mt-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition-all hover:scale-[1.01] cursor-pointer text-center"
            >
              এখনই শুরু করুন
            </button>
          </div>

          {/* Plan 3 */}
          <div className="p-8 bg-white/[0.01] border border-white/5 rounded-2xl text-left space-y-6 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-full font-bold uppercase">কাস্টম ও সিকিউর</span>
              <h3 className="text-xl font-bold text-white">স্টার্ক এন্টারপ্রাইজ</h3>
              <p className="text-xs text-slate-400 leading-relaxed">কাস্টম ট্র্যাকিং এবং স্পেশাল ডেডিকেটেড এআই মডেল ব্যবহারের জন্য।</p>
              
              <div className="pt-2">
                <span className="text-3xl font-bold font-mono text-white">$299</span>
                <span className="text-slate-500 text-xs font-mono"> / প্রতি মাস</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/5">
                <li className="flex items-center gap-2">✓ আনলিমিটেড ইউজার কানেকশন</li>
                <li className="flex items-center gap-2">✓ কাস্টম এআই ভয়েস ক্লিয়ারিং</li>
                <li className="flex items-center gap-2">✓ সম্পূর্ণ ডেডিকেটেড অ্যাডমিন ড্যাশবোর্ড</li>
                <li className="flex items-center gap-2">✓ ২৪/৭ ডাইরেক্ট ইন্টিগ্রেশন সাপোর্ট</li>
              </ul>
            </div>
            
            <button 
              onClick={onLaunchDashboard}
              className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-cyan-500/30 text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
            >
              যোগাযোগ করুন
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-600 text-xs font-mono border-t border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 bg-cyan-500/10 rounded border border-cyan-500/20 flex items-center justify-center">
            <Cpu className="w-3 h-3 text-cyan-400" />
          </div>
          <span>JARVIS AI OS COGNITIVE ENVIRONMENT</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase">
          <span>MADE FOR MODERN ENTERPRENEURS WITH</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
        </div>
      </footer>
    </div>
  );
}
