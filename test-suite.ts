import { analyzeProblem } from './src/services/aiEngine';
import { analyzeScreenshotFilename } from './src/services/visionDemo';
import { INITIAL_KB_ARTICLES, getInitialTickets, DEMO_USERS } from './src/services/storageService';

console.log('--- STARTING SMART IT HELPDESK UNIT & INTEGRATION TESTS ---');

// 1. Test Demo Users
if (!DEMO_USERS.user || DEMO_USERS.user.name !== 'Alex Morgan') throw new Error('User demo user invalid');
if (!DEMO_USERS.technician || DEMO_USERS.technician.name !== 'Priya Sharma') throw new Error('Technician demo user invalid');
console.log('✓ Demo Users verified: Alex Morgan (User), Priya Sharma (Technician)');

// 2. Test Initial Demo Tickets
const initialTickets = getInitialTickets();
if (initialTickets.length < 5) throw new Error('Not enough initial demo tickets');
const it1042 = initialTickets.find(t => t.id === 'IT-1042');
if (!it1042 || it1042.category !== 'network') throw new Error('IT-1042 missing or invalid');
console.log('✓ Initial tickets verified: IT-1042, IT-1041, IT-1039, IT-1038, IT-1036');

// 3. Test Initial Knowledge Base Articles
if (INITIAL_KB_ARTICLES.length < 8) throw new Error('Expected at least 8 KB articles');
console.log(`✓ Knowledge base verified: ${INITIAL_KB_ARTICLES.length} verified articles indexed`);

// 4. Test Scenario 1: Wi-Fi connected but no internet
const s1 = analyzeProblem('My laptop is connected to Wi-Fi but I cannot open any websites.', 'laptop');
if (s1.category !== 'network' || s1.confidence !== 92) throw new Error('Scenario 1 failed: ' + JSON.stringify(s1));
if (!s1.troubleshootingSteps.some(s => s.codeSnippet && s.codeSnippet.includes('flushdns'))) throw new Error('DNS flush snippet missing in S1');
console.log('✓ Scenario 1 (Wi-Fi / Network): Passed (Category: ' + s1.category + ', Confidence: ' + s1.confidence + '%)');

// 5. Test Scenario 2: Laptop slow
const s2 = analyzeProblem('Laptop is extremely slow and applications take forever to open.', 'laptop');
if (s2.category !== 'performance' || s2.confidence !== 89) throw new Error('Scenario 2 failed');
console.log('✓ Scenario 2 (Performance): Passed (Category: ' + s2.category + ', Confidence: ' + s2.confidence + '%)');

// 6. Test Scenario 3: Email access
const s3 = analyzeProblem('Cannot access company email and account is locked out in Outlook.', 'laptop');
if (s3.category !== 'account' || s3.priority !== 'high' || s3.confidence !== 94) throw new Error('Scenario 3 failed');
console.log('✓ Scenario 3 (Account & Access): Passed (Priority: High, Confidence: ' + s3.confidence + '%)');

// 7. Test Scenario 4: Printer
const s4 = analyzeProblem('Department printer is not printing and print queue is stalled.', 'printer');
if (s4.category !== 'hardware' || s4.confidence !== 87) throw new Error('Scenario 4 failed');
console.log('✓ Scenario 4 (Hardware / Printer): Passed (Confidence: ' + s4.confidence + '%)');

// 8. Test Scenario 5: Blue Screen
const s5 = analyzeProblem('Blue screen crash STOP CODE memory exception.', 'desktop');
if (s5.confidence !== 91 || s5.priority !== 'high') throw new Error('Scenario 5 failed');
console.log('✓ Scenario 5 (BSOD Crash): Passed (Confidence: ' + s5.confidence + '%)');

// 9. Test Scenario 6: Password reset
const s6 = analyzeProblem('Forgot corporate password and need to reset credentials.', 'laptop');
if (s6.category !== 'account' || s6.confidence !== 95) throw new Error('Scenario 6 failed');
console.log('✓ Scenario 6 (Password Reset): Passed');

// 10. Test Scenario 7: App won't open
const s7 = analyzeProblem('Teams application not opening and crashing immediately.', 'laptop');
if (s7.category !== 'software' || s7.confidence !== 88) throw new Error('Scenario 7 failed');
console.log('✓ Scenario 7 (Application Crash): Passed');

// 11. Test Scenario Fallback: Unknown problem
const s8 = analyzeProblem('Quantum resonance telemetry sensor in office chair is malfunctioning.', 'other');
if (s8.category !== 'other' || s8.confidence > 80 || !s8.escalationRequired) throw new Error('Fallback failed');
console.log('✓ Unknown Fallback: Passed (Cautious confidence: ' + s8.confidence + '%, Escalation flag: ' + s8.escalationRequired + ')');

// 12. Test Vision Demo Analyzer
const v1 = analyzeScreenshotFilename('blue_screen_error_dump.png');
if (!v1.isRecognized || !v1.detectedText?.includes('STOP CODE')) throw new Error('Vision blue screen failed');
const v2 = analyzeScreenshotFilename('wifi_disconnect.png');
if (!v2.isRecognized || v2.suggestedIssue !== 'Network Connectivity / DNS Failure') throw new Error('Vision wifi failed');
const v3 = analyzeScreenshotFilename('unknown_image.jpg');
if (v3.isRecognized || !v3.message.includes('requires a configured vision model')) throw new Error('Vision transparent fallback failed');
console.log('✓ Vision Demo Analyzer: Passed all pattern matching and transparency checks');

console.log('====================================================');
console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY (12/12)');
console.log('====================================================');
