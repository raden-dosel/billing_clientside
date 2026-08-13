import React, { useState, useEffect } from 'react';
import { DocType, DocumentData, MaterialItem, LaborItem, AppSettings } from '../types';
import { SECURITY_PRESETS } from '../data/presets';
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  User,
  MapPin,
  Mail,
  Phone,
  Building,
  Banknote,
  Loader2,
  Send,
  AlertCircle
} from 'lucide-react';

interface DocumentFormViewProps {
  initialDocType?: DocType;
  onGeneratePdf: (docData: DocumentData) => Promise<void>;
  settings: AppSettings;
}

export const DocumentFormView: React.FC<DocumentFormViewProps> = ({
  initialDocType = 'INV',
  onGeneratePdf,
}) => {
  const [docType, setDocType] = useState<DocType>(initialDocType);
  const [docRefId, setDocRefId] = useState('');
  const [issueDate, setIssueDate] = useState('');

  // Sender details (Read only as per spec)
  const sender = {
    name: 'SEIA Security System Services',
    address: '114 Dahlia St., Diliman, Quezon City',
    email: 'sherwinmadrid210@gmail.com',
    contact: '+63 977 015 9162',
  };

  // Recipient details (User input) - Blank by default
  const [recipient, setRecipient] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
  });

  const [projectTitle, setProjectTitle] = useState('');

  // Selected Preset ID
  const [selectedPresetId, setSelectedPresetId] = useState<string>('electric_fence');

  // Dynamic Item Lists
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [labor, setLabor] = useState<LaborItem[]>([]);

  // Financial Totals
  const [materialsTotal, setMaterialsTotal] = useState<number>(0);
  const [laborTotal, setLaborTotal] = useState<number>(0);

  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Generate Reference ID based on docType
  const generateRefId = (type: DocType) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    return `${type}-${year}-${randomNum}`;
  };

  // Auto initialize Ref ID and Preset on load
  useEffect(() => {
    setDocRefId(generateRefId(docType));
    const today = new Date().toISOString().split('T')[0];
    setIssueDate(today);

    // Default to Electric Fence preset
    applyPreset('electric_fence');
  }, [docType]);

  // Apply Security Preset
  const applyPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom') return;

    const preset = SECURITY_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setMaterials(
      preset.materials.map((m, idx) => ({
        id: `mat-${Date.now()}-${idx}`,
        description: m.description,
        quantity: m.quantity,
      }))
    );

    setLabor(
      preset.labor.map((l, idx) => ({
        id: `lab-${Date.now()}-${idx}`,
        description: l.description,
        quantity: l.quantity,
      }))
    );

    setMaterialsTotal(preset.materialsTotal);
    setLaborTotal(preset.laborTotal);
  };

  // Add Item Handlers
  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        id: `mat-${Date.now()}`,
        description: 'New Security Equipment Item',
        quantity: '1 Unit',
      },
    ]);
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const updateMaterial = (id: string, field: 'description' | 'quantity', value: string) => {
    setMaterials(
      materials.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const addLabor = () => {
    setLabor([
      ...labor,
      {
        id: `lab-${Date.now()}`,
        description: 'Installation & Technical Work',
        quantity: '1 Worker / 1 Day',
      },
    ]);
  };

  const removeLabor = (id: string) => {
    setLabor(labor.filter((l) => l.id !== id));
  };

  const updateLabor = (id: string, field: 'description' | 'quantity', value: string) => {
    setLabor(
      labor.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  // Computed Grand Total
  const grandTotal = (Number(materialsTotal) || 0) + (Number(laborTotal) || 0);

  // Validate & Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!recipient.name.trim()) newErrors.recipientName = 'Recipient Name is required';
    if (!recipient.address.trim()) newErrors.recipientAddress = 'Recipient Address is required';
    if (materials.length === 0) newErrors.materials = 'At least 1 material item required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiErrorMessage(null);
    setIsGenerating(true);

    const docData: DocumentData = {
      docType,
      docRefId,
      issueDate,
      sender,
      recipient,
      projectTitle,
      materials,
      labor,
      materialsTotal: Number(materialsTotal) || 0,
      laborTotal: Number(laborTotal) || 0,
      grandTotal,
    };

    try {
      await onGeneratePdf(docData);
    } catch (err: any) {
      setApiErrorMessage(err.message || 'Microservice failed to generate PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-6 text-xs">
      {/* Microservice API Error Banner */}
      {apiErrorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 space-y-1.5 text-rose-900 shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>PDF Generation Error</span>
          </div>
          <p className="text-[11px] text-rose-800 font-medium leading-relaxed">
            {apiErrorMessage}
          </p>
          <p className="text-[10px] text-rose-600 font-semibold">
            Tip: Verify your Base URL and X-API-Key in System Configuration (Settings icon top right).
          </p>
        </div>
      )}
      {/* Document Header Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Document Type
          </span>
          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/80">
            {docRefId}
          </span>
        </div>

        {/* Type Radio Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          {(['INV', 'QTN', 'RCP'] as DocType[]).map((type) => {
            const labelMap = { INV: 'Invoice', QTN: 'Quotation', RCP: 'Receipt' };
            const isActive = docType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => setDocType(type)}
                className={`py-2 px-3 rounded-lg font-bold text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {labelMap[type]}
              </button>
            );
          })}
        </div>

        {/* Issue Date Picker */}
        <div className="flex items-center justify-between pt-1">
          <label className="text-slate-600 font-semibold text-xs">Issue Date:</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 font-mono font-bold focus:border-indigo-500 focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Sender Details Card (Read-Only) */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-2 shadow-sm">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-[11px] uppercase tracking-wider">
          <Building className="w-4 h-4" />
          <span>Issuer / Sender Details (SEIA Security)</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-slate-700 space-y-2 font-sans text-xs">
          <div className="font-bold text-slate-900 text-sm">{sender.name}</div>
          <div className="text-slate-600 flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>{sender.address}</span>
          </div>
          <div className="text-slate-600 flex items-center space-x-2">
            <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>{sender.email}</span>
          </div>
          <div className="text-slate-600 flex items-center space-x-2 font-mono font-medium">
            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{sender.contact}</span>
          </div>
        </div>
      </div>

      {/* Recipient Details Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-[11px] uppercase tracking-wider">
          <User className="w-4 h-4" />
          <span>Recipient / Client Information (Required)</span>
        </div>

        <div className="space-y-2.5">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Client / Recipient Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={recipient.name}
              onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
              placeholder="Full Client Name or Corporate Entity"
              className={`w-full bg-slate-50 border ${
                errors.recipientName ? 'border-rose-500' : 'border-slate-200'
              } rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-colors font-medium`}
            />
            {errors.recipientName && (
              <span className="text-rose-500 text-[10px] mt-0.5 block font-semibold">{errors.recipientName}</span>
            )}
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Recipient Billing Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={recipient.address}
              onChange={(e) => setRecipient({ ...recipient, address: e.target.value })}
              placeholder="Street, City, Province / Zip Code"
              className={`w-full bg-slate-50 border ${
                errors.recipientAddress ? 'border-rose-500' : 'border-slate-200'
              } rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-colors font-medium`}
            />
            {errors.recipientAddress && (
              <span className="text-rose-500 text-[10px] mt-0.5 block font-semibold">{errors.recipientAddress}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email</label>
              <input
                type="email"
                value={recipient.email}
                onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
                placeholder="client@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Phone</label>
              <input
                type="tel"
                value={recipient.phone}
                onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
                placeholder="+63 917 000 0000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project Title & Security Preset Quick Selector */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-[11px] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>Security Preset & Project Scope</span>
          </div>
        </div>

        <div>
          <label className="block text-slate-600 font-semibold mb-1">
            Security Preset Quick-Selector:
          </label>
          <select
            value={selectedPresetId}
            onChange={(e) => applyPreset(e.target.value)}
            className="w-full bg-slate-50 border border-indigo-200 text-indigo-900 rounded-xl px-3 py-2.5 font-bold outline-none focus:border-indigo-500 focus:bg-white"
          >
            {SECURITY_PRESETS.map((p) => (
              <option key={p.id} value={p.id} className="bg-white text-slate-900">
                {p.name}
              </option>
            ))}
            <option value="custom" className="bg-white text-slate-900">
              ⚙️ Custom Blank Template
            </option>
          </select>
        </div>

        <div>
          <label className="block text-slate-600 font-semibold mb-1">Project Title / Scope:</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="e.g. CCTV & Electric Fence Security Installation"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Dynamic Main Materials List */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Main Materials List ({materials.length})
          </h3>

          <button
            type="button"
            onClick={addMaterial}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Material</span>
          </button>
        </div>

        {errors.materials && (
          <span className="text-rose-500 text-[10px] block font-semibold">{errors.materials}</span>
        )}

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {materials.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80"
            >
              <span className="text-slate-400 font-mono text-[10px] w-4 shrink-0 text-center font-bold">
                {idx + 1}
              </span>

              <input
                type="text"
                value={item.description}
                onChange={(e) => updateMaterial(item.id, 'description', e.target.value)}
                placeholder="Item Description"
                className="flex-1 bg-transparent text-slate-900 font-semibold text-xs outline-none focus:text-indigo-600"
              />

              <input
                type="text"
                value={item.quantity}
                onChange={(e) => updateMaterial(item.id, 'quantity', e.target.value)}
                placeholder="Qty (e.g. 1 Unit)"
                className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-center text-xs font-mono font-semibold outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={() => removeMaterial(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Labor & Other Services List */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Labor & Other Services ({labor.length})
          </h3>

          <button
            type="button"
            onClick={addLabor}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Labor</span>
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {labor.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80"
            >
              <span className="text-slate-400 font-mono text-[10px] w-4 shrink-0 text-center font-bold">
                {idx + 1}
              </span>

              <input
                type="text"
                value={item.description}
                onChange={(e) => updateLabor(item.id, 'description', e.target.value)}
                placeholder="Labor Description"
                className="flex-1 bg-transparent text-slate-900 font-semibold text-xs outline-none focus:text-indigo-600"
              />

              <input
                type="text"
                value={item.quantity}
                onChange={(e) => updateLabor(item.id, 'quantity', e.target.value)}
                placeholder="Qty (e.g. 2 Crew / 3 Days)"
                className="w-28 bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-center text-xs font-mono font-semibold outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={() => removeLabor(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Calculation Engine */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-800/80 rounded-2xl p-4 space-y-3 shadow-lg text-white">
        <div className="flex items-center space-x-2 text-indigo-200 font-bold text-[11px] uppercase tracking-wider">
          <Banknote className="w-4 h-4 text-emerald-400" />
          <span>Financial Breakdown Engine (PHP ₱)</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 text-[11px] font-medium mb-1">Materials Total (₱)</label>
            <input
              type="number"
              step="0.01"
              value={materialsTotal}
              onChange={(e) => setMaterialsTotal(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900/90 border border-indigo-700/60 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-[11px] font-medium mb-1">Labor Total (₱)</label>
            <input
              type="number"
              step="0.01"
              value={laborTotal}
              onChange={(e) => setLaborTotal(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900/90 border border-indigo-700/60 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-indigo-800/80 flex items-center justify-between">
          <span className="font-bold text-indigo-200 uppercase tracking-wider text-xs">
            Calculated Grand Total:
          </span>
          <span className="text-xl font-extrabold font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-xl border border-cyan-700">
            ₱{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Generate & Send PDF Button */}
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full flex items-center justify-center space-x-2 py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-98 disabled:opacity-70 cursor-pointer"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating High-Res PDF...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Generate & Send PDF Document</span>
          </>
        )}
      </button>
    </form>
  );
};
