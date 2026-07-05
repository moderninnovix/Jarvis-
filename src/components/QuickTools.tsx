import React, { useState } from 'react';
import { FileText, FileSpreadsheet as SheetsIcon, Presentation, FileBox, Video, Plus, ArrowUpRight, Check } from 'lucide-react';
import { createGoogleDoc, createGoogleSheet, createGooglePresentation, createGoogleForm, createMeetSpace } from '../lib/googleApi';

interface QuickToolsProps {
  token: string | null;
}

export default function QuickTools({ token }: QuickToolsProps) {
  const [loading, setLoading] = useState(false);
  const [createdItem, setCreatedItem] = useState<{ type: string; title: string; link: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Forms states
  const [docTitle, setDocTitle] = useState('');
  const [docBody, setDocBody] = useState('');
  const [sheetTitle, setSheetTitle] = useState('');
  const [slidesTitle, setSlidesTitle] = useState('');
  const [formTitle, setFormTitle] = useState('');

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !docTitle) return;
    
    const confirmed = window.confirm(`আপনি কি "${docTitle}" নামে একটি গুগল ডক তৈরি করতে চান?`);
    if (!confirmed) return;

    setLoading(true);
    setStatusMessage('');
    setCreatedItem(null);
    try {
      const doc = await createGoogleDoc(token, docTitle, docBody);
      setCreatedItem({
        type: 'Google Doc',
        title: docTitle,
        link: `https://docs.google.com/document/d/${doc.documentId}/edit`,
      });
      setStatusMessage('গুগল ডক সফলভাবে তৈরি করা হয়েছে!');
      setDocTitle('');
      setDocBody('');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('ডকুমেন্ট তৈরিতে ত্রুটি দেখা দিয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !sheetTitle) return;

    const confirmed = window.confirm(`আপনি কি "${sheetTitle}" নামে একটি গুগল শীট তৈরি করতে চান?`);
    if (!confirmed) return;

    setLoading(true);
    setStatusMessage('');
    setCreatedItem(null);
    try {
      const sheet = await createGoogleSheet(token, sheetTitle);
      setCreatedItem({
        type: 'Google Sheet',
        title: sheetTitle,
        link: sheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${sheet.spreadsheetId}/edit`,
      });
      setStatusMessage('গুগল শীট সফলভাবে তৈরি করা হয়েছে!');
      setSheetTitle('');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('শীট তৈরিতে ত্রুটি দেখা দিয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlides = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !slidesTitle) return;

    const confirmed = window.confirm(`আপনি কি "${slidesTitle}" নামে একটি গুগল স্লাইডস প্রেজেন্টেশন তৈরি করতে চান?`);
    if (!confirmed) return;

    setLoading(true);
    setStatusMessage('');
    setCreatedItem(null);
    try {
      const slide = await createGooglePresentation(token, slidesTitle);
      setCreatedItem({
        type: 'Google Slides',
        title: slidesTitle,
        link: `https://docs.google.com/presentation/d/${slide.presentationId}/edit`,
      });
      setStatusMessage('গুগল স্লাইডস সফলভাবে তৈরি করা হয়েছে!');
      setStatusMessage('গুগল স্লাইডস সফলভাবে তৈরি করা হয়েছে!');
      setSlidesTitle('');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('প্রেজেন্টেশন তৈরিতে ত্রুটি দেখা দিয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formTitle) return;

    const confirmed = window.confirm(`আপনি কি "${formTitle}" নামে একটি গুগল ফর্ম তৈরি করতে চান?`);
    if (!confirmed) return;

    setLoading(true);
    setStatusMessage('');
    setCreatedItem(null);
    try {
      const form = await createGoogleForm(token, formTitle);
      setCreatedItem({
        type: 'Google Form',
        title: formTitle,
        link: form.responderUri || `https://docs.google.com/forms/d/${form.formId}/edit`,
      });
      setStatusMessage('গুগল ফর্ম সফলভাবে তৈরি করা হয়েছে!');
      setFormTitle('');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('ফর্ম তৈরিতে ত্রুটি দেখা দিয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeet = async () => {
    if (!token) return;

    const confirmed = window.confirm('আপনি কি একটি তাৎক্ষণিক গুগল মিট (Google Meet) মিটিং স্পেস তৈরি করতে চান?');
    if (!confirmed) return;

    setLoading(true);
    setStatusMessage('');
    setCreatedItem(null);
    try {
      const meet = await createMeetSpace(token);
      setCreatedItem({
        type: 'Google Meet',
        title: 'তাৎক্ষণিক গুগল মিট মিটিং',
        link: meet.meetLink,
      });
      setStatusMessage('গুগল মিট মিটিং স্পেস সফলভাবে তৈরি করা হয়েছে!');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('মিটিং স্পেস তৈরিতে ত্রুটি দেখা দিয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div id="tools-no-token" className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <FileText className="w-12 h-12 mb-4 text-slate-500 animate-pulse" />
        <p className="font-medium text-base">Google Workspace কুইক টুলস সচল করতে লগইন করুন</p>
      </div>
    );
  }

  return (
    <div id="quick-tools-container" className="space-y-6 text-left font-sans">
      {/* Creation Status Notification */}
      {statusMessage && (
        <div id="tools-status-alert" className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400">{statusMessage}</span>
          </div>
          {createdItem && (
            <a 
              href={createdItem.link}
              target="_blank"
              referrerPolicy="no-referrer"
              className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              খুলুন <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Meet Instant Action Banner */}
      <div id="meet-banner" className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
            <Video className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">তাৎক্ষণিক গুগল মিট (Google Meet) মিটিং লিংক</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">এক ক্লিকে আপনার বন্ধুদের বা সহকর্মীদের জন্য গুগল মিট ভিডিও স্পেস তৈরি করুন।</p>
          </div>
        </div>
        <button
          onClick={handleCreateMeet}
          disabled={loading}
          className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium text-xs px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer"
        >
          <Video className="w-4 h-4" />
          মিটিং শুরু করুন
        </button>
      </div>

      {/* Grid of Other Creators */}
      <div id="creators-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Doc Creator */}
        <div id="doc-creator" className="border border-white/10 bg-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/30 transition-all shadow-md">
          <div>
            <h4 className="font-bold text-white text-xs flex items-center gap-2 mb-3">
              <FileText className="w-4.5 h-4.5 text-blue-400" />
              Google Doc তৈরি করুন
            </h4>
            <form onSubmit={handleCreateDoc} className="space-y-2.5">
              <input 
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="ফাইলের নাম (যেমন: Q3 বিজনেস প্ল্যান)"
                className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                required
              />
              <textarea 
                value={docBody}
                onChange={(e) => setDocBody(e.target.value)}
                placeholder="প্রাথমিক প্যারাগ্রাফ বা মেসেজ (ঐচ্ছিক)..."
                rows={2}
                className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all disabled:opacity-40 shadow-[0_0_12px_rgba(34,211,238,0.15)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                ডকুমেন্ট তৈরি করুন
              </button>
            </form>
          </div>
        </div>

        {/* Google Sheet Creator */}
        <div id="sheet-creator" className="border border-white/10 bg-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/30 transition-all shadow-md">
          <div>
            <h4 className="font-bold text-white text-xs flex items-center gap-2 mb-3">
              <SheetsIcon className="w-4.5 h-4.5 text-green-400" />
              Google Sheet তৈরি করুন
            </h4>
            <form onSubmit={handleCreateSheet} className="space-y-2.5">
              <input 
                type="text"
                value={sheetTitle}
                onChange={(e) => setSheetTitle(e.target.value)}
                placeholder="শীটের নাম (যেমন: বাজেট ট্র্যাকার ২০২৬)"
                className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                required
              />
              <p className="text-[10px] text-slate-500">একটি একদম নতুন স্প্রেডশীট সরাসরি আপনার গুগল ড্রাইভে সংরক্ষিত হবে।</p>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all disabled:opacity-40 shadow-[0_0_12px_rgba(34,211,238,0.15)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                স্প্রেডশীট তৈরি করুন
              </button>
            </form>
          </div>
        </div>

        {/* Google Slides Creator */}
        <div id="slides-creator" className="border border-white/10 bg-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/30 transition-all shadow-md">
          <div>
            <h4 className="font-bold text-white text-xs flex items-center gap-2 mb-3">
              <Presentation className="w-4.5 h-4.5 text-orange-400" />
              Google Slides তৈরি করুন
            </h4>
            <form onSubmit={handleCreateSlides} className="space-y-2.5">
              <input 
                type="text"
                value={slidesTitle}
                onChange={(e) => setSlidesTitle(e.target.value)}
                placeholder="স্লাইডস প্রেজেন্টেশনের নাম (যেমন: সেলস ডেক)"
                className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                required
              />
              <p className="text-[10px] text-slate-500">নতুন গুগল স্লাইড্স প্রেজেন্টেশন স্লাইড ফাইল তৈরি করুন ড্রাইভের ভিতরে।</p>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all disabled:opacity-40 shadow-[0_0_12px_rgba(34,211,238,0.15)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                প্রেজেন্টেশন তৈরি করুন
              </button>
            </form>
          </div>
        </div>

        {/* Google Forms Creator */}
        <div id="forms-creator" className="border border-white/10 bg-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/30 transition-all shadow-md">
          <div>
            <h4 className="font-bold text-white text-xs flex items-center gap-2 mb-3">
              <FileBox className="w-4.5 h-4.5 text-purple-400" />
              Google Form তৈরি করুন
            </h4>
            <form onSubmit={handleCreateForm} className="space-y-2.5">
              <input 
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="ফর্মের নাম (যেমন: ইউজার ফিডব্যাক সার্ভে)"
                className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                required
              />
              <p className="text-[10px] text-slate-500">একটি একদম খালি গুগল ফর্ম সরাসরি ড্রাইভের মূলে তৈরি করুন।</p>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all disabled:opacity-40 shadow-[0_0_12px_rgba(34,211,238,0.15)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                ফর্ম তৈরি করুন
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
