---
name: Integration status semantics
description: How IrisMap should represent optional external providers whose credentials do not prove runtime connectivity.
---

Treat “configured” and “connected” as separate states for external providers. A present key only proves configuration; runtime connectivity should be marked connected only after a documented, safe provider operation succeeds. Keep undocumented MCP-backed transports behind adapters and return generic user-facing failures.

**Why:** The workspace can have an authorized MCP connection while the application still lacks a supported provider HTTP transport, and configured OpenAI credentials can still fail at provider runtime.

**How to apply:** Preserve safe fallbacks for maps and alerts, never log raw SDK errors or credentials, and expose status distinctions in diagnostics.