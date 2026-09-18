export interface VisionAnalysisResult {
  detectedText?: string;
  detectedVisualArtifact?: string;
  suggestedIssue?: string;
  confidence: number;
  message: string;
  isRecognized: boolean;
}

export function analyzeScreenshotFilename(fileName: string): VisionAnalysisResult {
  const lowerName = fileName.toLowerCase();

  if (lowerName.includes('blue') || lowerName.includes('bsod') || lowerName.includes('crash')) {
    return {
      detectedText: 'STOP CODE: 0x0000003B (SYSTEM_SERVICE_EXCEPTION)',
      detectedVisualArtifact: 'Windows Blue Screen of Death (BSOD) crash prompt',
      suggestedIssue: 'Operating System Kernel Crash',
      confidence: 91,
      message: 'Vision Demo Analyzer detected blue screen kernel stop code and memory fault signatures.',
      isRecognized: true
    };
  }

  if (lowerName.includes('wifi') || lowerName.includes('network') || lowerName.includes('internet')) {
    return {
      detectedText: 'Status: "No Internet, secured" - Connected to AP_Floor3_East',
      detectedVisualArtifact: 'Taskbar network tray icon showing exclamation mark',
      suggestedIssue: 'Network Connectivity / DNS Failure',
      confidence: 93,
      message: 'Vision Demo Analyzer detected disconnected network tray icon and gateway timeout indication.',
      isRecognized: true
    };
  }

  if (lowerName.includes('printer') || lowerName.includes('spooler')) {
    return {
      detectedText: 'Printer Status: "Offline - Error 0x00000709"',
      detectedVisualArtifact: 'Printer spooler queue with 3 stalled documents',
      suggestedIssue: 'Print Spooler Stall / Printer Offline',
      confidence: 88,
      message: 'Vision Demo Analyzer detected stalled print queue and offline hardware status.',
      isRecognized: true
    };
  }

  if (lowerName.includes('password') || lowerName.includes('lock') || lowerName.includes('auth')) {
    return {
      detectedText: 'Sign-in Error: "Your account has been locked. Contact your administrator."',
      detectedVisualArtifact: 'Enterprise SSO login lock screen dialog',
      suggestedIssue: 'Account Lockout / Credential Expiration',
      confidence: 96,
      message: 'Vision Demo Analyzer detected active directory account lockout modal.',
      isRecognized: true
    };
  }

  if (lowerName.includes('error')) {
    return {
      detectedText: 'Application Error: "Unhandled exception has occurred in your application."',
      detectedVisualArtifact: 'Modal error dialog with crash stack trace',
      suggestedIssue: 'Application Runtime Crash',
      confidence: 85,
      message: 'Vision Demo Analyzer detected runtime software exception dialog.',
      isRecognized: true
    };
  }

  return {
    confidence: 0,
    message: 'Screenshot received. AI vision analysis requires a configured vision model.',
    isRecognized: false
  };
}
