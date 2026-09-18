from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

Category = Literal["network", "performance", "account", "hardware", "software", "security", "other"]
Priority = Literal["low", "medium", "high", "critical"]
DeviceType = Literal["laptop", "desktop", "mobile", "printer", "other"]


class AnalyzeRequest(BaseModel):
    description: str = Field(min_length=1)
    device: DeviceType = "laptop"
    category: Category | Literal["detect"] = "detect"
    priority: Priority | Literal["detect"] = "detect"


class TroubleshootingStep(BaseModel):
    id: str
    number: str
    title: str
    explanation: str
    codeSnippet: str | None = None
    completed: bool = False


class AnalyzeResponse(BaseModel):
    detectedIssue: str
    category: Category
    priority: Priority
    confidence: int
    summary: str
    possibleCauses: list[str]
    troubleshootingSteps: list[TroubleshootingStep]
    knowledgeBaseArticles: list[str]
    escalationRequired: bool
    technicianSummary: str
    analyzedAt: str


app = FastAPI(title="Smart IT Helpdesk AI Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PATTERNS = [
    {
        "keywords": ["wifi", "wi-fi", "internet", "network", "dns", "gateway"],
        "category": "network",
        "priority": "medium",
        "confidence": 92,
        "issue": "Network Connectivity & DNS Resolution Failure",
        "summary": "The device appears to have a local network or internet routing problem.",
        "causes": ["Stale DNS cache", "DHCP lease or gateway timeout", "Router or captive portal issue"],
        "steps": [("Check another device", "Verify whether another device on the same network can access websites.", None), ("Flush DNS cache", "Clear stale local DNS records.", "ipconfig /flushdns"), ("Test public routing", "Check whether public IP routing works independently of DNS.", "ping 8.8.8.8")],
        "articles": ["kb-network-01", "kb-network-02"],
    },
    {
        "keywords": ["slow", "freezing", "lag", "performance", "cpu", "memory", "disk"],
        "category": "performance",
        "priority": "medium",
        "confidence": 89,
        "issue": "System Resource Bottleneck & Performance Degradation",
        "summary": "The workstation is likely being slowed by resource-heavy processes, storage pressure, or startup services.",
        "causes": ["High CPU or memory utilization", "Low disk space", "Too many startup applications"],
        "steps": [("Inspect Task Manager", "Sort processes by CPU and memory to find the largest consumer.", None), ("Check free disk space", "Ensure the primary disk has at least 15% free capacity.", None), ("Restart the workstation", "Restart to clear memory and hung background services.", None)],
        "articles": ["kb-perf-01"],
    },
    {
        "keywords": ["password", "email", "outlook", "login", "account", "mfa", "locked"],
        "category": "account",
        "priority": "high",
        "confidence": 94,
        "issue": "Enterprise Account Authentication Failure",
        "summary": "The corporate identity provider is rejecting or unable to complete the authentication request.",
        "causes": ["Expired password or account lockout", "Stale sign-in token", "MFA approval failure"],
        "steps": [("Try webmail", "Use a private browser window to isolate desktop client issues.", None), ("Complete password reset", "Use the corporate self-service password reset portal.", None), ("Verify MFA", "Check the registered authenticator for a pending approval.", None)],
        "articles": ["kb-account-01", "kb-account-02"],
    },
]


def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    text = request.description.lower()
    match = max(PATTERNS, key=lambda pattern: sum(len(keyword) for keyword in pattern["keywords"] if keyword in text), default=None)
    score = sum(len(keyword) for keyword in match["keywords"] if keyword in text) if match else 0

    if not match or score < 4:
        category = "other" if request.category == "detect" else request.category
        priority = "medium" if request.priority == "detect" else request.priority
        steps = [
            ("Check power and connections", f"Check power, battery indicators, and physical ports on the {request.device}.", None),
            ("Restart the device", "Restart the operating system to clear pending memory states and hung services.", None),
            ("Escalate to IT Support", "A technician should inspect this unclassified issue if it continues.", None),
        ]
        return build_response(request, "Unclassified Technical Anomaly", category, priority, 68, "The symptom does not match a high-confidence automated resolution profile.", ["Non-standard software conflict", "Intermittent hardware or driver malfunction"], steps, ["kb-software-01"], True)

    category = match["category"] if request.category == "detect" else request.category
    priority = match["priority"] if request.priority == "detect" else request.priority
    return build_response(request, match["issue"], category, priority, match["confidence"], match["summary"], match["causes"], match["steps"], match["articles"], False)


def build_response(request, issue, category, priority, confidence, summary, causes, steps, articles, escalation):
    mapped_steps = [TroubleshootingStep(id=f"step-{index}", number=f"{index:02d}", title=title, explanation=explanation, codeSnippet=code) for index, (title, explanation, code) in enumerate(steps, 1)]
    return AnalyzeResponse(detectedIssue=issue, category=category, priority=priority, confidence=confidence, summary=summary, possibleCauses=causes, troubleshootingSteps=mapped_steps, knowledgeBaseArticles=articles, escalationRequired=escalation, technicianSummary=f"Python AI service analyzed the reported {request.device} issue and prepared a triage summary.", analyzedAt=datetime.now(timezone.utc).isoformat())


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "python-ai"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_problem(request: AnalyzeRequest):
    return analyze(request)
