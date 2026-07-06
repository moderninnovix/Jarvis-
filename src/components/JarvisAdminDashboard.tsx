import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  Heart, 
  Settings, 
  Cpu, 
  Sliders, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  Terminal, 
  Smile, 
  Sparkles,
  Database,
  Lock,
  MessageSquareOff
} from 'lucide-react';

interface TrackingUser {
  id: string;
  name: string;
  email: string;
  location: string;
  activeTask: string;
  latency: number;
  rating: number; // 1-5 UX Experience Rating
  status: 'online' | 'idle' | 'offline';
  timestamp: string;
}

export default function JarvisAdminDashboard() {
  // Stats
  const [totalSessions, setTotalSessions] = useState(1428);
  const [avgSatisfaction, setAvgSatisfaction] = useState(4.82);
  const [totalRequests, setTotalRequests] = useState(12405);
  const [systemLoad, setSystemLoad] = useState(42); // percentage
  
  // Controls
  const [cognitiveSpeed, setCognitiveSpeed] = useState<number>(3); // 1: eco, 2: balanced, 3: fast, 4: deepthought
  const [syncRate, setSyncRate] = useState<string>('15s');
  const [securityLevel, setSecurityLevel] = useState<boolean>(true);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Live Activity Logs (scrolling terminal style)
  const [adminLogs, setAdminLogs] = useState<{ id: string; time: string; msg: string; type: 'info' | 'warn' | 'success' }[]>([
    { id: '1', time: '13:40:01', msg: 'System Monitor: Auth Engine v2.4 handshake completed.', type: 'success' },
    { id: '2', time: '13:40:15', msg: 'Core Controller: Vercel node "jarvis-nu-pink.vercel.app" connected.', type: 'info' },
    { id: '3', time: '13:40:32', msg: 'User session started for user: moderninnovix@gmail.com', type: 'info' },
    { id: '4', time: '13:40:55', msg: 'Cognitive Engine: Task "Gmail Draft Generation" completed with 98.4% success score.', type: 'success' },
  ]);

  // Live Users Database
  const [users, setUsers] = useState<TrackingUser[]>([
    { id: 'usr-1', name: 'মাহমুদ হাসান (Admin)', email: 'moderninnovix@gmail.com', location: 'jarvis-nu-pink.vercel.app', activeTask: 'জিমেইল ইনবক্স সিঙ্ক', latency: 124, rating: 5, status: 'online', timestamp: '1:36 AM' },
    { id: 'usr-2', name: 'আরিফ আহমেদ', email: 'arif.innovix@outlook.com', location: 'ais-dev-preview-node', activeTask: 'ক্যালেন্ডার মিটিং শিডিউলিং', latency: 180, rating: 4.8, status: 'online', timestamp: '1:34 AM' },
    { id: 'usr-3', name: 'নুসরাত জাহান', email: 'nusrat.jahan@stark.com', location: 'Localhost:3000', activeTask: 'ভয়েস কমান্ড ডিক্টেশন', latency: 95, rating: 5, status: 'online', timestamp: '1:30 AM' },
    { id: 'usr-4', name: 'তানভীর রহমান', email: 'tanvir@techbangla.io', location: 'jarvis-nu-pink.vercel.app', activeTask: 'ড্রাইভ কগনিটিভ রাইটার', latency: 210, rating: 4.5, status: 'idle', timestamp: '1:24 AM' },
    { id: 'usr-5', name: 'ফারজানা ববি', email: 'bobby.farzana@gmail.com', location: 'Vercel Deployment Node', activeTask: 'সিস্টেম স্ট্যাটাস কোয়েরি', latency: 145, rating: 4.7, status: 'idle', timestamp: '1:12 AM' },
  ]);

  // Simulate real-time interaction updates
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Simulate new incoming user requests
      const randomUserIndex = Math.floor(Math.random() * users.length);
      const updatedUsers = [...users];
      
      const tasks = [
        'ভয়েস চ্যাট এনগেজমেন্ট',
        'ইমেইল ড্রাফটিং সেশন',
        'ক্যালেন্ডার ডাটা ফেচিং',
        'ফাইল রিডিং ও কগনিশন',
        'এআই লজিক গ্রাউন্ডিং',
        'গুগল মিট লিংক জেনারেশন',
        'সিস্টেম স্ট্যাটাস ও হিউরিস্টিকস'
      ];
      
      const selectedTask = tasks[Math.floor(Math.random() * tasks.length)];
      const randomLatency = Math.floor(Math.random() * 150) + 70; // 70-220ms
      const randomRatingScore = parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)); // 3.5 - 5.0

      updatedUsers[randomUserIndex] = {
        ...updatedUsers[randomUserIndex],
        activeTask: selectedTask,
        latency: randomLatency,
        rating: randomRatingScore,
        status: Math.random() > 0.15 ? 'online' : 'idle',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      };

      setUsers(updatedUsers);

      // 2. Increment stats slightly
      setTotalRequests(prev => prev + 1);
      if (Math.random() > 0.7) {
        setTotalSessions(prev => prev + 1);
      }
      setSystemLoad(Math.floor(Math.random() * 25) + 30); // 30-55%

      // 3. Append to admin terminal logs
      const logMessages = [
        `Sync: Fetching Gmail nodes for ${updatedUsers[randomUserIndex].email}`,
        `Hologram: File rendered for user session ${updatedUsers[randomUserIndex].id}`,
        `API Hook: Successful OAuth 2.0 query on node "${updatedUsers[randomUserIndex].location}"`,
        `Cognition: Triggered Gemini reasoning cycle for "${selectedTask}"`,
        `Security: Verified state key integrity on sub-channel ${Math.floor(Math.random() * 100)}`
      ];
      
      const newLog = {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString(),
        msg: logMessages[Math.floor(Math.random() * logMessages.length)],
        type: Math.random() > 0.85 ? 'warn' : 'info' as 'info' | 'warn' | 'success'
      };

      setAdminLogs(prev => [newLog, ...prev.slice(0, 25)]);

    }, 4000);

    return () => clearInterval(interval);
  }, [users]);

  // Handle Manual Experience Simulation (Test UI)
  const [simName, setSimName] = useState('');
  const [simEmail, setSimEmail] = useState('');
  const [simRating, setSimRating] = useState(5);
  const [simTask, setSimTask] = useState('জিমেইল ইমেইল রাইটার');

  const handleSimulateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName || !simEmail) return;

    const newUser: TrackingUser = {
      id: 'sim-' + Math.random().toString(36).substr(2, 5),
      name: simName,
      email: simEmail,
      location: 'jarvis-nu-pink.vercel.app',
      activeTask: simTask,
      latency: Math.floor(Math.random() * 120) + 80,
      rating: Number(simRating),
      status: 'online',
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true })
    };

    setUsers(prev => [newUser, ...prev]);
    setTotalSessions(prev => prev + 1);
    setTotalRequests(prev => prev + 15);
    
    // Recalculate average satisfaction
    setAvgSatisfaction(prev => {
      const newTotal = prev * 1000 + Number(simRating);
      return parseFloat((newTotal / 1001).toFixed(2));
    });

    const successLog = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString(),
      msg: `Simulation Triggered: Connected new session for "${simName}" (${simEmail})`,
      type: 'success' as 'success'
    };
    setAdminLogs(prev => [successLog, ...prev]);

    // Reset fields
    setSimName('');
    setSimEmail('');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.activeTask.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#020204]/95 border border-cyan-500/20 rounded-2xl overflow-hidden backdrop-blur-2xl relative shadow-[0_0_35px_rgba(6,182,212,0.15)] font-mono text-cyan-400">
      
      {/* Upper header section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-cyan-500/15 pb-4 mb-6">
        <div>
          <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1 w-fit mb-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            LIVE CONTROLLER & ANALYTICS
          </span>
          <h2 className="text-lg font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            জারভিস এডমিন ও ইউজার ট্র্যাকিং সিস্টেম
          </h2>
          <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">Control panel to monitor user metrics and optimize assistant behavior</p>
        </div>

        {/* Action controls */}
        <div className="flex gap-2.5">
          <button 
            onClick={() => {
              setTotalRequests(prev => prev + Math.floor(Math.random() * 50));
              setSystemLoad(42);
              const refreshLog = {
                id: Math.random().toString(),
                time: new Date().toLocaleTimeString(),
                msg: 'Manual Sync: Flushed cache, optimized user metrics ledger.',
                type: 'success' as 'success'
              };
              setAdminLogs(prev => [refreshLog, ...prev]);
            }}
            className="px-3 py-1.5 border border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/20 text-cyan-300 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer hover:bg-cyan-900/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            ফ্লাশ ক্যাশ (Clear Cache)
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        
        {/* Metric 1 */}
        <div className="p-4 bg-black/40 border border-cyan-500/10 rounded-xl flex items-center justify-between">
          <div className="text-left">
            <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider block">মোট একটিভ সেশনস</span>
            <span className="text-xl font-bold font-mono text-slate-200">{totalSessions}</span>
          </div>
          <Users className="w-8 h-8 text-cyan-500/20" />
        </div>

        {/* Metric 2 */}
        <div className="p-4 bg-black/40 border border-cyan-500/10 rounded-xl flex items-center justify-between">
          <div className="text-left">
            <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider block">স্যাটিসফ্যাকশন স্কোর</span>
            <span className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-1">
              {avgSatisfaction}
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
            </span>
          </div>
          <Smile className="w-8 h-8 text-emerald-500/20" />
        </div>

        {/* Metric 3 */}
        <div className="p-4 bg-black/40 border border-cyan-500/10 rounded-xl flex items-center justify-between">
          <div className="text-left">
            <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider block">মোট এপিআই রিকোয়েস্ট</span>
            <span className="text-xl font-bold font-mono text-slate-200">{totalRequests.toLocaleString()}</span>
          </div>
          <Activity className="w-8 h-8 text-blue-500/20" />
        </div>

        {/* Metric 4 */}
        <div className="p-4 bg-black/40 border border-cyan-500/10 rounded-xl flex items-center justify-between">
          <div className="text-left">
            <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider block">লাইভ সিস্টেম লোড</span>
            <span className="text-xl font-bold font-mono text-amber-400">{systemLoad}%</span>
          </div>
          <Cpu className="w-8 h-8 text-amber-500/20" />
        </div>
      </div>

      {/* Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Hand: Active User Table & Tracking List */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-black/40 border border-cyan-500/10 rounded-xl p-4 flex flex-col gap-4">
            
            {/* Header of user list */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-b border-cyan-500/15 pb-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-cyan-400" />
                লাইভ ট্র্যাকিং ডাটাবেজ (User Interaction Log)
              </span>

              {/* Search Bar */}
              <div className="relative">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ইউজার, ইমেল বা কাজ সার্চ করুন..."
                  className="bg-black/60 border border-cyan-500/20 rounded-lg py-1 px-3 pl-8 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 w-full sm:w-60 font-sans"
                />
                <Search className="w-3.5 h-3.5 text-cyan-500/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Datatable */}
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-cyan-500/15 text-slate-500 uppercase tracking-widest font-bold">
                    <th className="pb-2.5 pl-2">ইউজার প্রোফাইল</th>
                    <th className="pb-2.5">অ্যাক্টিভ ডোমেইন</th>
                    <th className="pb-2.5">চলমান কাজ (Active Task)</th>
                    <th className="pb-2.5 text-center">লেটেন্সি (Latency)</th>
                    <th className="pb-2.5 text-center">রেটিং (UX)</th>
                    <th className="pb-2.5 text-center">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/5">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-cyan-950/10 transition-colors">
                        <td className="py-3 pl-2 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold text-cyan-300 uppercase">
                            {user.name.substr(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-200">{user.name}</p>
                            <p className="text-[9px] text-slate-500 font-sans">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 text-slate-400 font-sans">{user.location}</td>
                        <td className="py-3">
                          <p className="text-cyan-300 font-semibold">{user.activeTask}</p>
                          <span className="text-[8px] text-slate-600 font-mono">আপডেট: {user.timestamp}</span>
                        </td>
                        <td className="py-3 text-center text-slate-300 font-sans">{user.latency} ms</td>
                        <td className="py-3 text-center font-bold">
                          <span className={`px-1.5 py-0.5 rounded ${user.rating >= 4.5 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {user.rating} ★
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="inline-flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'online' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'} shadow-[0_0_8px_currentColor]`} />
                            <span className="text-[8px] uppercase text-slate-500">{user.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        <MessageSquareOff className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                        কোনো মেলানো ডাটা রেকর্ড পাওয়া যায়নি
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Experience Rating Chart (High-Fidelity Custom SVG) */}
          <div className="bg-black/40 border border-cyan-500/10 rounded-xl p-4 space-y-4">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-emerald-400" />
              ইউজার এক্সপেরিয়েন্স রেটিং বিশ্লেষণ (Hourly Trend)
            </span>

            {/* Custom Interactive SVG Graph Area */}
            <div className="p-4 bg-cyan-950/5 border border-cyan-500/5 rounded-xl">
              <div className="flex justify-between text-[9px] text-slate-500 mb-2 font-mono">
                <span>RATING OUT OF 5.0 (HIGHER IS BETTER)</span>
                <span className="text-emerald-400">TARGET INDEX: 4.80</span>
              </div>
              
              <div className="relative h-32 w-full flex items-end justify-between px-2 pt-2 border-b border-l border-cyan-500/20">
                {/* Simulated Grid Lines */}
                <div className="absolute left-0 right-0 top-1/4 border-t border-cyan-500/5 pointer-events-none" />
                <div className="absolute left-0 right-0 top-2/4 border-t border-cyan-500/5 pointer-events-none" />
                <div className="absolute left-0 right-0 top-3/4 border-t border-cyan-500/5 pointer-events-none" />
                
                {/* SVG Polyline Area Chart for dynamic rating points */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  {/* Area fill */}
                  <polygon 
                    points="0,128 50,85 150,95 250,50 350,75 450,40 550,45 650,20 650,128" 
                    className="fill-cyan-500/10 stroke-none"
                    style={{ vectorEffect: 'non-scaling-stroke' }}
                  />
                  {/* Chart line */}
                  <polyline 
                    points="0,128 50,85 150,95 250,50 350,75 450,40 550,45 650,20" 
                    className="fill-none stroke-cyan-400 stroke-2"
                    style={{ vectorEffect: 'non-scaling-stroke' }}
                  />
                </svg>

                {/* Vertical columns as interaction points with Tooltips */}
                {[
                  { label: '১২:০০ AM', val: '4.2' },
                  { label: '০৩:০০ AM', val: '4.5' },
                  { label: '০৬:০০ AM', val: '4.7' },
                  { label: '০৯:০০ AM', val: '4.8' },
                  { label: '১২:০০ PM', val: '4.9' },
                  { label: '০৩: PM', val: '4.8' },
                  { label: '০৬: PM', val: '4.9' },
                  { label: 'লাইভ', val: avgSatisfaction }
                ].map((pt, index) => (
                  <div key={index} className="flex flex-col items-center gap-1 z-10 group cursor-help">
                    <span className="text-[8px] text-cyan-300 font-bold bg-[#020204] border border-cyan-500/30 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-8">
                      {pt.val} ★
                    </span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:bg-amber-400 border border-black shadow-[0_0_8px_#22d3ee] transition-colors" />
                    <span className="text-[8px] text-slate-500 mt-2">{pt.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Hand: Central System Controller & Simulation Console */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Section 1: Jarvis System Tuning Console */}
          <div className="bg-black/40 border border-cyan-500/10 rounded-xl p-4 space-y-4 text-left">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/15 pb-2">
              <Settings className="w-4 h-4 text-cyan-400" />
              জারভিস কোরের সিস্টেম টিউনিং (Central Config)
            </span>

            <div className="space-y-4">
              {/* Speed Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-slate-400">কগনিটিভ ফ্লো রেট:</span>
                  <span className="text-cyan-300 font-mono">
                    {cognitiveSpeed === 1 && 'Eco Core (ধীর)'}
                    {cognitiveSpeed === 2 && 'Balanced (সাধারণ)'}
                    {cognitiveSpeed === 3 && 'Ultra Cognitive (দ্রুত)'}
                    {cognitiveSpeed === 4 && 'Deepthought Mode'}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="4" 
                  value={cognitiveSpeed}
                  onChange={(e) => {
                    const speedVal = parseInt(e.target.value);
                    setCognitiveSpeed(speedVal);
                    const speedText = ['Eco Core', 'Balanced', 'Ultra Cognitive', 'Deepthought'];
                    const controlLog = {
                      id: Math.random().toString(),
                      time: new Date().toLocaleTimeString(),
                      msg: `Tuning: Adjusted cognitive cycle frequency to "${speedText[speedVal - 1]}"`,
                      type: 'warn' as 'warn'
                    };
                    setAdminLogs(prev => [controlLog, ...prev]);
                  }}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sync Interval Selector */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">গুগল ওয়ার্কস্পেস সিঙ্ক রেট:</span>
                <select 
                  value={syncRate}
                  onChange={(e) => {
                    setSyncRate(e.target.value);
                    const controlLog = {
                      id: Math.random().toString(),
                      time: new Date().toLocaleTimeString(),
                      msg: `Tuning: Google Workspace Sync rate interval modified to ${e.target.value}`,
                      type: 'info' as 'info'
                    };
                    setAdminLogs(prev => [controlLog, ...prev]);
                  }}
                  className="w-full bg-[#020204] border border-cyan-500/20 rounded-lg py-1 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-sans"
                >
                  <option value="5s">রিয়েল-টাইম (৫ সেকেন্ড পর পর)</option>
                  <option value="15s">ব্যালেন্সড (১৫ সেকেন্ড পর পর)</option>
                  <option value="30s">সাধারণ (৩০ সেকেন্ড পর পর)</option>
                  <option value="60s">স্ট্যাটিক লোড (১ মিনিট পর পর)</option>
                </select>
              </div>

              {/* Security Level Switcher */}
              <div className="flex items-center justify-between py-2 border-t border-b border-cyan-500/10">
                <div>
                  <span className="text-[10px] font-bold text-slate-300 block">AES-256 শক্তিশালী গেটওয়ে</span>
                  <span className="text-[8px] text-slate-500">পাসওয়ার্ড ও সেশন এনক্রিপশন লক</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSecurityLevel(!securityLevel);
                    const controlLog = {
                      id: Math.random().toString(),
                      time: new Date().toLocaleTimeString(),
                      msg: `Security: AES-256 Gateways shifted to ${!securityLevel ? 'ENFORCED' : 'BYPASS-WARN'}.`,
                      type: !securityLevel ? 'success' : 'warn' as any
                    };
                    setAdminLogs(prev => [controlLog, ...prev]);
                  }}
                  className={`w-10 h-5 rounded-full relative transition-all cursor-pointer ${securityLevel ? 'bg-cyan-500' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all ${securityLevel ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Maintenance Toggle */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-300 block">সিস্টেম রক্ষণাবেক্ষণ মোড (Maintenance)</span>
                  <span className="text-[8px] text-slate-500">অনলাইনে নতুন ইউজার ব্লক করতে</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMaintenanceMode(!maintenanceMode);
                    const controlLog = {
                      id: Math.random().toString(),
                      time: new Date().toLocaleTimeString(),
                      msg: `System: Live maintenance flags shifted to ${!maintenanceMode ? 'ACTIVE (BLOCKING)' : 'INACTIVE (ONLINE)'}.`,
                      type: 'warn' as 'warn'
                    };
                    setAdminLogs(prev => [controlLog, ...prev]);
                  }}
                  className={`w-10 h-5 rounded-full relative transition-all cursor-pointer ${maintenanceMode ? 'bg-red-500' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all ${maintenanceMode ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Simulator Sandbox Tool */}
          <div className="bg-black/40 border border-cyan-500/10 rounded-xl p-4 space-y-4 text-left">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/15 pb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              অভিজ্ঞতা সিমুলেটর (UX Transaction Simulator)
            </span>

            <form onSubmit={handleSimulateUser} className="space-y-3 font-sans text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 uppercase">ইউজারের নাম (Bangla)</label>
                  <input 
                    type="text" 
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    placeholder="যেমন: সায়েম খান"
                    className="w-full bg-[#020204] border border-cyan-500/20 rounded-lg py-1.5 px-2 text-slate-300 focus:outline-none focus:border-cyan-400 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 uppercase">ইউজার ইমেল</label>
                  <input 
                    type="email" 
                    value={simEmail}
                    onChange={(e) => setSimEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full bg-[#020204] border border-cyan-500/20 rounded-lg py-1.5 px-2 text-slate-300 focus:outline-none focus:border-cyan-400 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 uppercase">চলমান কাজ</label>
                  <select 
                    value={simTask}
                    onChange={(e) => setSimTask(e.target.value)}
                    className="w-full bg-[#020204] border border-cyan-500/20 rounded-lg py-1.5 px-2 text-slate-300 focus:outline-none focus:border-cyan-400 text-xs"
                  >
                    <option value="জিমেইল ইমেইল রাইটার">জিমেইল ইমেইল রাইটার</option>
                    <option value="মিটিং শিডিউল সেশন">মিটিং শিডিউল সেশন</option>
                    <option value="ভয়েস ডিক্টেশন লুপ">ভয়েস ডিক্টেশন লুপ</option>
                    <option value="ড্রাইভ ফাইল ব্রাউজার">ড্রাইভ ফাইল ব্রাউজার</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 uppercase">অভিজ্ঞতা রেটিং (★)</label>
                  <select 
                    value={simRating}
                    onChange={(e) => setSimRating(Number(e.target.value))}
                    className="w-full bg-[#020204] border border-cyan-500/20 rounded-lg py-1.5 px-2 text-slate-300 focus:outline-none focus:border-cyan-400 text-xs font-mono"
                  >
                    <option value="5">5.0 - চমৎকার</option>
                    <option value="4.5">4.5 - খুব ভালো</option>
                    <option value="4">4.0 - সাধারণ</option>
                    <option value="3">3.0 - ধীর গতি</option>
                    <option value="1">1.0 - ব্যর্থতা</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer mt-1"
              >
                সিমুলেট করুন (Simulate Activity)
              </button>
            </form>
          </div>

          {/* Section 3: Live System Operations scrolling logs */}
          <div className="bg-black/40 border border-cyan-500/10 rounded-xl p-4 space-y-3 text-left">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/15 pb-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              অপারেশন্স লাইভ স্ট্রিম (Console Output)
            </span>

            <div className="space-y-1 max-h-32 overflow-y-auto pr-1 text-[8px] font-mono leading-relaxed">
              {adminLogs.map((log) => (
                <div key={log.id} className="flex gap-1.5 border-b border-cyan-500/5 pb-1">
                  <span className="text-cyan-500 shrink-0">[{log.time}]</span>
                  <span className={
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'warn' ? 'text-amber-400 animate-pulse' : 'text-slate-300'
                  }>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
