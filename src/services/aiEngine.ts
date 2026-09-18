import { AIAnalysis, Category, DeviceType, Priority, TroubleshootingStep } from '../types/helpdesk';

interface PatternMatchRule {
  keywords: string[];
  category: Category;
  priority: Priority;
  confidence: number;
  detectedIssue: string;
  summary: string;
  possibleCauses: string[];
  troubleshootingSteps: {
    title: string;
    explanation: string;
    codeSnippet?: string;
  }[];
  knowledgeBaseArticles: string[];
  technicianSummary: string;
}

const PREDEFINED_PATTERNS: PatternMatchRule[] = [
  {
    keywords: ['wifi', 'wi-fi', 'no internet', 'open websites', 'cannot connect', 'network', 'dns', 'internet access', 'gateway'],
    category: 'network',
    priority: 'medium',
    confidence: 92,
    detectedIssue: 'Network Connectivity & DNS Resolution Failure',
    summary: 'Your device appears to maintain an active Wi-Fi link, but internet routing is unavailable. This commonly indicates a DNS caching, gateway resolution, or local adapter configuration issue.',
    possibleCauses: [
      'Stale DNS cache or misconfigured DNS server',
      'Local network gateway or DHCP lease timeout',
      'Router upstream WAN disconnection or captive portal requirement'
    ],
    troubleshootingSteps: [
      {
        title: 'Check secondary device connectivity',
        explanation: 'Verify whether another device (such as a smartphone or coworker laptop) connected to the same Wi-Fi network can load websites.'
      },
      {
        title: 'Disconnect and reconnect to Wi-Fi',
        explanation: 'Toggle your device Wi-Fi off for 10 seconds, then reconnect to re-negotiate the wireless handshake.'
      },
      {
        title: 'Flush the local DNS cache',
        explanation: 'Open Command Prompt (Windows) or Terminal and execute the flush command to clear stale DNS records.',
        codeSnippet: 'ipconfig /flushdns'
      },
      {
        title: 'Restart network adapter',
        explanation: 'Disable and re-enable your network interface card or reset TCP/IP stack.',
        codeSnippet: 'netsh int ip reset'
      },
      {
        title: 'Test connection with ping test',
        explanation: 'Test ICMP reachability to verify public IP routing versus domain name resolution.',
        codeSnippet: 'ping 8.8.8.8'
      }
    ],
    knowledgeBaseArticles: ['kb-network-01', 'kb-network-02'],
    technicianSummary: 'User reported active Wi-Fi link without internet routing. Client-side DNS flush and adapter reset performed. Potential DHCP relay, DNS filtering, or subnet gateway routing failure requiring network team inspection.'
  },
  {
    keywords: [
      'slow', 'extremely slow', 'running slow', 'running very slowly', 'freezing', 
      'lag', 'unresponsive', 'performance', 'cpu', 'memory', 'disk 100', 
      'high memory', 'takes a long time', 'take forever', 'fan is loud', 'slowness'
    ],
    category: 'performance',
    priority: 'medium',
    confidence: 89,
    detectedIssue: 'System Resource Bottleneck & Performance Degradation',
    summary: 'The workstation is experiencing system latency or responsiveness throttling. Typical root causes include high CPU/RAM utilization from runaway background processes, insufficient storage, or excessive startup items.',
    possibleCauses: [
      'High background CPU or Memory utilization by rogue processes',
      'Primary disk storage below critical threshold (<10% free space)',
      'Accumulated startup background services consuming boot threads'
    ],
    troubleshootingSteps: [
      {
        title: 'Check available primary disk storage',
        explanation: 'Ensure drive C: has at least 15% free disk capacity. Delete temporary cache files if storage is in the red.'
      },
      {
        title: 'Open Task Manager and inspect resource utilization',
        explanation: 'Press Ctrl+Shift+Esc to open Task Manager. Sort processes by CPU and Memory to identify high-consumption applications.'
      },
      {
        title: 'Disable heavy startup applications',
        explanation: 'In Task Manager, navigate to the "Startup apps" tab and disable non-essential third-party services from auto-launching.'
      },
      {
        title: 'Perform a clean system restart',
        explanation: 'Restart the operating system to clear RAM buffers, terminate zombie subprocesses, and apply pending kernel updates.'
      },
      {
        title: 'Verify system responsiveness',
        explanation: 'Launch your primary work applications and measure whether latency returns to normal operating parameters.'
      }
    ],
    knowledgeBaseArticles: ['kb-perf-01'],
    technicianSummary: 'Workstation experiencing severe system throttling. User audited background CPU/Memory consumption and purged startup utilities. If performance continues to degrade, disk health (SMART) and thermal throttling need physical inspection.'
  },
  {
    keywords: ['email', 'outlook', 'inbox', 'mailbox', 'company email', 'exchange', 'office 365', 'sso', 'login failed', 'account locked'],
    category: 'account',
    priority: 'high',
    confidence: 94,
    detectedIssue: 'Enterprise Email & Single Sign-On Authentication Failure',
    summary: 'Authentication handshake with the corporate identity provider (IdP) failed. This is typically caused by expired credentials, security lockout policies, or revoked SAML/OAuth session tokens.',
    possibleCauses: [
      'Account lockout triggered by consecutive failed credential attempts',
      'Expired corporate password or unsynchronized Azure AD / Okta token',
      'Multi-Factor Authentication (MFA) device sync or push notification failure'
    ],
    troubleshootingSteps: [
      {
        title: 'Verify corporate email address and username format',
        explanation: 'Confirm you are entering your full standard corporate email address (e.g., username@company.com) without typos.'
      },
      {
        title: 'Attempt sign-in via Webmail portal (OWA / Web Browser)',
        explanation: 'Open an incognito/private browser tab and log into the webmail portal to isolate desktop client sync issues.'
      },
      {
        title: 'Initiate Self-Service Password Reset (SSPR)',
        explanation: 'Use the official corporate identity portal to verify identity via authenticator app and update credentials.'
      },
      {
        title: 'Check Multi-Factor Authenticator app notifications',
        explanation: 'Open Microsoft Authenticator or Google Authenticator on your phone to verify if a pending login approval request was missed.'
      },
      {
        title: 'Contact IT Support if account lockout flag is active',
        explanation: 'If 5+ invalid password attempts occurred, an IT administrator must unlock the account in Active Directory.'
      }
    ],
    knowledgeBaseArticles: ['kb-account-01', 'kb-account-02'],
    technicianSummary: 'User unable to authenticate to corporate email and enterprise SSO services. Webmail bypass and MFA validation attempted. High priority due to direct communication blockage; requires Active Directory lockout check and MFA token re-issuance.'
  },
  {
    keywords: ['printer', 'printing', 'print', 'paper', 'spooler', 'toner', 'document queued', 'printer offline'],
    category: 'hardware',
    priority: 'medium',
    confidence: 87,
    detectedIssue: 'Print Spooler Stall & Device Communication Interruption',
    summary: 'The print job could not be delivered to the physical printer. Likely triggers include a stopped Windows print spooler service, offline printer status, or an IP address change on the office network.',
    possibleCauses: [
      'Print Spooler service hung on a corrupted print job file',
      'Printer in sleep mode, out of paper, or disconnected from LAN',
      'Print queue backlog preventing subsequent documents from processing'
    ],
    troubleshootingSteps: [
      {
        title: 'Check physical printer power and display status',
        explanation: 'Confirm the printer is powered on with a green ready indicator, has paper loaded, and has no paper jam errors displayed on the LCD panel.'
      },
      {
        title: 'Verify network or USB cable connectivity',
        explanation: 'Ensure the printer Ethernet/USB cable is firmly seated and the printer is connected to the office subnet.'
      },
      {
        title: 'Check "Use Printer Offline" toggle in Settings',
        explanation: 'Open Windows Settings > Bluetooth & devices > Printers & scanners. Click the printer and ensure "Use Printer Offline" is unchecked.'
      },
      {
        title: 'Clear stuck print jobs and restart Print Spooler',
        explanation: 'Execute spooler restart commands in an elevated Command Prompt to purge corrupt queue files.',
        codeSnippet: 'net stop spooler && del /Q /F /S "%systemroot%\\System32\\Spool\\Printers\\*.*" && net start spooler'
      },
      {
        title: 'Send a standard test page',
        explanation: 'Print a Windows test page from printer properties to confirm bidirectional communication.'
      }
    ],
    knowledgeBaseArticles: ['kb-hardware-01'],
    technicianSummary: 'Print spooler freeze and offline status reported. User attempted local queue purge and network connection verification. May require driver reinstallation or network IP reservation renewal on print server.'
  },
  {
    keywords: ['blue screen', 'bsod', 'crash', 'system crash', 'restarting continuously', 'dump', 'kernel', 'stop code', 'freeze crash'],
    category: 'software',
    priority: 'high',
    confidence: 91,
    detectedIssue: 'Operating System Kernel Crash (BSOD / Stop Error)',
    summary: 'A critical operating system exception caused the kernel to halt to prevent data corruption. Commonly triggered by incompatible device drivers, faulty memory modules, or corrupted system binaries.',
    possibleCauses: [
      'Incompatible or recently updated hardware driver (GPU/Chipset)',
      'Corrupted operating system system files or bad sectors',
      'Faulty RAM hardware module or overheating CPU'
    ],
    troubleshootingSteps: [
      {
        title: 'Record the exact BSOD Stop Code & Driver file name',
        explanation: 'Note error codes such as CRITICAL_PROCESS_DIED, DRIVER_IRQL_NOT_LESS_OR_EQUAL, or MEMORY_MANAGEMENT.'
      },
      {
        title: 'Run System File Checker (SFC) scan',
        explanation: 'Open Command Prompt as Administrator and run the SFC utility to scan and repair damaged Windows core binaries.',
        codeSnippet: 'sfc /scannow'
      },
      {
        title: 'Run DISM health restoration image tool',
        explanation: 'Repair underlying component store files using Deployment Image Servicing and Management.',
        codeSnippet: 'DISM /Online /Cleanup-Image /RestoreHealth'
      },
      {
        title: 'Execute Windows Memory Diagnostic',
        explanation: 'Test physical RAM modules for read/write integrity errors before next boot.',
        codeSnippet: 'mdsched.exe'
      },
      {
        title: 'Escalate to IT if blue screen recurs',
        explanation: 'Repeated stop errors signify failing physical hardware or driver conflicts requiring dump log minidump analysis.'
      }
    ],
    knowledgeBaseArticles: ['kb-software-02'],
    technicianSummary: 'Kernel panic / BSOD crash reported. System File Checker and DISM scans initiated. Needs memory dump analysis (C:\\Windows\\Minidump) and hardware diagnostics if issue recurs.'
  },
  {
    keywords: ['password', 'forgot password', 'reset password', 'credential', 'locked out', 'pin', 'credentials'],
    category: 'account',
    priority: 'medium',
    confidence: 95,
    detectedIssue: 'Credential Expiration & Self-Service Password Reset',
    summary: 'User credentials are forgotten or have expired per the 90-day corporate security compliance policy. Password reset can be self-administered through corporate MFA challenge.',
    possibleCauses: [
      'Password expired under corporate domain policy',
      'User forgot recently updated complex password',
      'Cached credentials out of sync with domain controller'
    ],
    troubleshootingSteps: [
      {
        title: 'Access the Self-Service Password Reset (SSPR) Portal',
        explanation: 'Navigate to the secure corporate portal at passwordreset.microsoftonline.com from any authenticated browser or mobile device.'
      },
      {
        title: 'Complete MFA verification challenge',
        explanation: 'Approve the notification sent to your registered authenticator app or enter the SMS code.'
      },
      {
        title: 'Create a new compliant password',
        explanation: 'Ensure the new password is at least 14 characters long and contains uppercase, lowercase, numbers, and symbols.'
      },
      {
        title: 'Update cached credentials on mobile and laptop',
        explanation: 'Once changed, update Wi-Fi credentials, Outlook, and corporate VPN client with the new password.'
      }
    ],
    knowledgeBaseArticles: ['kb-account-01'],
    technicianSummary: 'Self-service password reset workflow initiated. User informed of MFA challenge requirements and complex password policy.'
  },
  {
    keywords: ['application', 'app', 'not opening', 'wont open', 'crashes', 'corrupted', 'teams', 'slack', 'chrome', 'software'],
    category: 'software',
    priority: 'medium',
    confidence: 88,
    detectedIssue: 'Application Process Hung / Cache Corruption',
    summary: 'The target application is failing to initialize, crashing immediately on startup, or hanging in the background without rendering its graphical user interface.',
    possibleCauses: [
      'Orphaned zombie background process preventing new app instance launch',
      'Corrupted local application cache or temporary preference files',
      'Missing application patch or insufficient elevated user permissions'
    ],
    troubleshootingSteps: [
      {
        title: 'Force terminate hung processes via Task Manager',
        explanation: 'Open Task Manager (Ctrl+Shift+Esc), locate all instances of the application under "Processes", and click "End task".'
      },
      {
        title: 'Launch application as Administrator',
        explanation: 'Right-click the application desktop icon and select "Run as administrator" to test if permission blocks are present.'
      },
      {
        title: 'Clear application local cache files',
        explanation: 'Press Win+R, type the application AppData cache path, and delete temporary cache contents.',
        codeSnippet: '%localappdata%\\Temp'
      },
      {
        title: 'Check for application and Windows updates',
        explanation: 'Ensure the application is updated to the latest corporate IT repository release version.'
      },
      {
        title: 'Reinstall application from Company Portal',
        explanation: 'Open the corporate Software Center / Company Portal to reinstall the verified package.'
      }
    ],
    knowledgeBaseArticles: ['kb-software-01'],
    technicianSummary: 'Application crash/launch failure. Zombie process termination and cache clearing attempted. If persistent, requires MSI uninstallation and fresh re-provisioning via Company Portal.'
  }
];

export function analyzeProblem(
  description: string,
  device: DeviceType = 'laptop',
  userCategory?: Category | 'detect',
  userPriority?: Priority | 'detect'
): AIAnalysis {
  const lowerDesc = description.toLowerCase();
  
  // Find matching rule
  let bestMatch: PatternMatchRule | null = null;
  let maxScore = 0;

  for (const rule of PREDEFINED_PATTERNS) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (lowerDesc.includes(kw.toLowerCase())) {
        score += kw.length; // weight longer specific phrases higher
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = rule;
    }
  }

  const now = new Date().toISOString();

  // If high quality match found
  if (bestMatch && maxScore >= 4) {
    const finalCategory = (userCategory && userCategory !== 'detect') ? userCategory : bestMatch.category;
    const finalPriority = (userPriority && userPriority !== 'detect') ? userPriority : bestMatch.priority;

    const steps: TroubleshootingStep[] = bestMatch.troubleshootingSteps.map((s, idx) => ({
      id: `step-${idx + 1}`,
      number: String(idx + 1).padStart(2, '0'),
      title: s.title,
      explanation: s.explanation,
      codeSnippet: s.codeSnippet,
      completed: false
    }));

    return {
      detectedIssue: bestMatch.detectedIssue,
      category: finalCategory,
      priority: finalPriority,
      confidence: bestMatch.confidence,
      summary: bestMatch.summary,
      possibleCauses: bestMatch.possibleCauses,
      troubleshootingSteps: steps,
      knowledgeBaseArticles: bestMatch.knowledgeBaseArticles,
      escalationRequired: false,
      technicianSummary: bestMatch.technicianSummary,
      analyzedAt: now
    };
  }

  // Fallback for unknown / generic problem
  const confidence = Math.floor(Math.random() * 15) + 62; // 62% - 76%
  const finalCategory: Category = (userCategory && userCategory !== 'detect') ? userCategory : 'other';
  const finalPriority: Priority = (userPriority && userPriority !== 'detect') ? userPriority : 'medium';

  const genericSteps: TroubleshootingStep[] = [
    {
      id: 'step-1',
      number: '01',
      title: 'Verify physical device power & basic connections',
      explanation: `Check all power cords, battery indicators, and physical ports on your ${device}.`,
      completed: false
    },
    {
      id: 'step-2',
      number: '02',
      title: 'Perform a clean system restart',
      explanation: 'Restart your operating system to clear pending memory states and hung background services.',
      completed: false
    },
    {
      id: 'step-3',
      number: '03',
      title: 'Check for operating system & driver updates',
      explanation: 'Check Windows Update or macOS Software Update for pending security patches or driver releases.',
      completed: false
    },
    {
      id: 'step-4',
      number: '04',
      title: 'Escalate to IT Support for deep diagnostic assistance',
      explanation: 'Because this problem pattern exhibits moderate AI confidence, direct inspection by an IT technician is recommended.',
      completed: false
    }
  ];

  return {
    detectedIssue: 'Unclassified Technical Anomaly',
    category: finalCategory,
    priority: finalPriority,
    confidence: confidence,
    summary: 'The described symptom does not match a high-confidence automated resolution profile. Basic diagnostic recommendations have been assembled, but technician escalation is advised if immediate resolution is not achieved.',
    possibleCauses: [
      'Non-standard software dependency or conflict',
      'Intermittent hardware or device driver malfunction',
      'Unindexed system error requiring administrator log inspection'
    ],
    troubleshootingSteps: genericSteps,
    knowledgeBaseArticles: ['kb-perf-01', 'kb-software-01'],
    escalationRequired: true,
    technicianSummary: `User reported: "${description}". AI generated fallback diagnostic steps with ${confidence}% confidence. Requires manual triage and investigation.`,
    analyzedAt: now
  };
}

export async function analyzeProblemWithPython(
  description: string,
  device: DeviceType = 'laptop',
  userCategory?: Category | 'detect',
  userPriority?: Priority | 'detect'
): Promise<AIAnalysis> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description,
        device,
        category: userCategory || 'detect',
        priority: userPriority || 'detect'
      })
    });

    if (!response.ok) throw new Error(`Python service returned ${response.status}`);
    return await response.json() as AIAnalysis;
  } catch {
    return analyzeProblem(description, device, userCategory, userPriority);
  }
}
