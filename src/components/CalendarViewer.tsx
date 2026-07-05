import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, RefreshCw, AlertCircle, Video, Clock, MapPin } from 'lucide-react';
import { listEvents, createEvent, deleteEvent } from '../lib/googleApi';
import { WorkspaceEvent } from '../types';

interface CalendarViewerProps {
  token: string | null;
}

export default function CalendarViewer({ token }: CalendarViewerProps) {
  const [events, setEvents] = useState<WorkspaceEvent[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Create Event Form states
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [createMeetLink, setCreateMeetLink] = useState(false);
  const [creating, setCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchEvents = async () => {
    if (!token) return;
    setLoading(true);
    setStatusMessage('');
    try {
      const list = await listEvents(token, 10);
      setEvents(list);
    } catch (err: any) {
      console.error(err);
      setStatusMessage('ক্যালেন্ডার ইভেন্ট লোড করা সম্ভব হয়নি।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !summary || !startDateTime || !endDateTime) {
      alert('ইভেন্টের নাম, শুরুর সময় এবং শেষের সময় পূরণ করুন।');
      return;
    }

    // MANDATORY confirmation dialog for data mutations
    const confirmed = window.confirm(
      `আপনি কি নিশ্চিত যে আপনি এই ক্যালেন্ডার ইভেন্টটি যুক্ত করতে চান?\n\nনাম: ${summary}\nশুরু: ${new Date(startDateTime).toLocaleString()}`
    );
    if (!confirmed) return;

    setCreating(true);
    setStatusMessage('');
    try {
      await createEvent(token, {
        summary,
        description,
        location,
        start: startDateTime,
        end: endDateTime,
      }, createMeetLink);
      
      setStatusMessage('ইভেন্টটি ক্যালেন্ডারে সফলভাবে যুক্ত করা হয়েছে!');
      setSummary('');
      setDescription('');
      setLocation('');
      setStartDateTime('');
      setEndDateTime('');
      setCreateMeetLink(false);
      fetchEvents(); // Refresh
    } catch (err: any) {
      console.error(err);
      setStatusMessage('ইভেন্ট যুক্ত করতে সমস্যা হয়েছে।');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventSummary: string) => {
    if (!token) return;

    // MANDATORY confirmation dialog for deletion
    const confirmed = window.confirm(
      `আপনি কি নিশ্চিত যে আপনি এই ক্যালেন্ডার ইভেন্টটি মুছে ফেলতে চান?\n\nনাম: ${eventSummary}`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteEvent(token, eventId);
      setStatusMessage('ইভেন্টটি সফলভাবে মুছে ফেলা হয়েছে।');
      fetchEvents(); // Refresh
    } catch (err: any) {
      console.error(err);
      setStatusMessage('ইভেন্টটি মুছতে ত্রুটি দেখা দিয়েছে।');
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div id="calendar-no-token" className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <Calendar className="w-12 h-12 mb-4 text-slate-500 animate-pulse" />
        <p className="font-medium text-base">Google Calendar ইন্টিগ্রেশন সচল করতে লগইন করুন</p>
      </div>
    );
  }

  return (
    <div id="calendar-viewer-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full font-sans">
      {/* Event Form Panel */}
      <div id="calendar-create-pane" className="lg:col-span-5 border border-white/10 rounded-2xl bg-white/5 p-5 h-fit">
        <h3 className="font-semibold text-white flex items-center gap-2 mb-4 text-xs">
          <Plus className="w-5 h-5 text-cyan-400" />
          নতুন ইভেন্ট শিডিউল করুন
        </h3>

        <form onSubmit={handleCreateEvent} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ইভেন্টের নাম (Summary)</label>
            <input 
              type="text" 
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="যেমন: বিজনেস মিটিং, লাঞ্চ মিটিং"
              className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">বর্ণনা (Description)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="মিটিং বা ইভেন্টের বিস্তারিত..."
              rows={2}
              className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">স্থান (Location)</label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="গুগল মিট, অফিস রুম বা ক্যাফে..."
              className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">শুরুর সময় (Start)</label>
              <input 
                type="datetime-local" 
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">শেষের সময় (End)</label>
              <input 
                type="datetime-local" 
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 py-1">
            <input 
              type="checkbox" 
              id="createMeetLink"
              checked={createMeetLink}
              onChange={(e) => setCreateMeetLink(e.target.checked)}
              className="rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="createMeetLink" className="text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer">
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              Google Meet লিংক স্বয়ংক্রিয়ভাবে তৈরি করুন
            </label>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-cyan-400 font-medium">{statusMessage}</span>
            <button
              type="submit"
              disabled={creating}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-40 shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer"
            >
              {creating ? 'শিডিউল হচ্ছে...' : 'শিডিউল করুন'}
            </button>
          </div>
        </form>
      </div>

      {/* Events List Panel */}
      <div id="calendar-list-pane" className="lg:col-span-7 border border-white/10 rounded-2xl bg-white/5 p-5 flex flex-col h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2 text-xs">
            <Calendar className="w-5 h-5 text-cyan-400" />
            আসন্ন ক্যালেন্ডার ইভেন্ট সমূহ
          </h3>
          <button 
            onClick={fetchEvents}
            disabled={loading}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="flex justify-center items-center h-full text-xs text-slate-400">লোড হচ্ছে...</div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs text-center">
              <AlertCircle className="w-8 h-8 mb-2 text-slate-500" />
              কোন ক্যালেন্ডার ইভেন্ট পাওয়া যায়নি।
            </div>
          ) : (
            events.map((event) => (
              <div 
                key={event.id}
                className="p-4 rounded-xl border border-white/10 hover:border-cyan-500/30 bg-white/5 shadow-md transition-all relative group"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="font-semibold text-white text-xs">{event.summary}</h4>
                  <button
                    onClick={() => handleDeleteEvent(event.id, event.summary)}
                    className="p-1 text-slate-500 hover:text-red-400 rounded-md transition-colors opacity-100 lg:opacity-0 group-hover:opacity-100 focus:opacity-100 absolute top-3 right-3"
                    title="ইভেন্ট মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {event.description && (
                  <p className="text-[11px] text-slate-400 mb-2 line-clamp-2 leading-relaxed">{event.description}</p>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-cyan-400/70" />
                    <span>
                      {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
                    </span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400/70" />
                      <span className="truncate max-w-[280px]">{event.location}</span>
                    </div>
                  )}
                </div>

                {event.htmlLink && (
                  <div className="mt-2 text-right">
                    <a 
                      href={event.htmlLink}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="text-[10px] font-semibold text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      গুগল ক্যালেন্ডারে দেখুন
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
