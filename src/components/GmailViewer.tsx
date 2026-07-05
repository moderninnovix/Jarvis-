import React, { useState, useEffect } from 'react';
import { Mail, Send, Eye, RefreshCw, ChevronRight, CornerDownLeft, AlertCircle } from 'lucide-react';
import { listEmails, sendEmail } from '../lib/googleApi';
import { WorkspaceEmail } from '../types';

interface GmailViewerProps {
  token: string | null;
}

export default function GmailViewer({ token }: GmailViewerProps) {
  const [emails, setEmails] = useState<WorkspaceEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<WorkspaceEmail | null>(null);
  
  // Compose email states
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchEmails = async () => {
    if (!token) return;
    setLoading(true);
    setStatusMessage('');
    try {
      const list = await listEmails(token, 10);
      setEmails(list);
    } catch (err: any) {
      console.error(err);
      setStatusMessage('ইমেইল লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEmails();
    }
  }, [token]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !composeTo || !composeSubject || !composeBody) {
      alert('সবগুলো ঘর পূরণ করুন।');
      return;
    }

    // MANDATORY confirmation dialog for data mutations/sending emails
    const confirmed = window.confirm(
      `আপনি কি নিশ্চিত যে আপনি "${composeTo}" ঠিকানায় এই ইমেইলটি পাঠাতে চান?\n\nবিষয়: ${composeSubject}`
    );
    if (!confirmed) return;

    setSending(true);
    setStatusMessage('');
    try {
      await sendEmail(token, composeTo, composeSubject, composeBody);
      setStatusMessage('ইমেইলটি সফলভাবে পাঠানো হয়েছে!');
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      fetchEmails(); // reload emails list
    } catch (err: any) {
      console.error(err);
      setStatusMessage('ইমেইল পাঠানো সম্ভব হয়নি।');
    } finally {
      setSending(false);
    }
  };

  if (!token) {
    return (
      <div id="gmail-no-token" className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <Mail className="w-12 h-12 mb-4 text-slate-500 animate-pulse" />
        <p className="font-medium text-base">Gmail ইন্টিগ্রেশন সচল করতে লগইন করুন</p>
      </div>
    );
  }

  return (
    <div id="gmail-viewer-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full font-sans">
      {/* Emails List */}
      <div id="gmail-list-pane" className="lg:col-span-5 border border-white/10 rounded-2xl bg-white/5 p-4 flex flex-col h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2 text-xs">
            <Mail className="w-5 h-5 text-cyan-400" />
            ইনবক্স (ইমেইল সমূহ)
          </h3>
          <button 
            onClick={fetchEmails}
            disabled={loading}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="flex justify-center items-center h-full text-xs text-slate-400">লোড হচ্ছে...</div>
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
              <AlertCircle className="w-8 h-8 mb-2 text-slate-500" />
              কোন ইমেইল পাওয়া যায়নি।
            </div>
          ) : (
            emails.map((email) => (
              <div 
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedEmail?.id === email.id 
                    ? 'border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' 
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="font-semibold text-xs text-slate-200 truncate max-w-[140px]">
                    {email.from.split('<')[0].trim()}
                  </span>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {new Date(email.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h4 className="font-medium text-xs text-slate-300 line-clamp-1 mb-1">{email.subject}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{email.snippet}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail or Compose Pane */}
      <div id="gmail-action-pane" className="lg:col-span-7 flex flex-col gap-6">
        {/* Email Detail View */}
        {selectedEmail ? (
          <div id="email-detail-view" className="border border-white/10 rounded-2xl bg-white/5 p-5 flex flex-col h-[280px]">
            <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-3">
              <div>
                <h4 className="font-semibold text-white text-sm">{selectedEmail.subject}</h4>
                <p className="text-xs text-slate-300 mt-1">
                  <span className="font-medium text-slate-500">কার থেকে:</span> {selectedEmail.from}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  <span className="font-medium text-slate-500">সময়:</span> {new Date(selectedEmail.date).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedEmail(null)}
                className="text-[11px] font-medium text-slate-400 hover:text-white transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
            <div className="flex-1 overflow-y-auto text-xs text-slate-300 whitespace-pre-line leading-relaxed pr-1">
              {selectedEmail.body || selectedEmail.snippet}
            </div>
          </div>
        ) : (
          <div id="email-welcome-panel" className="border border-white/5 rounded-2xl bg-black/20 flex items-center justify-center p-6 h-[280px] text-slate-400 text-xs">
            বাম দিকের তালিকা থেকে একটি ইমেইল নির্বাচন করুন বিস্তারিত দেখার জন্য।
          </div>
        )}

        {/* Compose Form */}
        <div id="email-compose-form" className="border border-white/10 rounded-2xl bg-white/5 p-5">
          <h4 className="font-semibold text-white text-xs flex items-center gap-2 mb-3">
            <Send className="w-4 h-4 text-cyan-400" />
            নতুন ইমেইল পাঠান (সংকলন করুন)
          </h4>

          <form onSubmit={handleSendEmail} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">প্রাপক (To)</label>
                <input 
                  type="email" 
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">বিষয় (Subject)</label>
                <input 
                  type="text" 
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="ইমেইলের বিষয়বস্তু লিখুন..."
                  className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">বার্তা (Body)</label>
              <textarea 
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="এখানে আপনার বার্তাটি লিখুন..."
                rows={4}
                className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
                required
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] text-cyan-400 font-medium">{statusMessage}</span>
              <button
                type="submit"
                disabled={sending}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-40 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              >
                <Send className="w-3.5 h-3.5" />
                {sending ? 'পাঠানো হচ্ছে...' : 'ইমেইল পাঠান'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
