import { Ticket, KnowledgeArticle, User } from '../types/helpdesk';
import { analyzeProblem } from './aiEngine';

const STORAGE_KEYS = {
  TICKETS: 'smart_helpdesk_tickets_v1',
  KB_ARTICLES: 'smart_helpdesk_kb_v1',
  CURRENT_USER: 'smart_helpdesk_user_v1',
};

export const DEMO_USERS: Record<'user' | 'technician', User> = {
  user: {
    id: 'usr-alex-morgan',
    name: 'Alex Morgan',
    email: 'alex@company.com',
    role: 'user',
    title: 'Product Marketing Manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  technician: {
    id: 'tech-priya-sharma',
    name: 'Priya Sharma',
    email: 'it.support@company.com',
    role: 'technician',
    title: 'Senior IT Systems Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
};

export const INITIAL_KB_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-network-01',
    title: 'Wi-Fi connected but no internet access',
    category: 'network',
    estimatedTime: '4 min',
    tags: ['wifi', 'dns', 'gateway', 'network', 'adapter'],
    symptoms: [
      'Connected to corporate or home Wi-Fi SSID with "No Internet" indicator',
      'Web browser displays DNS_PROBE_FINISHED_NO_INTERNET or Gateway Timeout',
      'Internal intranet pages load but external web domains fail'
    ],
    possibleCauses: [
      'Stale local DNS cache entries pointing to old IP addresses',
      'DHCP lease expiration or IP conflict on the subnet',
      'Captive portal login token expired or firewall block'
    ],
    solutionSteps: [
      {
        step: 1,
        title: 'Verify connection on secondary device',
        detail: 'Check if your mobile phone or another workstation on the same Wi-Fi can access google.com.'
      },
      {
        step: 2,
        title: 'Flush DNS and reset TCP/IP stack',
        detail: 'Open Command Prompt as Administrator and run the DNS cache purge command.',
        command: 'ipconfig /flushdns'
      },
      {
        step: 3,
        title: 'Renew DHCP lease',
        detail: 'Release and request a new dynamic IP address from the router.',
        command: 'ipconfig /release && ipconfig /renew'
      },
      {
        step: 4,
        title: 'Reset Network Interface Adapter',
        detail: 'Toggle Wi-Fi in Windows Settings or toggle airplane mode for 10 seconds.'
      }
    ],
    whenToContactIT: [
      'Other colleagues on the same office floor are also unable to access the internet',
      'The network adapter shows a yellow warning triangle in Device Manager',
      'IP address renew returns a 169.254.x.x link-local address'
    ]
  },
  {
    id: 'kb-perf-01',
    title: 'Laptop running slowly and high CPU usage',
    category: 'performance',
    estimatedTime: '6 min',
    tags: ['performance', 'cpu', 'memory', 'disk', 'task manager'],
    symptoms: [
      'Applications take 20+ seconds to respond or display "(Not Responding)"',
      'Laptop fan runs at maximum speed continuously',
      'Mouse cursor stutters or lags across multi-monitor setups'
    ],
    possibleCauses: [
      'High background memory leak in web browser tabs or background utilities',
      'Multiple heavy startup programs launching simultaneously at boot',
      'Hard drive capacity below 10% safety margin'
    ],
    solutionSteps: [
      {
        step: 1,
        title: 'Inspect Resource Monitors in Task Manager',
        detail: 'Press Ctrl+Shift+Esc, sort by CPU and Memory columns, and identify the highest resource consumer.'
      },
      {
        step: 2,
        title: 'Disable redundant Startup Applications',
        detail: 'Select the Startup tab in Task Manager and disable non-essential apps like Spotify, game clients, or updater daemons.'
      },
      {
        step: 3,
        title: 'Clear Temporary System & AppData Files',
        detail: 'Open the Run dialog (Win+R) and purge temporary cache storage.',
        command: 'cleanmgr'
      },
      {
        step: 4,
        title: 'Perform Full System Restart',
        detail: 'Select Start > Power > Restart (avoiding Fast Startup hybrid sleep).'
      }
    ],
    whenToContactIT: [
      'Storage drive reports SMART bad sectors or repetitive disk read errors',
      'System throttling persists even immediately after a fresh reboot',
      'Workstation requires a physical RAM expansion from 8GB to 16GB/32GB'
    ]
  },
  {
    id: 'kb-account-01',
    title: 'Resetting your corporate password via SSPR',
    category: 'account',
    estimatedTime: '3 min',
    tags: ['password', 'sso', 'mfa', 'azure ad', 'credentials'],
    symptoms: [
      'Prompted with "Incorrect Password" across Outlook, Teams, and VPN',
      'Notification that corporate password has expired (90-day cycle)',
      'Account temporarily locked out due to multiple invalid password attempts'
    ],
    possibleCauses: [
      'Domain security policy password expiration',
      'Cached old credentials in Windows Credential Manager attempting auto-login',
      'MFA security key desynchronization'
    ],
    solutionSteps: [
      {
        step: 1,
        title: 'Navigate to Self-Service Password Reset portal',
        detail: 'Visit passwordreset.microsoftonline.com on your phone browser or personal laptop.'
      },
      {
        step: 2,
        title: 'Pass Multi-Factor Authentication challenge',
        detail: 'Approve the two-digit matching number on your Microsoft Authenticator app.'
      },
      {
        step: 3,
        title: 'Construct a compliant passphrase',
        detail: 'Must be at least 14 characters, combining uppercase, lowercase, numbers, and special characters.'
      },
      {
        step: 4,
        title: 'Clear Stale Windows Credential Manager entries',
        detail: 'Open Windows Credential Manager and remove old cached MicrosoftOffice16 passwords.'
      }
    ],
    whenToContactIT: [
      'Authenticator app phone number is outdated and you are locked out of MFA',
      'Account status is set to Administrator Security Hold',
      'SSPR portal displays an error that your admin has disabled self-reset'
    ]
  },
  {
    id: 'kb-hardware-01',
    title: 'Printer not responding or stuck in print queue',
    category: 'hardware',
    estimatedTime: '5 min',
    tags: ['printer', 'hardware', 'print queue', 'spooler', 'paper jam'],
    symptoms: [
      'Documents sent to printer stay in "Printing" or "Error" queue indefinitely',
      'Printer status shows "Offline" in Windows Settings',
      'Printer displays blinking orange error LED or maintenance warning'
    ],
    possibleCauses: [
      'Corrupted spooler print queue file blocking all subsequent documents',
      'Printer lost static IP lease on the office subnet',
      'Out of paper, toner empty, or micro-paper jam inside feed rollers'
    ],
    solutionSteps: [
      {
        step: 1,
        title: 'Check physical printer hardware status',
        detail: 'Inspect the printer LCD tray for paper jam instructions, open and re-seat toner cartridges.'
      },
      {
        step: 2,
        title: 'Clear the Windows Print Spooler queue via Command Prompt',
        detail: 'Stop the spooler service, purge stalled spool files, and restart the spooler service.',
        command: 'net stop spooler && del /Q /F /S "%systemroot%\\System32\\Spool\\Printers\\*.*" && net start spooler'
      },
      {
        step: 3,
        title: 'Toggle "Use Printer Online"',
        detail: 'In Devices and Printers, right click your printer, select "See what\'s printing", click Printer menu and uncheck "Use Printer Offline".'
      },
      {
        step: 4,
        title: 'Print a Windows test page',
        detail: 'Send a 1-page test sheet to verify driver and communication channel health.'
      }
    ],
    whenToContactIT: [
      'Network printer requires secure PIN code setup for confidential department printing',
      'Physical paper jam inside internal gear assemblies',
      'Printer firmware requires static IP subnet configuration'
    ]
  },
  {
    id: 'kb-software-01',
    title: 'Application won\'t open or crashes immediately',
    category: 'software',
    estimatedTime: '4 min',
    tags: ['software', 'crash', 'app data', 'task manager', 'reinstall'],
    symptoms: [
      'Clicking application icon produces mouse spinner for 2 seconds then nothing opens',
      'App window flashes and immediately terminates with a crash report',
      'Error modal states "Another instance is already running"'
    ],
    possibleCauses: [
      'Orphaned background process locked the profile database',
      'Corrupted local %AppData% configuration files',
      'Missing Visual C++ Redistributable or .NET Framework runtime'
    ],
    solutionSteps: [
      {
        step: 1,
        title: 'Terminate background processes in Task Manager',
        detail: 'Search Task Manager for the process name (e.g. Teams.exe or Slack.exe) and click "End Task".'
      },
      {
        step: 2,
        title: 'Clear Local App Cache Folder',
        detail: 'Open Run (Win+R) and purge the application\'s cache subfolder in %localappdata%.'
      },
      {
        step: 3,
        title: 'Run as Administrator',
        detail: 'Right click executable and select "Run as administrator" to test file permission blocks.'
      },
      {
        step: 4,
        title: 'Repair or Reinstall from Company Portal',
        detail: 'Open Microsoft Company Portal, find the software title, and click "Repair/Reinstall".'
      }
    ],
    whenToContactIT: [
      'Enterprise license key validation error appears',
      'Software requires elevated domain admin credentials to install patches',
      'Application database requires rollback from backup'
    ]
  },
  {
    id: 'kb-software-02',
    title: 'Windows system crash and Blue Screen of Death (BSOD)',
    category: 'software',
    estimatedTime: '8 min',
    tags: ['bsod', 'blue screen', 'kernel', 'sfc', 'dism'],
    symptoms: [
      'Computer abruptly halts with blue screen error and restarts automatically',
      'Stop codes such as KERNEL_DATA_INPAGE_ERROR or DRIVER_IRQL_NOT_LESS_OR_EQUAL',
      'System crashes during intense CPU or graphics workloads'
    ],
    possibleCauses: [
      'Corrupted core Windows system files or uncompleted Windows update',
      'Incompatible hardware driver (Graphics, Audio, or Wi-Fi chipset)',
      'Failing physical RAM memory bank or SSD read errors'
    ],
    solutionSteps: [
      {
        step: 1,
        title: 'Run System File Checker (SFC)',
        detail: 'Scan and repair damaged Windows core binaries via Administrator Command Prompt.',
        command: 'sfc /scannow'
      },
      {
        step: 2,
        title: 'Run DISM System Image Repair',
        detail: 'Restore local component store from Windows Update service.',
        command: 'DISM /Online /Cleanup-Image /RestoreHealth'
      },
      {
        step: 3,
        title: 'Run Windows Memory Diagnostic',
        detail: 'Schedule a pre-boot hardware RAM memory test.',
        command: 'mdsched.exe'
      },
      {
        step: 4,
        title: 'Update Graphics and Chipset Drivers',
        detail: 'Install manufacturer certified OEM drivers via Dell Command Update / Lenovo Vantage.'
      }
    ],
    whenToContactIT: [
      'BSOD repeats more than twice in the same workday',
      'Memory diagnostic detects hardware memory faults',
      'Laptop will not boot into Windows normally or Safe Mode'
    ]
  },
  {
    id: 'kb-hardware-02',
    title: 'Bluetooth devices not connecting or pairing',
    category: 'hardware',
    estimatedTime: '3 min',
    tags: ['bluetooth', 'audio', 'mouse', 'keyboard', 'headset'],
    symptoms: [
      'Bluetooth headphones, mouse, or keyboard fails to pair or shows "Driver Error"',
      'Bluetooth toggle switch is missing from Windows Action Center',
      'Audio cuts out intermittently during Teams/Zoom calls'
    ],
    possibleCauses: [
      'Bluetooth device is currently connected to another phone or laptop nearby',
      'Windows Bluetooth Support Service is stopped',
      'Bluetooth adapter entering aggressive power-saving sleep mode'
    ],
    solutionSteps: [
      {
        step: 1,
        title: 'Put peripheral into active pairing mode',
        detail: 'Hold the pairing button on your headset/mouse for 5 seconds until the LED flashes rapidly.'
      },
      {
        step: 2,
        title: 'Remove existing paired device',
        detail: 'Go to Settings > Bluetooth & Devices > Devices. Click the 3 dots next to the device and select "Remove device", then re-pair.'
      },
      {
        step: 3,
        title: 'Restart Windows Bluetooth Support Service',
        detail: 'Open services.msc, locate "Bluetooth Support Service", right-click and choose "Restart".'
      }
    ],
    whenToContactIT: [
      'Bluetooth hardware controller is completely undetected in Device Manager',
      'Corporate peripheral device requires encrypted enterprise dongle'
    ]
  },
  {
    id: 'kb-hardware-03',
    title: 'External monitor not detected or displaying "No Signal"',
    category: 'hardware',
    estimatedTime: '4 min',
    tags: ['monitor', 'display', 'hdmi', 'displayport', 'docking station'],
    symptoms: [
      'External display remains black or displays "No Signal / Entering Power Save"',
      'Windows Display Settings shows only "Display 1"',
      'Resolution is locked to 1024x768 or blurry'
    ],
    possibleCauses: [
      'USB-C docking station Thunderbolt handshake timeout',
      'Monitor source input set to wrong port (e.g. HDMI 1 instead of DisplayPort)',
      'Loose cable connection or outdated DisplayLink driver'
    ],
    solutionSteps: [
      {
        step: 1,
        title: 'Check Physical Input Source on Monitor OSD',
        detail: 'Press the menu buttons on the bottom/back of the monitor and manually select the active input (HDMI/DisplayPort/USB-C).'
      },
      {
        step: 2,
        title: 'Power cycle docking station and monitor',
        detail: 'Unplug the USB-C dock from your laptop, remove power cord from dock for 10 seconds, then reconnect.'
      },
      {
        step: 3,
        title: 'Force display detection in Windows',
        detail: 'Press Win+P and select "Extend". Open Settings > System > Display and click "Detect".'
      },
      {
        step: 4,
        title: 'Restart Graphics Driver stack',
        detail: 'Press Windows Key + Ctrl + Shift + B to restart the display driver without rebooting.'
      }
    ],
    whenToContactIT: [
      'Docking station fails to charge laptop or power USB peripherals',
      'Display flickers with horizontal colored artifacts indicating GPU port fault'
    ]
  }
];

export function getInitialTickets(): Ticket[] {
  const analysis1042 = analyzeProblem("My laptop is connected to Wi-Fi but I can't open any websites.", 'laptop');
  const analysis1041 = analyzeProblem("Laptop running very slowly and applications take forever to open.", 'laptop');
  const analysis1039 = analyzeProblem("Unable to access company email and SSO login is locked out.", 'laptop');
  const analysis1038 = analyzeProblem("Printer not responding and print queue is stuck.", 'printer');
  const analysis1036 = analyzeProblem("Application crashes immediately on startup.", 'desktop');

  return [
    {
      id: 'IT-1042',
      title: 'Wi-Fi connected but no internet',
      description: "My laptop is connected to Wi-Fi but I can't open any websites.",
      category: 'network',
      priority: 'medium',
      status: 'ai_diagnosing',
      device: 'laptop',
      createdAt: '2026-09-17T09:30:00.000Z',
      updatedAt: '2026-09-17T09:32:00.000Z',
      userId: DEMO_USERS.user.id,
      userName: DEMO_USERS.user.name,
      userEmail: DEMO_USERS.user.email,
      aiAnalysis: analysis1042,
      events: [
        {
          id: 'ev-1',
          timestamp: '2026-09-17T09:30:00.000Z',
          description: 'Ticket created by user',
          actor: 'Alex Morgan',
          type: 'created'
        },
        {
          id: 'ev-2',
          timestamp: '2026-09-17T09:30:05.000Z',
          description: 'AI Analysis completed with 92% confidence (Network)',
          actor: 'Smart IT AI Engine',
          type: 'diagnosed'
        }
      ],
      notes: []
    },
    {
      id: 'IT-1041',
      title: 'Laptop running very slowly',
      description: 'Laptop is extremely slow, fan is loud, and apps take 30 seconds to open.',
      category: 'performance',
      priority: 'medium',
      status: 'resolved',
      device: 'laptop',
      createdAt: '2026-09-16T14:15:00.000Z',
      updatedAt: '2026-09-16T14:35:00.000Z',
      userId: DEMO_USERS.user.id,
      userName: DEMO_USERS.user.name,
      userEmail: DEMO_USERS.user.email,
      aiAnalysis: {
        ...analysis1041,
        troubleshootingSteps: analysis1041.troubleshootingSteps.map(s => ({ ...s, completed: true }))
      },
      events: [
        {
          id: 'ev-1041-1',
          timestamp: '2026-09-16T14:15:00.000Z',
          description: 'Ticket created by user',
          actor: 'Alex Morgan',
          type: 'created'
        },
        {
          id: 'ev-1041-2',
          timestamp: '2026-09-16T14:15:08.000Z',
          description: 'AI generated performance troubleshooting steps',
          actor: 'Smart IT AI Engine',
          type: 'diagnosed'
        },
        {
          id: 'ev-1041-3',
          timestamp: '2026-09-16T14:32:00.000Z',
          description: 'User marked all troubleshooting steps completed',
          actor: 'Alex Morgan',
          type: 'step_completed'
        },
        {
          id: 'ev-1041-4',
          timestamp: '2026-09-16T14:35:00.000Z',
          description: 'Ticket marked resolved by user via AI troubleshooting',
          actor: 'Alex Morgan',
          type: 'resolved'
        }
      ],
      notes: [],
      feedback: {
        rating: 5,
        comment: 'Disabling startup apps and clearing disk cache solved the slowness immediately!',
        submittedAt: '2026-09-16T14:35:00.000Z'
      }
    },
    {
      id: 'IT-1039',
      title: 'Unable to access company email',
      description: 'Getting password error and account locked message when opening Outlook or webmail.',
      category: 'account',
      priority: 'high',
      status: 'technician_assigned',
      device: 'laptop',
      createdAt: '2026-09-16T11:00:00.000Z',
      updatedAt: '2026-09-16T11:20:00.000Z',
      userId: DEMO_USERS.user.id,
      userName: DEMO_USERS.user.name,
      userEmail: DEMO_USERS.user.email,
      assignedTechnician: DEMO_USERS.technician.name,
      technicianTitle: DEMO_USERS.technician.title,
      aiAnalysis: analysis1039,
      events: [
        {
          id: 'ev-1039-1',
          timestamp: '2026-09-16T11:00:00.000Z',
          description: 'Ticket created by user',
          actor: 'Alex Morgan',
          type: 'created'
        },
        {
          id: 'ev-1039-2',
          timestamp: '2026-09-16T11:00:10.000Z',
          description: 'AI diagnosed Account Lockout with 94% confidence',
          actor: 'Smart IT AI Engine',
          type: 'diagnosed'
        },
        {
          id: 'ev-1039-3',
          timestamp: '2026-09-16T11:15:00.000Z',
          description: 'User requested IT escalation after SSPR attempt failed',
          actor: 'Alex Morgan',
          type: 'escalated'
        },
        {
          id: 'ev-1039-4',
          timestamp: '2026-09-16T11:20:00.000Z',
          description: 'Assigned to Priya Sharma (Senior IT Systems Specialist)',
          actor: 'IT Triage Dispatcher',
          type: 'assigned'
        }
      ],
      notes: [
        {
          id: 'note-1',
          technicianName: 'Priya Sharma',
          content: 'Checked Active Directory. User account has 5 bad password attempts from an old mobile device. Preparing to unlock AD account and initiate temporary MFA token.',
          createdAt: '2026-09-16T11:25:00.000Z'
        }
      ]
    },
    {
      id: 'IT-1038',
      title: 'Printer not responding',
      description: 'Department HP LaserJet on 3rd floor is showing offline and documents are stuck in queue.',
      category: 'hardware',
      priority: 'medium',
      status: 'in_progress',
      device: 'printer',
      createdAt: '2026-09-15T16:00:00.000Z',
      updatedAt: '2026-09-15T16:45:00.000Z',
      userId: DEMO_USERS.user.id,
      userName: DEMO_USERS.user.name,
      userEmail: DEMO_USERS.user.email,
      assignedTechnician: DEMO_USERS.technician.name,
      technicianTitle: DEMO_USERS.technician.title,
      aiAnalysis: analysis1038,
      events: [
        {
          id: 'ev-1038-1',
          timestamp: '2026-09-15T16:00:00.000Z',
          description: 'Ticket created',
          actor: 'Alex Morgan',
          type: 'created'
        },
        {
          id: 'ev-1038-2',
          timestamp: '2026-09-15T16:20:00.000Z',
          description: 'Escalated to IT',
          actor: 'Alex Morgan',
          type: 'escalated'
        },
        {
          id: 'ev-1038-3',
          timestamp: '2026-09-15T16:45:00.000Z',
          description: 'Status changed to In Progress by Priya Sharma',
          actor: 'Priya Sharma',
          type: 'status_changed'
        }
      ],
      notes: [
        {
          id: 'note-1038-1',
          technicianName: 'Priya Sharma',
          content: 'Rebooted print server spooler service. Checking physical network drop on Floor 3.',
          createdAt: '2026-09-15T16:46:00.000Z'
        }
      ]
    },
    {
      id: 'IT-1036',
      title: 'Application crashes on startup',
      description: 'Teams desktop app closes immediately upon launching.',
      category: 'software',
      priority: 'medium',
      status: 'resolved',
      device: 'desktop',
      createdAt: '2026-09-14T10:00:00.000Z',
      updatedAt: '2026-09-14T10:25:00.000Z',
      userId: DEMO_USERS.user.id,
      userName: DEMO_USERS.user.name,
      userEmail: DEMO_USERS.user.email,
      aiAnalysis: analysis1036,
      events: [
        {
          id: 'ev-1036-1',
          timestamp: '2026-09-14T10:00:00.000Z',
          description: 'Ticket created',
          actor: 'Alex Morgan',
          type: 'created'
        },
        {
          id: 'ev-1036-2',
          timestamp: '2026-09-14T10:25:00.000Z',
          description: 'User cleared %localappdata% cache and resolved problem',
          actor: 'Alex Morgan',
          type: 'resolved'
        }
      ],
      notes: [],
      feedback: {
        rating: 5,
        comment: 'The step to clear %localappdata% cache solved it right away!',
        submittedAt: '2026-09-14T10:25:00.000Z'
      }
    }
  ];
}

export const StorageService = {
  getTickets(): Ticket[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (!raw) {
      const initial = getInitialTickets();
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      const initial = getInitialTickets();
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(initial));
      return initial;
    }
  },

  saveTickets(tickets: Ticket[]): void {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  },

  getTicketById(id: string): Ticket | undefined {
    const tickets = this.getTickets();
    return tickets.find(t => t.id === id);
  },

  saveTicket(ticket: Ticket): void {
    const tickets = this.getTickets();
    const index = tickets.findIndex(t => t.id === ticket.id);
    if (index >= 0) {
      tickets[index] = ticket;
    } else {
      tickets.unshift(ticket);
    }
    this.saveTickets(tickets);
  },

  getKnowledgeArticles(): KnowledgeArticle[] {
    const raw = localStorage.getItem(STORAGE_KEYS.KB_ARTICLES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.KB_ARTICLES, JSON.stringify(INITIAL_KB_ARTICLES));
      return INITIAL_KB_ARTICLES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.setItem(STORAGE_KEYS.KB_ARTICLES, JSON.stringify(INITIAL_KB_ARTICLES));
      return INITIAL_KB_ARTICLES;
    }
  },

  getCurrentUser(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return DEMO_USERS.user;
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.TICKETS);
    localStorage.removeItem(STORAGE_KEYS.KB_ARTICLES);
    this.getTickets();
    this.getKnowledgeArticles();
  }
};
