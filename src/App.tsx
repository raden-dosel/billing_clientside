import React, { useState, useEffect } from 'react';
import { TabType, BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DocumentFormView } from './components/DocumentFormView';
import { PdfPreviewView } from './components/PdfPreviewView';
import { SettingsModal } from './components/SettingsModal';
import { DocType, DocumentData, AppSettings, GeneratedPdfInfo } from './types';
import { fetchMicroservicePdf } from './services/pdfGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedDocType, setSelectedDocType] = useState<DocType>('INV');
  const [showSettings, setShowSettings] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // App Settings saved in LocalStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedBaseUrl = localStorage.getItem('seia_api_base_url');
    const savedApiKey = localStorage.getItem('seia_api_key');
    return {
      baseUrl: savedBaseUrl || 'https://pdfbuilder-2w8u.onrender.com/api/v1',
      apiKey: savedApiKey || 'TrrECb181CEcLjoVawVZYRJEuwsq0FDj',
    };
  });

  // Current Generated PDF preview state
  const [generatedPdf, setGeneratedPdf] = useState<GeneratedPdfInfo | null>(null);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('seia_api_base_url', newSettings.baseUrl);
    localStorage.setItem('seia_api_key', newSettings.apiKey);
  };

  const handleStartDoc = (docType: DocType) => {
    setSelectedDocType(docType);
    setApiError(null);
    setActiveTab('builder');
  };

  const handleGeneratePdf = async (docData: DocumentData) => {
    setApiError(null);
    try {
      // Pull generated PDF from microservice API
      const pdfResult = await fetchMicroservicePdf(docData, settings);
      setGeneratedPdf(pdfResult);
      setActiveTab('preview');
    } catch (err: any) {
      const msg = err.message || 'Failed to pull generated PDF from microservice';
      setApiError(msg);
      throw err; // Re-throw so DocumentFormView knows generation stopped
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-800 flex items-center justify-center sm:p-6 font-sans">
      {/* Outer Container: Smartphone Frame on Desktop (>640px), Native Full-Screen on Mobile (<=640px) */}
      <div className="w-full sm:w-[380px] sm:h-[820px] bg-slate-50 sm:rounded-[44px] sm:border-[10px] sm:border-slate-800 sm:shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Smartphone Notch Cutout (Desktop Only) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-800 rounded-b-2xl z-30 pointer-events-none" />

        {/* Top Header & App Bar */}
        <Header
          onOpenSettings={() => setShowSettings(true)}
          isMobileDevice={false}
        />

        {/* Scrollable Viewport Canvas */}
        <main className="flex-1 overflow-y-auto px-5 pt-3 pb-3 scrollbar-none space-y-4">
          {activeTab === 'dashboard' && (
            <DashboardView
              onStartDoc={handleStartDoc}
              settings={settings}
            />
          )}

          {activeTab === 'builder' && (
            <DocumentFormView
              initialDocType={selectedDocType}
              onGeneratePdf={handleGeneratePdf}
              settings={settings}
            />
          )}

          {activeTab === 'preview' && (
            <PdfPreviewView
              pdfInfo={generatedPdf}
              onCreateNewDoc={() => setActiveTab('builder')}
            />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasPreviewDoc={!!generatedPdf}
        />

        {/* Smartphone Home Bar Indicator (Desktop Frame) */}
        <div className="hidden sm:block py-1.5 bg-white border-t border-slate-100 flex justify-center">
          <div className="w-24 h-1 bg-slate-900/10 rounded-full" />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
