import React, { useState, useRef } from 'react';
import { 
  Bot, 
  Upload, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Laptop, 
  Monitor, 
  Smartphone, 
  Printer, 
  HelpCircle,
  Eye,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { Category, Priority, DeviceType } from '../types/helpdesk';
import { analyzeScreenshotFilename, VisionAnalysisResult } from '../services/visionDemo';

interface ReportProblemPageProps {
  onNavigate: (path: string) => void;
}

export const ReportProblemPage: React.FC<ReportProblemPageProps> = ({ onNavigate }) => {
  const { createTicket } = useTickets();

  const [description, setDescription] = useState('');
  const [device, setDevice] = useState<DeviceType>('laptop');
  const [category, setCategory] = useState<Category | 'detect'>('detect');
  const [priority, setPriority] = useState<Priority | 'detect'>('detect');

  // Screenshot upload state
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<VisionAnalysisResult | null>(null);
  const [isAnalyzingVision, setIsAnalyzingVision] = useState(false);

  // Form error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a supported image file (.png, .jpg, .jpeg, .webp).');
      return;
    }

    setErrorMessage(null);
    setScreenshotFile(file);
    setVisionResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setScreenshotPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setVisionResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeScreenshot = () => {
    if (!screenshotFile) return;
    setIsAnalyzingVision(true);

    setTimeout(() => {
      const result = analyzeScreenshotFilename(screenshotFile.name);
      setVisionResult(result);
      setIsAnalyzingVision(false);

      // Auto-populate description if currently empty and recognized
      if (!description.trim() && result.suggestedIssue) {
        setDescription(`Observed screenshot error: ${result.suggestedIssue} - ${result.detectedText || ''}`);
      }
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      setErrorMessage('Please describe your problem before continuing.');
      return;
    }

    setErrorMessage(null);

    const newTicket = await createTicket({
      description: description.trim(),
      device,
      category,
      priority,
      screenshotName: screenshotFile?.name,
      screenshotUrl: screenshotPreview || undefined,
      visionAnalysis: visionResult ? JSON.stringify(visionResult) : undefined
    });

    onNavigate(`/diagnosis/${newTicket.id}`);
  };

  const setSampleProblem = (sampleDesc: string, sampleDevice: DeviceType) => {
    setDescription(sampleDesc);
    setDevice(sampleDevice);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Report an IT Problem
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tell us what is happening in normal words. You don't need to know technical terms.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Problem Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Problem Description <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Natural language input</span>
            </div>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Example: My laptop suddenly became very slow and applications take a long time to open, or Wi-Fi is connected but websites won't load."
              className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-slate-400"
            />

            {/* Quick Demo Fill Buttons */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="font-medium flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                Quick test templates:
              </span>
              <button
                type="button"
                onClick={() => setSampleProblem("My laptop is connected to Wi-Fi but I can't access any websites.", 'laptop')}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
              >
                Wi-Fi no internet
              </button>
              <button
                type="button"
                onClick={() => setSampleProblem("Printer is showing offline and 3 print jobs are stuck in queue.", 'printer')}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
              >
                Printer stuck
              </button>
              <button
                type="button"
                onClick={() => setSampleProblem("Getting blue screen crash STOP CODE 0x0000003B when launching heavy software.", 'desktop')}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
              >
                Blue screen BSOD
              </button>
            </div>
          </div>

          {/* Form Selectors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Device */}
            <div>
              <label htmlFor="device" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Device Type
              </label>
              <select
                id="device"
                value={device}
                onChange={(e) => setDevice(e.target.value as DeviceType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="laptop">Laptop</option>
                <option value="desktop">Desktop Workstation</option>
                <option value="mobile">Mobile / Tablet</option>
                <option value="printer">Network Printer</option>
                <option value="other">Other Peripheral</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category | 'detect')}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="detect">✨ Let AI detect</option>
                <option value="network">Network & Wi-Fi</option>
                <option value="performance">Performance & Lag</option>
                <option value="account">Account & Access</option>
                <option value="hardware">Hardware & Peripherals</option>
                <option value="software">Software & Applications</option>
                <option value="security">Security & Compliance</option>
                <option value="other">Other / Unsure</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Urgency Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority | 'detect')}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="detect">✨ Let AI compute</option>
                <option value="low">Low (Minor inconvenience)</option>
                <option value="medium">Medium (Impacting workflow)</option>
                <option value="high">High (Cannot perform duties)</option>
                <option value="critical">Critical (Company-wide outage)</option>
              </select>
            </div>
          </div>

          {/* SCREENSHOT / VISION DEMO UPLOAD */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Attach Error Screenshot (Optional)
            </label>

            {!screenshotPreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-primary/50 bg-slate-50/50 hover:bg-blue-50/30 rounded-2xl p-6 text-center cursor-pointer transition-colors group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-primary mx-auto flex items-center justify-center mb-2 transition-colors shadow-2xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  Click to upload a screenshot or error photo
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports PNG, JPG, JPEG, WEBP. Demo simulator identifies keywords (e.g. blue_screen.png, wifi_error.png).
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-primary rounded-xl">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {screenshotFile?.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {(screenshotFile?.size ? (screenshotFile.size / 1024).toFixed(1) : '0')} KB • Screenshot attached
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!visionResult && (
                      <button
                        type="button"
                        onClick={handleAnalyzeScreenshot}
                        disabled={isAnalyzingVision}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isAnalyzingVision ? 'Inspecting image...' : 'Analyze Screenshot'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveScreenshot}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      aria-label="Remove screenshot"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Image Preview Thumbnail */}
                <div className="max-h-48 overflow-hidden rounded-xl border border-slate-200 bg-black/5 flex items-center justify-center">
                  <img
                    src={screenshotPreview}
                    alt="Error Screenshot Preview"
                    className="max-h-48 w-auto object-contain"
                  />
                </div>

                {/* Vision Result Banner */}
                {visionResult && (
                  <div className={`p-3.5 rounded-xl border text-xs animate-in fade-in ${
                    visionResult.isRecognized
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}>
                    <div className="flex items-start gap-2">
                      {visionResult.isRecognized ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <div className="font-bold">
                          {visionResult.isRecognized
                            ? `Vision Demo Analysis (${visionResult.confidence}% match)`
                            : 'AI Vision Analysis Mode'}
                        </div>
                        <p className="leading-relaxed opacity-90">
                          {visionResult.message}
                        </p>
                        {visionResult.detectedText && (
                          <div className="mt-1 font-mono text-[11px] bg-white/70 p-1.5 rounded border border-emerald-200/60">
                            <strong>Extracted Text:</strong> {visionResult.detectedText}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submission CTA */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-subtle hover:shadow-primary/25 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Analyze with AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
