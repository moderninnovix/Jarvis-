import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Shield, 
  Radio, 
  Volume2, 
  Calendar as CalendarIcon, 
  HardDrive, 
  Mail, 
  MapPin, 
  Wind, 
  Thermometer, 
  Database, 
  RefreshCw, 
  Zap, 
  Moon, 
  Sun, 
  ArrowUpRight, 
  Sparkles,
  VolumeX,
  Languages,
  Code,
  Flame,
  Activity,
  Compass,
  Lock,
  Search,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkspaceEmail, WorkspaceEvent, WorkspaceFile } from '../types';
import { listEmails, listEvents, listFiles } from '../lib/googleApi';

interface JarvisHudProps {
  token: string | null;
  onActivateVoice: () => void;
  userEmail: string;
  activityLogs?: any[];
  generatedFiles?: any[];
  activeTask?: {
    title: string;
    progress: number;
    stepText: string;
    searchSources: string[];
  } | null;
}

export default function JarvisHud({ 
  token, 
  onActivateVoice, 
  userEmail,
  activityLogs = [],
  generatedFiles = [],
  activeTask = null
}: JarvisHudProps) {
  // Live simulated system stats
  const [cpu1, setCpu1] = useState(45);
  const [cpu2, setCpu2] = useState(38);
  const [ram, setRam] = useState(62);
  const [temperature, setTemperature] = useState(39.4);
  const [powerOutput, setPowerOutput] = useState(3.14);
  const [netUp, setNetUp] = useState(184);
  const [netDown, setNetDown] = useState(3.12);
  
  // Selected compiled file to display in holographic modal
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  
  // Real or simulated Google Workspace data
  const [emails, setEmails] = useState<WorkspaceEmail[]>([]);
  const [events, setEvents] = useState<WorkspaceEvent[]>([]);
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCING' | 'SECURE'>('SECURE');

  // Load active custom directives from Assistant Settings
  const [customDirectives, setCustomDirectives] = useState<string[]>([]);
  const [assistantName, setAssistantName] = useState('Jarvis');

  useEffect(() => {
    // Load configurations periodically to stay in sync
    const loadSettings = () => {
      setAssistantName(localStorage.getItem('jarvis_custom_name') || 'Jarvis');
      const savedDirectives = localStorage.getItem('jarvis_evolved_directives');
      if (savedDirectives) {
        setCustomDirectives(JSON.parse(savedDirectives));
      } else {
        setCustomDirectives([
          'মডুলার আর্কিটেকচার অপ্টিমাইজেশন সক্রিয়',
          'মাল্টিলিঙ্গুয়াল স্পিচ ইন্টারফেস সক্রিয়',
          'গুগল ওয়ার্কস্পেস লাইভ কানেকশন সিঙ্কড'
        ]);
      }
    };

    loadSettings();
    const interval = setInterval(loadSettings, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fluctuating metric updates for immersive tech aesthetic
  useEffect(() => {
    const timer = setInterval(() => {
      setCpu1(prev => Math.min(100, Math.max(10, Math.round(prev + (Math.random() * 10 - 5)))));
      setCpu2(prev => Math.min(100, Math.max(10, Math.round(prev + (Math.random() * 8 - 4)))));
      setRam(prev => Math.min(100, Math.max(20, Math.round(prev + (Math.random() * 2 - 1)))));
      setTemperature(prev => parseFloat((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
      setPowerOutput(prev => parseFloat((prev + (Math.random() * 0.06 - 0.03)).toFixed(2)));
      setNetUp(prev => Math.min(999, Math.max(50, Math.round(prev + (Math.random() * 30 - 15)))));
      setNetDown(prev => parseFloat((prev + (Math.random() * 0.4 - 0.2)).toFixed(2)));
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // Fetch real workspace entries if Google Token exists
  const fetchWorkspaceData = async () => {
    if (!token) return;
    setLoading(true);
    setSyncStatus('SYNCING');
    try {
      const [emailList, eventList, fileList] = await Promise.all([
        listEmails(token, 5).catch(e => { console.warn(e); return []; }),
        listEvents(token, 5).catch(e => { console.warn(e); return []; }),
        listFiles(token, 5).catch(e => { console.warn(e); return []; })
      ]);
      setEmails(emailList);
      setEvents(eventList);
      setFiles(fileList);
      setSyncStatus('SECURE');
    } catch (err) {
      console.error('Failed to sync Workspace items with Stark HUD:', err);
      setSyncStatus('IDLE');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWorkspaceData();
    }
  }, [token]);

  // High-tech fallback logs for simulated offline HUD visualization (Stark Industries style)
  const simulatedEmails = [
    { id: '1', subject: 'Strategic Partnership Proposal', from: 'Pepper Potts <pepper@stark.com>', snippet: 'Reviewing the clean energy initiative contracts.' },
    { id: '2', subject: 'Arc Reactor Thermal Output Report', from: 'Friday OS <friday@stark.com>', snippet: 'Thermal margins remain within optimal parameters.' },
    { id: '3', subject: 'Workspace Connection Verification', from: 'Google Cloud Platform <gcp@stark.com>', snippet: 'All API routes verified and fully encrypted.' }
  ];

  const simulatedEvents = [
    { id: '1', summary: 'Global Tech Board Sync', start: new Date(Date.now() + 3600000).toISOString(), description: 'Stark Tower Boardroom' },
    { id: '2', summary: 'Neural Core Adaptation Review', start: new Date(Date.now() + 7200000).toISOString(), description: 'Online API Sync' }
  ];

  const simulatedFiles = [
    { id: '1', name: 'jarvis_neural_weights.bin', size: '14.2 MB', modifiedTime: new Date().toISOString() },
    { id: '2', name: 'stark_armor_schematic.dxf', size: '108.4 MB', modifiedTime: new Date().toISOString() },
    { id: '3', name: 'clean_energy_specs.pdf', size: '4.8 MB', modifiedTime: new Date().toISOString() }
  ];

  const displayEmails = token && emails.length > 0 ? emails : simulatedEmails;
  const displayEvents = token && events.length > 0 ? events : simulatedEvents;
  const displayFiles = [
    ...generatedFiles,
    ...(token && files.length > 0 ? files : simulatedFiles)
  ];

  return (
    <div className="w-full flex flex-col bg-[#020204]/95 border border-cyan-500/20 rounded-2xl overflow-hidden backdrop-blur-2xl relative shadow-[0_0_35px_rgba(6,182,212,0.15)] font-mono text-cyan-400">
      
      {/* Visual background scanning lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%] pointer-events-none opacity-30 z-0"></div>

      {/* Cyber Stark HUD Header */}
      <div className="p-4 bg-cyan-950/20 border-b border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping absolute"></div>
            <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-slate-300">STARK INDUSTRIES INTELLIGENCE GRID</div>
            <div className="text-[9px] text-cyan-500 font-semibold tracking-wider flex items-center gap-1.5">
              <span>{assistantName.toUpperCase()} OPERATIONAL OS VER 1.2.5</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>GRID STATUS: {syncStatus}</span>
            </div>
          </div>
        </div>

        {/* Global Coordinates & Real-Time Sync Controls */}
        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-400 bg-cyan-500/5 px-2.5 py-1 rounded-md border border-cyan-500/10">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>LOC: 23.8103° N, 90.4125° E (DHAKA)</span>
          </div>

          <button 
            onClick={token ? fetchWorkspaceData : undefined}
            disabled={loading || !token}
            className="p-1.5 bg-cyan-500/5 hover:bg-cyan-500/15 border border-cyan-500/20 rounded-md text-cyan-400 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="সিঙ্ক ডাটা"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid Content - Surrounding Arc Reactor and charts */}
      <div className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 overflow-y-auto max-h-[750px] z-10">
        
        {/* ================= LEFT SIDEBAR (COLUMN 1) ================= */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          
          {/* Diagnostic Metrics Terminal */}
          <div className="p-4 bg-black/40 border border-cyan-500/10 rounded-xl flex flex-col gap-3 relative overflow-hidden group hover:border-cyan-500/20 transition-colors">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rotate-45 translate-x-10 -translate-y-10 group-hover:bg-cyan-500/10 transition-colors pointer-events-none"></div>
            
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                SYSTEM DIAGNOSTICS
              </span>
              <span className="text-[9px] text-cyan-500 font-bold">CORE_MAPPED: 100%</span>
            </div>

            {/* Simulated fluctuating metrics */}
            <div className="space-y-3.5 pt-1">
              {/* CPU Core 1 */}
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span>CPU CORE #1 (PRIMARY)</span>
                  <span className="font-bold text-cyan-300">{cpu1}%</span>
                </div>
                <div className="w-full bg-cyan-950/50 h-1.5 rounded-full overflow-hidden border border-cyan-500/10">
                  <motion.div 
                    animate={{ width: `${cpu1}%` }} 
                    transition={{ duration: 0.8 }} 
                    className="bg-cyan-400 h-full rounded-full shadow-[0_0_8px_#22d3ee]"
                  />
                </div>
              </div>

              {/* CPU Core 2 */}
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span>CPU CORE #2 (SYNAPTIC)</span>
                  <span className="font-bold text-cyan-300">{cpu2}%</span>
                </div>
                <div className="w-full bg-cyan-950/50 h-1.5 rounded-full overflow-hidden border border-cyan-500/10">
                  <motion.div 
                    animate={{ width: `${cpu2}%` }} 
                    transition={{ duration: 0.8 }} 
                    className="bg-cyan-500 h-full rounded-full"
                  />
                </div>
              </div>

              {/* Ram allocation */}
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span>MEMORY LOAD (BUFFER)</span>
                  <span className="font-bold text-cyan-300">{ram}%</span>
                </div>
                <div className="w-full bg-cyan-950/50 h-1.5 rounded-full overflow-hidden border border-cyan-500/10">
                  <motion.div 
                    animate={{ width: `${ram}%` }} 
                    transition={{ duration: 0.8 }} 
                    className="bg-cyan-600 h-full rounded-full"
                  />
                </div>
              </div>

              {/* Grid with auxiliary indicators */}
              <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-cyan-500/10 text-[9px] text-slate-400">
                <div className="p-2 bg-cyan-500/5 rounded border border-cyan-500/10">
                  <span className="block text-slate-500 text-[8px]">CORE THERMAL</span>
                  <span className="font-bold text-cyan-300 text-xs flex items-center gap-1 mt-0.5">
                    <Thermometer className="w-3 h-3 text-cyan-400" />
                    {temperature}°C
                  </span>
                </div>
                <div className="p-2 bg-cyan-500/5 rounded border border-cyan-500/10">
                  <span className="block text-slate-500 text-[8px]">POWER MATRIX</span>
                  <span className="font-bold text-cyan-300 text-xs flex items-center gap-1 mt-0.5">
                    <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
                    {powerOutput} GW
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Cognitive Task Tracker */}
          {activeTask && (
            <div className="p-4 bg-cyan-950/20 border-2 border-amber-500/40 rounded-xl flex flex-col gap-3 relative overflow-hidden animate-pulse">
              <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                  JARVIS COGNITIVE ENGINE
                </span>
                <span className="text-[9px] text-amber-400 font-bold">{activeTask.progress}% COMPLETE</span>
              </div>
              <div className="text-[11px] font-bold text-slate-200">{activeTask.title}</div>
              <div className="text-[9px] text-cyan-300 font-mono">{activeTask.stepText}</div>
              <div className="w-full bg-cyan-950/50 h-2 rounded-full overflow-hidden border border-cyan-500/25">
                <div 
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeTask.progress}%` }}
                />
              </div>
              <div className="text-[8px] text-slate-500 flex justify-between">
                <span>SOURCES: {activeTask.searchSources.join(', ')}</span>
                <span className="text-amber-400 animate-ping">● ACTIVE</span>
              </div>
            </div>
          )}

          {/* Secure Database Chunk Files (Google Drive) */}
          <div className="p-4 bg-black/40 border border-cyan-500/10 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                SECURE DRIVE TRANSMISSIONS
              </span>
              <span className="text-[8px] px-2 py-0.5 bg-cyan-500/10 rounded-full font-bold">FILES INDEXED</span>
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {displayFiles.map((file: any, i) => (
                <div 
                  key={file.id || i}
                  onClick={() => file.content && setSelectedFile(file)}
                  className={`p-2 bg-cyan-950/20 border border-cyan-500/5 ${file.content ? 'hover:border-amber-400/50 cursor-pointer border-dashed' : 'hover:border-cyan-500/20'} rounded flex items-center justify-between gap-2 text-[9px] transition-all group`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <HardDrive className={`w-3.5 h-3.5 ${file.content ? 'text-amber-400 animate-pulse' : 'text-cyan-400'} group-hover:scale-110 transition-transform`} />
                    <span className={`text-slate-300 font-medium truncate ${file.content ? 'group-hover:text-amber-300 font-bold' : 'group-hover:text-cyan-300'} transition-colors`}>
                      {file.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {file.content && (
                      <span className="text-[7px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 rounded font-bold uppercase">COMPILED</span>
                    )}
                    <span className="text-[8px] text-slate-500 shrink-0 font-bold uppercase">
                      {file.size || 'LOGGED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= CENTER COLUMN (ARC REACTOR PORTAL) ================= */}
        <div className="xl:col-span-4 flex flex-col items-center justify-center gap-4 py-2">
          
          <div className="text-center">
            <span className="text-[9px] text-slate-400 tracking-widest uppercase">CENTRAL ARCH-REACTOR ENGINE</span>
            <h2 className="text-sm font-bold text-cyan-300 tracking-wider uppercase mt-1">HOLOGRAPHIC CONTROL CORE</h2>
          </div>

          {/* Majestic Concentric Rotating Arc Reactor Graphic */}
          <div className="relative flex items-center justify-center p-8">
            
            {/* Outer Cyber Radial Grid */}
            <div className="absolute w-64 h-64 border border-cyan-500/5 rounded-full pointer-events-none" />
            <div className="absolute w-56 h-56 border border-cyan-500/10 rounded-full border-dashed pointer-events-none" />
            
            {/* Ring 1 (Slow Outer Dials) */}
            <div className="absolute w-48 h-48 border border-cyan-500/20 rounded-full border-dashed animate-[spin_40s_linear_infinite] pointer-events-none"></div>
            
            {/* Ring 2 (Fast Intersect Dials Reverse) */}
            <div className="absolute w-40 h-40 border-2 border-cyan-500/15 rounded-full animate-[spin_15s_linear_infinite_reverse] pointer-events-none" style={{ borderStyle: 'double' }}></div>
            
            {/* Ring 3 (Concentric Technical tickmarks using SVG) */}
            <svg className="absolute w-44 h-44 animate-[spin_25s_linear_infinite] pointer-events-none" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="44" 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="1.5" 
                strokeDasharray="3 8 20 6" 
                className="opacity-30"
              />
            </svg>

            {/* Ring 4 (Concentric dots tickmarks) */}
            <svg className="absolute w-36 h-36 animate-[spin_10s_linear_infinite_reverse] pointer-events-none" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#22d3ee" 
                strokeWidth="2" 
                strokeDasharray="1 10" 
                className="opacity-40"
              />
            </svg>

            {/* Actual Interactive Arc Reactor Core Trigger Button */}
            <button
              onClick={onActivateVoice}
              className="relative w-28 h-28 rounded-full bg-cyan-950/45 hover:bg-cyan-900/50 border border-cyan-400/40 shadow-[0_0_40px_rgba(34,211,238,0.35)] flex items-center justify-center cursor-pointer group transition-all duration-500 active:scale-95 z-20"
            >
              {/* Core inner glossy radial overlay */}
              <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_50%_25%,_rgba(255,255,255,0.15)_0%,_transparent_75%)]" />
              
              {/* Stark Arc Reactor Pulsing Triangle Neon Polygon SVG */}
              <svg className="w-20 h-20 animate-pulse duration-1000" viewBox="0 0 100 100">
                <defs>
                  <filter id="glow-neon" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                {/* Triangular arc energy cells */}
                <polygon 
                  points="50,18 20,70 80,70" 
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="4" 
                  filter="url(#glow-neon)"
                  className="drop-shadow-[0_0_10px_#06b6d4]"
                />
                <polygon 
                  points="50,26 27,66 73,66" 
                  fill="rgba(6,182,212,0.15)" 
                  stroke="#22d3ee" 
                  strokeWidth="2.5" 
                />

                {/* Concentric center circular reactor core */}
                <circle cx="50" cy="54" r="12" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                <circle cx="50" cy="54" r="6" fill="#ffffff" className="animate-ping duration-1000" />
                <circle cx="50" cy="54" r="4" fill="#22d3ee" />
              </svg>

              {/* Technical indicators overlay */}
              <span className="absolute bottom-4 text-[7px] font-bold tracking-widest text-cyan-300 uppercase opacity-75 group-hover:opacity-100 transition-opacity">
                ACTIVATE VOICE
              </span>
            </button>
          </div>

          {/* Stark OS Branding Coordinates */}
          <div className="text-center pt-2 text-[10px] text-slate-400 space-y-1">
            <div className="font-bold text-cyan-400">CORE TEMPERATURE STATUS: NOMINAL</div>
            <div className="text-[9px] text-slate-500">STARK INDUSTRIES SECURITIES APPARATUS © 2026</div>
          </div>

          {/* Neural Core Adaptations (Evolved Directives List) */}
          <div className="w-full mt-2 p-3 bg-cyan-950/10 border border-cyan-500/10 rounded-xl text-left space-y-2">
            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block border-b border-cyan-500/15 pb-1">
              ACTIVE NEURAL CORE DIRECTIVES ({customDirectives.length})
            </span>
            <div className="space-y-1 max-h-[100px] overflow-y-auto">
              {customDirectives.map((directive, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[9px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                  <span className="truncate">{directive}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDEBAR (COLUMN 3) ================= */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          
          {/* Faithful Weather HUD Card from stark image */}
          <div className="p-4 bg-black/40 border border-cyan-500/10 rounded-xl flex flex-col gap-3 hover:border-cyan-500/20 transition-all">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-cyan-400" />
                ENVIRONMENT MATRIX
              </span>
              <span className="text-[9px] font-bold text-cyan-500">LOC_METRICS</span>
            </div>

            {/* Layout faithful to STARK image */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <div className="text-2xl font-light text-cyan-200 tracking-tight flex items-start">
                  30°C
                  <span className="text-xs font-bold ml-1 text-cyan-400">FAIR</span>
                </div>
                <div className="text-[9px] text-slate-400 uppercase mt-0.5 tracking-wider">
                  Updated: 5/5/13 5:55 PM
                </div>
              </div>
              
              <div className="space-y-1 text-[9px] text-slate-300 border-l border-cyan-500/10 pl-3">
                <div className="flex justify-between">
                  <span>HUMIDITY:</span>
                  <span className="font-bold text-cyan-300">14%</span>
                </div>
                <div className="flex justify-between">
                  <span>WIND:</span>
                  <span className="font-bold text-cyan-300">8 KM/H (E)</span>
                </div>
                <div className="flex justify-between">
                  <span>PRESSURE:</span>
                  <span className="font-bold text-cyan-300">1015.2 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>SUNRISE:</span>
                  <span className="font-bold text-cyan-300">7:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>SUNSET:</span>
                  <span className="font-bold text-cyan-300">8:19 PM</span>
                </div>
              </div>
            </div>

            {/* Extra detail line */}
            <div className="flex justify-between items-center text-[9px] bg-cyan-500/5 p-1.5 rounded border border-cyan-500/5 text-slate-400">
              <span className="flex items-center gap-1">
                <Moon className="w-3 h-3 text-cyan-300" />
                MOON PHASE: WANING CRESCENT
              </span>
              <span className="text-[8px] text-emerald-400 font-bold uppercase">STABLE</span>
            </div>
          </div>

          {/* Secure Chrono Index (Calendar) */}
          <div className="p-4 bg-black/40 border border-cyan-500/10 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
                CHRONO INDEX BRIEFINGS
              </span>
              <span className="text-[8px] px-2 py-0.5 bg-cyan-500/10 rounded-full font-bold">SECURE LOG</span>
            </div>

            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {displayEvents.map((event, i) => (
                <div 
                  key={event.id || i}
                  className="p-2 bg-cyan-950/20 border border-cyan-500/5 hover:border-cyan-500/20 rounded flex flex-col gap-1 text-[9px] transition-all group"
                >
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span className="truncate group-hover:text-cyan-300 transition-colors">
                      {event.summary}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[8px] text-slate-500 flex justify-between">
                    <span>{new Date(event.start).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="truncate max-w-[150px]">{event.location || 'Stark Lab'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stark OS Cognitive Logs */}
          <div className="p-4 bg-black/40 border border-cyan-500/10 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                SYSTEM ACTIVITY TIMELINE
              </span>
              <span className="text-[8px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-bold">ONLINE</span>
            </div>
            
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 text-[8px] font-mono">
              {activityLogs.map((log, i) => (
                <div key={log.id || i} className="flex gap-2 leading-relaxed border-b border-cyan-500/5 pb-1">
                  <span className="text-cyan-500 shrink-0">[{log.timestamp}]</span>
                  <span className={log.type === 'done' ? 'text-emerald-400' : 'text-slate-300'}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ================= BOTTOM PANEL ROW (COLUMN 4) ================= */}
      <div className="p-4 bg-cyan-950/10 border-t border-cyan-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 z-10">
        
        {/* Secure Incoming Transmission Stream (Gmail logs) */}
        <div className="p-3 bg-black/50 border border-cyan-500/10 rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-cyan-500/15 pb-1">
            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Mail className="w-3 h-3 text-cyan-400" />
              INCOMING CLASSIFIED DATA STREAM (GMAIL)
            </span>
            <span className="text-[8px] text-slate-500">ACTIVE CAPTURE</span>
          </div>

          <div className="space-y-1.5 max-h-[90px] overflow-y-auto pr-1">
            {displayEmails.map((email, i) => (
              <div 
                key={email.id || i}
                className="text-[9px] flex flex-col gap-0.5 border-b border-cyan-500/5 pb-1 last:border-0"
              >
                <div className="flex justify-between text-slate-300">
                  <span className="font-bold truncate max-w-[180px]">{email.from.split(' <')[0]}</span>
                  <span className="text-slate-500 text-[8px]">{email.subject}</span>
                </div>
                <div className="text-[8px] text-slate-500 truncate">{email.snippet}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Network Traffic Waveforms Visualizer (Canvas styled) */}
        <div className="p-3 bg-black/50 border border-cyan-500/10 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-cyan-500/15 pb-1 mb-1">
            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              HIGH-FREQUENCY WAVESTREAM TELEMETRY
            </span>
            <div className="flex gap-2 text-[8px] text-slate-500">
              <span>UP: <span className="text-cyan-300 font-bold">{netUp} KB/s</span></span>
              <span>DOWN: <span className="text-cyan-300 font-bold">{netDown} MB/s</span></span>
            </div>
          </div>

          {/* Canvas Wave animation effect */}
          <div className="flex-1 h-14 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center gap-0.5">
              {Array.from({ length: 48 }).map((_, idx) => {
                const height = 10 + Math.sin(idx * 0.4) * 15 + Math.random() * 15;
                return (
                  <motion.div
                    key={idx}
                    animate={{ height: [height - 5, height + 10, height - 5] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + Math.random() * 0.8,
                      ease: "easeInOut"
                    }}
                    className="w-[3px] bg-cyan-400/30 rounded-full"
                    style={{
                      backgroundColor: idx % 6 === 0 ? 'rgba(34, 211, 238, 0.7)' : 'rgba(6, 182, 212, 0.25)',
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Cyber Metadata Bottom Ticker */}
      <div className="p-3 bg-cyan-950/30 border-t border-cyan-500/20 flex justify-between items-center text-[9px] text-slate-500 tracking-wider font-mono">
        <span className="flex items-center gap-1.5 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          STARK INDUSTRIES DIGITAL SECURE FRAME SYNC
        </span>
        <span className="uppercase text-[8px] text-cyan-500 font-bold">
          API ENCRYPTION: SECURE_SOCKET_FLOW_200
        </span>
      </div>

      {/* Holographic File Viewer Modal */}
      <AnimatePresence>
        {selectedFile && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 font-mono text-cyan-400">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#020204] border border-cyan-400/50 rounded-2xl w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.25)] flex flex-col max-h-[85vh]"
            >
              <div className="p-4 bg-cyan-950/20 border-b border-cyan-400/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-amber-400 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold text-amber-400 uppercase">{selectedFile.name}</h3>
                    <p className="text-[9px] text-slate-500">CATEGORY: {selectedFile.category || 'DELIVERABLE'} • TYPE: {selectedFile.fileType || 'MARKDOWN'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="px-2 py-1 border border-cyan-500/30 hover:border-cyan-400 hover:text-white rounded text-xs transition-colors"
                >
                  CLOSE_TERMINAL [X]
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 bg-black/60 text-xs leading-relaxed text-slate-300">
                <pre className="whitespace-pre-wrap select-text font-mono text-cyan-300 bg-cyan-950/5 p-4 rounded-xl border border-cyan-500/10">
                  {selectedFile.content}
                </pre>
              </div>

              <div className="p-3 bg-cyan-950/30 border-t border-cyan-500/20 flex justify-between items-center text-[9px] text-slate-500">
                <span>STARK QUANTUM ENVELOPE ENCRYPTION</span>
                <span>COMPILED VIA JARVIS COGNITIVE SUB-ROUTINE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
