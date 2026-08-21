import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Settings, Server, Key, RotateCcw, Save, X, CheckCircle2 } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ baseUrl, apiKey });
    setShowSavedMsg(true);
    setTimeout(() => {
      setShowSavedMsg(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setBaseUrl('https://pdfbuilder-2w8u.onrender.com/api/v1');
    setApiKey('TrrECb181CEcLjoVawVZYRJEuwsq0FDj');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-2xl text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">System & API Configuration</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="flex items-center space-x-1.5 text-slate-700 font-semibold mb-1">
              <Server className="w-3.5 h-3.5 text-indigo-600" />
              <span>Base API URL Endpoint</span>
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://pdfbuilder-2w8u.onrender.com/api/v1"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs outline-none focus:border-indigo-500 focus:bg-white font-medium"
            />
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              Target REST server for document PDF generation requests.
            </p>
          </div>

          <div>
            <label className="flex items-center space-x-1.5 text-slate-700 font-semibold mb-1">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span>X-API-Key Secret Authorization Header</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="secret-billing-api-key"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs outline-none focus:border-indigo-500 focus:bg-white font-medium"
            />
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              Secret API key passed via X-API-Key request header.
            </p>
          </div>

          {showSavedMsg && (
            <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold justify-center py-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Configuration Saved!</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-100 active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
