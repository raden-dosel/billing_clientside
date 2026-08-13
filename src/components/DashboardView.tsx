import React, { useState } from 'react';
import { DocType, AppSettings } from '../types';
import {
  FileText,
  FileSpreadsheet,
  Receipt,
  Download,
  ShieldCheck,
  Server,
  Key,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

interface DashboardViewProps {
  onStartDoc: (docType: DocType) => void;
  settings: AppSettings;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onStartDoc, settings }) => {
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'online' | 'offline'>('idle');

  const testEndpoint = async () => {
    setPingStatus('testing');
    try {
      const response = await fetch('/api/health').catch(() => null);
      if (response && response.ok) {
        setPingStatus('online');
      } else {
        setPingStatus('offline');
      }
    } catch {
      setPingStatus('offline');
    }
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Brand Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-5 text-white shadow-xl shadow-indigo-100 space-y-3">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-slate-800 p-1 flex items-center justify-center shadow-lg shrink-0">
            <img
              src="/seia_logo_official.jpg"
              alt="SEIA Security System Services"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">
              SEIA Security Systems
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-cyan-200 font-bold mt-0.5">
              Security System Services
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-indigo-400/30 text-xs text-indigo-50 space-y-2 font-medium">
          <div className="flex items-center space-x-2.5">
            <MapPin className="w-4 h-4 text-cyan-300 shrink-0" />
            <span className="text-[11px] leading-tight">114 Dahlia St., Diliman, Quezon City</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Mail className="w-4 h-4 text-cyan-300 shrink-0" />
            <span className="text-[11px]">sherwinmadrid210@gmail.com</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="text-[11px] font-mono font-semibold">+63 977 015 9162</span>
          </div>
        </div>

        {/* Vector Logo Download */}
        <div className="pt-1">
          <a
            href="/seia_logo.svg"
            download="SEIA_Security_Logo.svg"
            className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold backdrop-blur-md transition-all active:scale-98 group"
          >
            <Download className="w-3.5 h-3.5 text-cyan-200 group-hover:translate-y-0.5 transition-transform" />
            <span>Download Official Vector Logo (.SVG)</span>
          </a>
        </div>
      </div>

      {/* Quick Document Action Buttons */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1">
          Quick Action - Create New Document
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          {/* New Invoice */}
          <button
            onClick={() => onStartDoc('INV')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md text-center transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Invoice</span>
            <span className="text-[10px] text-indigo-600 font-semibold mt-0.5">INV-2026</span>
          </button>

          {/* New Quotation */}
          <button
            onClick={() => onStartDoc('QTN')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-cyan-200 hover:shadow-md text-center transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-1.5 group-hover:bg-cyan-600 group-hover:text-white transition-all">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Quotation</span>
            <span className="text-[10px] text-cyan-600 font-semibold mt-0.5">QTN-2026</span>
          </button>

          {/* New Receipt */}
          <button
            onClick={() => onStartDoc('RCP')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md text-center transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Receipt</span>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">RCP-2026</span>
          </button>
        </div>
      </div>

      {/* System Endpoint Status Card */}
      <div className="rounded-3xl bg-white border border-slate-100 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-indigo-600" />
            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">
              API Endpoint Status
            </h3>
          </div>

          <button
            onClick={testEndpoint}
            disabled={pingStatus === 'testing'}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 transition-all border border-slate-200"
          >
            <RefreshCw className={`w-3 h-3 ${pingStatus === 'testing' ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{pingStatus === 'testing' ? 'Checking...' : 'Check Status'}</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]">
            <span className="text-slate-700 truncate max-w-[210px] font-semibold">
              POST {settings.baseUrl}/generate/invoices
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          </div>

          <div className="flex items-center justify-between text-slate-600 pt-0.5">
            <div className="flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-semibold text-[11px]">Auth Header:</span>
            </div>
            <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/80 font-bold">
              X-API-Key: {settings.apiKey ? '••••••••' : 'None'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 text-[11px]">
            <span className="font-semibold">Microservice Status:</span>
            {pingStatus === 'online' ? (
              <div className="flex items-center space-x-1 text-emerald-600 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Microservice Active</span>
              </div>
            ) : pingStatus === 'offline' ? (
              <div className="flex items-center space-x-1 text-rose-600 font-bold text-[11px]">
                <XCircle className="w-3.5 h-3.5" />
                <span>Unreachable</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-indigo-600 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Connected & Ready</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
