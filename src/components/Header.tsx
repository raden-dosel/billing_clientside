import React from 'react';
import { Settings, ShieldCheck, Wifi, BatteryCharging } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  isMobileDevice: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="w-full bg-slate-50 border-b border-slate-100 text-slate-900 select-none">
      {/* Smartphone Status Bar */}
      <div className="flex h-6 w-full items-center justify-between px-6 pt-3 text-[10px] font-bold text-slate-900">
        <span>9:41</span>
        <div className="flex items-center space-x-1.5">
          <Wifi className="w-3.5 h-3.5 text-slate-700" />
          <span className="text-[10px] font-bold text-slate-800">5G</span>
          <BatteryCharging className="w-4 h-4 text-emerald-600" />
        </div>
      </div>

      {/* Main App Bar */}
      <div className="mt-2 flex items-center justify-between px-5 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gray-800 border border-slate-800 p-0.5 flex items-center justify-center shadow-md shrink-0">
            <img
              src="/seia_logo.svg"
              alt="SEIA Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-none">
                SEIA Mobile Billing
              </h1>
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">
              Security System Services
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="rounded-full bg-slate-200/80 p-2 text-slate-600 hover:bg-slate-300 transition-all active:scale-95"
          title="API & System Settings"
        >
          <Settings className="w-4 h-4 text-slate-700" />
        </button>
      </div>
    </header>
  );
};
