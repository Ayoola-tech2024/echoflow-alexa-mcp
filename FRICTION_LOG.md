# EchoFlow Developer Friction Log & Tool Feedback

> **Author:** EchoFlow Development Team  
> **Submission Track:** Alexa+ Track (Streamable HTTP Model Context Protocol Spec `2025-11-25+`) & AWS Builder Mini Challenge  
> **Hackathon:** Build, Ship, Shape: Amazon Developer Hackathon 2026  
> **Purpose:** Detailed developer experience (DX) friction logs submitted for the **up to 10% judging bonus**.

---

## 📋 Executive Summary of Feedback
Building for the new **Alexa+ Model Context Protocol (MCP)** standard and **AWS Bedrock Runtime SDK** represented a significant leap forward in developer ergonomics compared to legacy monolithic Alexa Skills Kit (ASK) intent schemas. However, during end-to-end integration and Streamable HTTP implementation, we documented key friction points and practical workarounds.

---

## 🔍 Detailed Friction Log Entries

### Entry 1: Streamable HTTP / Server-Sent Events (SSE) Reconnection Semantics
- **Tool / SDK:** `@modelcontextprotocol/sdk` (TypeScript) + Streamable HTTP Transport
- **Task Attempted:** Implementing long-lived SSE connections on `/sse` for live bidirectional MCP tool execution without state teardown.
- **Steps Taken:**
  1. Initialized Express endpoint with `res.setHeader('Content-Type', 'text/event-stream')`.
  2. Registered MCP protocol handlers for `tools/list` and `tools/call`.
  3. Tested concurrent client listeners from browser React simulator.
- **Expected Behavior:** Standardized keep-alive ping intervals and auto-reconnect headers built into the MCP SDK transport layer.
- **Actual Behavior:** Reconnection behavior on network interruptions had minor payload desynchronization if the client disconnected during multi-step tool stream execution.
- **Severity Rating:** **Medium**
- **Workaround Used:** Implemented an in-memory client connection pool (`sseClients: Response[]`) with an explicit broadcast handler and auto-cleanup on request close (`req.on('close')`).
- **Actionable Suggestion for Amazon Alexa+ Team:** Include a first-class `StreamableHttpServerTransport` wrapper in the official Alexa+ MCP SDK starter templates that handles exponential backoff heartbeat pings out-of-the-box.

---

### Entry 2: AWS Bedrock Tool-Calling Schema Mapping with MCP Definitions
- **Tool / SDK:** `@aws-sdk/client-bedrock-runtime` + Claude 3.5 Sonnet / Amazon Nova
- **Task Attempted:** Directly feeding MCP `inputSchema` (JSON Schema draft 7) into Bedrock `InvokeModel` toolConfig parameters.
- **Steps Taken:**
  1. Extracted `inputSchema` from MCP tool definitions (`control_smart_device`, `get_daily_briefing`).
  2. Passed schema directly into Bedrock tool configuration payload.
- **Expected Behavior:** Bedrock API accepts standard MCP JSON schema objects without format transformation.
- **Actual Behavior:** Minor parameter syntax differences between Bedrock Anthropic tool schema formatting and generic JSON Schema required manual normalization of required properties.
- **Severity Rating:** **Low**
- **Workaround Used:** Created a lightweight transformer in `bedrock-client.ts` that standardizes MCP tool schemas into Bedrock-compliant payload blocks.
- **Actionable Suggestion for AWS / Alexa+ Team:** Publish an official `@aws-sdk/mcp-bedrock-bridge` adapter package that automatically converts MCP tool lists into Bedrock `toolConfig` structures with zero boilerplate.

---

### Entry 3: Voice Latency Budget for Multi-Step MCP Tool Execution
- **Tool / SDK:** Alexa+ Agent Skill Runtime & Bedrock LLM
- **Task Attempted:** Executing a composite morning routine ("Alexa, good morning") involving 3 distinct smart device state mutations plus a weather/calendar synthesis within interactive audio conversational response thresholds.
- **Steps Taken:**
  1. Sent composite request to Bedrock agent.
  2. Bedrock executed sequential tool calls.
  3. Measured total round-trip latency to audio synthesis.
- **Expected Behavior:** Multi-tool execution completes under 600ms.
- **Actual Behavior:** Sequential synchronous tool calls compounded round-trip latency to ~1200ms without parallelization.
- **Severity Rating:** **Medium**
- **Workaround Used:** Grouped non-dependent device actions inside `trigger_ops_routine` so sub-actions execute concurrently in parallel before returning the final synthesized audio voice script.
- **Actionable Suggestion for Alexa+ Team:** Allow Alexa+ MCP agents to stream intermediate audio cues (e.g. "Adjusting your lights and climate now...") while asynchronous downstream tools resolve in the background.

---

## 📊 Tool Onboarding & Satisfaction Matrix

| Tool / Service | Purpose in EchoFlow | Onboarding Experience | Strengths | What Needs Improvement | Would Build With Again? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Model Context Protocol (MCP)** | Standardized agent-to-tool protocol for Alexa+ | ⭐⭐⭐⭐⭐ (5/5) | Open, decoupled, language-agnostic, clean JSON-RPC | Needs standardized SSE transport helpers | **Yes, Absolutely** |
| **AWS Bedrock Runtime SDK** | Claude 3.5 Sonnet / Nova reasoning layer | ⭐⭐⭐⭐☆ (4.5/5) | Enterprise reliability, powerful multi-hop reasoning | Simpler local mock harness for offline testing | **Yes, Absolutely** |
| **Streamable HTTP Transport** | Real-time event streaming for voice feedback | ⭐⭐⭐⭐☆ (4.5/5) | Low latency, no heavy WebSocket negotiation needed | Detailed reference client implementations | **Yes, Absolutely** |

---

## 💡 Top Feature Requests for the Alexa+ Platform

1. **Native MCP Server Discovery Protocol (Critical):** Allow Alexa+ devices to auto-discover local network or cloud-hosted MCP servers via mDNS / DNS-SD or authenticated OAuth discovery.
2. **Proactive Out-of-Band Notification Triggers (Important):** Enable MCP servers to push autonomous notifications to Alexa+ devices without requiring an initial user voice wake word.
3. **Multi-Modal Visual Card Streaming (Nice-to-have):** Allow MCP tool responses to return synchronized APL (Alexa Presentation Language) / React UI widgets alongside voice audio for Echo Show and Fire TV screens.
