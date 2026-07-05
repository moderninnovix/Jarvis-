import React, { useState, useEffect } from 'react';
import { HardDrive, RefreshCw, AlertCircle, FileText, Image, Film, FileCode, File, Upload, ExternalLink } from 'lucide-react';
import { listFiles, uploadFile } from '../lib/googleApi';
import { WorkspaceFile } from '../types';

interface DriveViewerProps {
  token: string | null;
}

export default function DriveViewer({ token }: DriveViewerProps) {
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  // File Upload states
  const [uploadName, setUploadName] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [uploadMimeType, setUploadMimeType] = useState('text/plain');
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    if (!token) return;
    setLoading(true);
    setStatusMessage('');
    try {
      const list = await listFiles(token, 15);
      setFiles(list);
    } catch (err: any) {
      console.error(err);
      setStatusMessage('গুগল ড্রাইভ ফাইলসমূহ লোড করা সম্ভব হয়নি।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFiles();
    }
  }, [token]);

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !uploadName || !uploadContent) {
      alert('ফাইল নাম এবং টেক্সট কন্টেন্ট প্রদান করুন।');
      return;
    }

    const confirmed = window.confirm(`আপনি কি নিশ্চিত যে আপনি "${uploadName}" ফাইলটি গুগল ড্রাইভে আপলোড করতে চান?`);
    if (!confirmed) return;

    setUploading(true);
    setStatusMessage('');
    try {
      await uploadFile(token, uploadName, uploadMimeType, uploadContent);
      setStatusMessage('ফাইলটি সফলভাবে ড্রাইভ-এ আপলোড করা হয়েছে!');
      setUploadName('');
      setUploadContent('');
      fetchFiles(); // Reload
    } catch (err: any) {
      console.error(err);
      setStatusMessage('ফাইল আপলোড করতে ত্রুটি ঘটেছে।');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image/')) return <Image className="w-5 h-5 text-green-500" />;
    if (mimeType.includes('video/')) return <Film className="w-5 h-5 text-red-500" />;
    if (mimeType.includes('text/') || mimeType.includes('document')) return <FileText className="w-5 h-5 text-blue-500" />;
    if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('html')) return <FileCode className="w-5 h-5 text-yellow-500" />;
    return <File className="w-5 h-5 text-gray-400" />;
  };

  if (!token) {
    return (
      <div id="drive-no-token" className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <HardDrive className="w-12 h-12 mb-4 text-slate-500 animate-pulse" />
        <p className="font-medium text-base">Google Drive INTইগ্রেশন সচল করতে লগইন করুন</p>
      </div>
    );
  }

  return (
    <div id="drive-viewer-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full font-sans">
      {/* File Upload Panel */}
      <div id="drive-upload-pane" className="lg:col-span-4 border border-white/10 rounded-2xl bg-white/5 p-5 h-fit">
        <h3 className="font-semibold text-white flex items-center gap-2 mb-4 text-xs">
          <Upload className="w-5 h-5 text-cyan-400" />
          ড্রাইভে নতুন ফাইল আপলোড করুন
        </h3>

        <form onSubmit={handleUploadFile} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ফাইলের নাম</label>
            <input 
              type="text" 
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              placeholder="যেমন: note.txt, report.json"
              className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ফাইলের ধরণ (MIME Type)</label>
            <select 
              value={uploadMimeType}
              onChange={(e) => setUploadMimeType(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-slate-900 text-white focus:border-cyan-500 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="text/plain" className="bg-slate-950">সাধারণ টেক্সট (.txt)</option>
              <option value="text/markdown" className="bg-slate-950">মার্কডাউন (.md)</option>
              <option value="application/json" className="bg-slate-950">জেসন জেনারেটেড (.json)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ফাইলের বিষয়বস্তু (Text Content)</label>
            <textarea 
              value={uploadContent}
              onChange={(e) => setUploadContent(e.target.value)}
              placeholder="ফাইলের টেক্সট ডেটা লিখুন..."
              rows={4}
              className="w-full text-xs px-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
              required
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-cyan-400 font-medium">{statusMessage}</span>
            <button
              type="submit"
              disabled={uploading}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-40 shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer"
            >
              {uploading ? 'আপলোড হচ্ছে...' : 'আপলোড করুন'}
            </button>
          </div>
        </form>
      </div>

      {/* Files List Panel */}
      <div id="drive-list-pane" className="lg:col-span-8 border border-white/10 rounded-2xl bg-white/5 p-5 flex flex-col h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2 text-xs">
            <HardDrive className="w-5 h-5 text-cyan-400" />
            ড্রাইভের ফাইল সমূহ (Google Drive)
          </h3>
          <button 
            onClick={fetchFiles}
            disabled={loading}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="flex justify-center items-center h-full text-xs text-slate-400">লোড হচ্ছে...</div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs text-center">
              <AlertCircle className="w-8 h-8 mb-2 text-slate-500" />
              ড্রাইভে কোন ফাইল পাওয়া যায়নি।
            </div>
          ) : (
            files.map((file) => (
              <div 
                key={file.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5 hover:border-cyan-500/30 hover:bg-white/10 shadow-md transition-all"
              >
                <div className="flex items-center gap-3 truncate">
                  {getFileIcon(file.mimeType)}
                  <div className="text-left truncate">
                    <h4 className="font-semibold text-slate-200 text-xs truncate max-w-[280px] md:max-w-[400px]">
                      {file.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {file.size ? `${(parseInt(file.size) / 1024).toFixed(1)} KB • ` : ''}সংশোধিত: {new Date(file.modifiedTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {file.webViewLink && (
                  <a 
                    href={file.webViewLink}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="ড্রাইভে ফাইলটি খুলুন"
                  >
                    <ExternalLink className="w-4 h-4 text-cyan-400/80" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
