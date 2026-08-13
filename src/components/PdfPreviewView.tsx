import React, { useState } from 'react';
import { GeneratedPdfInfo } from '../types';
import {
  Download,
  Share2,
  FileCheck,
  HardDrive,
  Clock,
  ExternalLink,
  Mail,
  MessageSquare,
  Copy,
  Check,
  X,
  FilePlus2
} from 'lucide-react';

interface PdfPreviewViewProps {
  pdfInfo: GeneratedPdfInfo | null;
  onCreateNewDoc: () => void;
}

export const PdfPreviewView: React.FC<PdfPreviewViewProps> = ({ pdfInfo, onCreateNewDoc }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!pdfInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <FileCheck className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">No Document Preview Available</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto font-medium">
            Please fill out the form in the "New Doc" tab and click "Generate & Send PDF" to preview your billing document here.
          </p>
        </div>
        <button
          onClick={onCreateNewDoc}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-100 active:scale-95 cursor-pointer"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>Create New Document</span>
        </button>
      </div>
    );
  }

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = pdfInfo.blobUrl;
    a.download = `${pdfInfo.docId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SEIA Billing Document - ${pdfInfo.docId}`,
          text: `Here is the billing document ${pdfInfo.docId} from SEIA Security System Services.`,
          url: window.location.href,
        });
      } catch {
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Status Banner */}
      <div className="bg-white border border-slate-100 rounded-2xl p-3.5 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold text-slate-900 text-xs tracking-tight">
              {pdfInfo.docId}.pdf
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
            Generated
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-medium">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Time: {pdfInfo.timestamp}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <HardDrive className="w-3.5 h-3.5 text-cyan-600" />
            <span className="font-mono font-bold">{pdfInfo.sizeKb} KB</span>
          </div>
        </div>
      </div>

      {/* Embedded PDF Viewer */}
      <div className="relative w-full h-[460px] bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-md">
        <iframe
          src={pdfInfo.blobUrl}
          title={`PDF Preview ${pdfInfo.docId}`}
          className="w-full h-full border-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-100 active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Document</span>
        </button>
      </div>

      {/* Fallback Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Share Document</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <a
                href={`mailto:?subject=SEIA Billing Document ${pdfInfo.docId}&body=Please find attached billing document from SEIA Security.`}
                className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 font-semibold transition-all"
              >
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Send via Email Client</span>
              </a>

              <a
                href={`https://wa.me/?text=SEIA Billing Document ${pdfInfo.docId}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 font-semibold transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Share via WhatsApp / Messaging</span>
              </a>

              <button
                onClick={copyShareLink}
                className="w-full flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 font-semibold transition-all text-left cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">App URL Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-600" />
                    <span>Copy Document Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
