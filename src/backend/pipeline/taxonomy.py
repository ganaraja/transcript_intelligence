"""Versioned keyword tables for call type, modules, themes, risk, and competitors.

Call type is rule-based (titles + attendee domains). Themes are a hybrid of
keyword scoring plus vendor-provided summary.topics. LLM extraction is optional
and additive — see pipeline/llm.py.
"""

from __future__ import annotations

AEGIS_DOMAIN = "aegiscloud.com"

CALL_TYPE_SUPPORT_PREFIXES = (
    "support case",
    "escalation:",
    "urgent:",
)

# Internal incident rooms often use these even when a customer is on the line.
SUPPORT_URGENCY_TOKENS = ("urgent", "escalation", "complete loss", "dashboard down")

MODULES: dict[str, tuple[str, ...]] = {
    "identity": (
        "identity module",
        "identity team",
        " sso",
        "sso ",
        "saml",
        "scim",
        "ldap",
        "mfa",
        "nameid",
        "authentication override",
    ),
    "detect": (
        "detect outage",
        "detect module",
        "detect team",
        "detect pipeline",
        "detect dashboard",
        "detect alert",
        "aegis detect",
        "false positive",
        "threat visibility",
    ),
    "protect": (
        "protect module",
        "protect team",
        "backup",
        "granular restore",
        "logvault",
        "backup window",
    ),
    "comply": (
        "comply v2",
        "aegis comply",
        "comply module",
        "soc 2",
        "iso 27001",
        "hipaa",
        "pci dss",
    ),
    "billing": (
        "billing",
        "invoice",
        "overage",
        "license upgrade",
        "renewal",
    ),
    "platform": (
        "status page",
        "siem connector",
        "api integration",
        "custom report",
    ),
}

# Ordered: first strong title/body hit wins as primary_theme.
THEMES: list[tuple[str, str, tuple[str, ...]]] = [
    (
        "detect_outage",
        "Detect reliability / outage",
        (
            "detect outage",
            "pipeline failure",
            "dashboard down",
            "threat visibility",
            "alerts not firing",
            "data gaps",
            "war room",
            "root cause",
            "false positives after patch",
            "detect latency",
            "detect reliability",
        ),
    ),
    (
        "sso_identity_failure",
        "SSO / Identity failures",
        (
            "sso",
            "saml",
            "scim",
            "ldap",
            "mfa token",
            "login failure",
            "authentication failed",
            "certificate rotation",
            "identity module",
            "provisioning",
        ),
    ),
    (
        "comply_launch_audit",
        "Comply v2 / audit readiness",
        (
            "comply v2",
            "soc 2",
            "iso 27001",
            "hipaa",
            "pci dss",
            "audit",
            "compliance review",
            "launch day",
            "early access",
            "ga deployment",
        ),
    ),
    (
        "protect_backup",
        "Protect / backup & restore",
        (
            "backup",
            "restore",
            "protect module",
            "logvault",
            "backup window",
        ),
    ),
    (
        "renewal_commercial",
        "Renewal & commercial",
        (
            "renewal",
            "contract",
            "invoice",
            "billing",
            "overage",
            "multi-year",
            "qbr",
            "business review",
            "account review",
        ),
    ),
    (
        "competitive_evaluation",
        "Competitive evaluation",
        (
            "competitive",
            "vendor comparison",
            "win/loss",
            "evaluating",
            "competitor",
        ),
    ),
    (
        "onboarding_adoption",
        "Onboarding & adoption",
        (
            "onboarding",
            "deployment",
            "kickoff",
            "setup",
            "module expansion",
            "demo",
        ),
    ),
    (
        "incident_communication",
        "Incident communication gaps",
        (
            "status page",
            "communication",
            "post-incident",
            "customer impact",
            "proactive",
        ),
    ),
    (
        "product_roadmap",
        "Product roadmap & planning",
        (
            "roadmap",
            "sprint",
            "design review",
            "quarterly planning",
            "launch readiness",
            "product sync",
            "product feedback",
        ),
    ),
    (
        "engineering_ops",
        "Internal engineering ops",
        (
            "standup",
            "retro",
            "all hands",
            "scalability",
            "reliability sprint",
        ),
    ),
]

COMPETITORS = (
    "sentinel",
    "crowdstrike",
    "palo alto",
    "wiz",
    "snyk",
    "lacework",
    "rapid7",
    "splunk",
    "okta",
    "cyberark",
    "vanta",
    "drata",
    "cloudprime",
)

CHURN_PHRASES = (
    "looking at other",
    "evaluating other",
    "considering switching",
    "not renewing",
    "cancel",
    "churn",
    "put the renewal on hold",
    "going with someone else",
    "rfp",
    "leaving aegis",
    "need to see responsiveness",
)

ESCALATION_PHRASES = (
    "ciso",
    "legal",
    "board",
    "executive",
    "escalate",
    "war room",
    "complete loss",
    "urgent",
)

VOC_FEATURE = ("wish", "would love", "feature request", "roadmap", "when will", "need a way")
VOC_BUG = ("bug", "broken", "outage", "failure", "error", "not firing", "timeout", "latency")
VOC_PROCESS = ("status page", "communication", "documentation", "onboarding", "support response")
