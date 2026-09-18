# 🎬 EchoFlow: 3-Minute Video Demo Script

> **Target Duration:** 2 minutes 45 seconds (must be strictly under 3:00 per Amazon hackathon rules).  
> **Screen Setup:** Full screen browser open to `http://localhost:5173`.  
> **Speaker Audio:** English, enthusiastic, clear narration.

---

## ⏱️ Video Breakdown & Timestamp Choreography

### 0:00 – 0:30: The Hook & The Problem
- **Voiceover:**
  > "Hello judges! This is EchoFlow—an autonomous proactive agent bridge for Alexa+, built on the new Model Context Protocol specification and powered by AWS Bedrock.
  > 
  > Legacy voice assistants are passive command-response devices. If you want to check your day, start your morning, or adjust your home, you have to issue dozens of manual commands.
  > 
  > With EchoFlow and Alexa+ MCP, Alexa transforms into an autonomous life agent that understands intent, executes multi-step tool workflows, and delivers proactive intelligence."

### 0:30 – 1:15: Demo 1 — Proactive "Good Morning Launch"
- **Action on Screen:**
  - Click the **"Good Morning Launch"** scenario card (or speak into the mic: *"Alexa, good morning! Start my morning launch routine."*).
- **Show on Screen:**
  - Alexa's animated audio waveform pulsing cyan.
  - The **Live MCP Protocol Inspector** immediately showing the stream of inbound `tools/call` and outbound SSE responses in real-time.
  - The **Smart Home Sandbox** dynamically updating: living room lights turning on to warm daylight, climate adjusting to 22.5°C, and security disarming.
- **Voiceover:**
  > "Watch what happens in a single voice command. Alexa+ routes through our Streamable HTTP MCP server, queries our smart home tools, and executes three device mutations in parallel while synthesizing our morning schedule and energy consumption with Claude 3.5 Sonnet on AWS Bedrock."

### 1:15 – 1:55: Demo 2 — Deep Focus Mode & Real-Time MCP Protocol Inspection
- **Action on Screen:**
  - Click the **"Deep Focus Mode"** scenario card.
  - Click on the newest packet in the **Live MCP Protocol Inspector** to expand the raw JSON-RPC payload.
- **Show on Screen:**
  - Office desk lamp lights up in cyan focus tone, living room lights dim to 30%.
  - Show the JSON payload: `method: "tools/call"`, `name: "trigger_ops_routine"`, and sub-50ms latency counter.
- **Voiceover:**
  > "Here, Alexa+ switches the home to focus mode. In our live MCP Inspector on the right, you can see the exact Streamable HTTP protocol packets conforming to the MCP 2025-11-25 standard. Every tool execution is completely transparent, low-latency, and auditable."

### 1:55 – 2:30: Demo 3 — Away Lockdown & Security Guard
- **Action on Screen:**
  - Click the **"Away Lockdown"** scenario card.
- **Show on Screen:**
  - All lights power off, front door deadbolt locks to green, security arms to `ARMED_AWAY`, and power drops to eco-saving wattage.
- **Voiceover:**
  > "When leaving home, EchoFlow coordinates a full environment lockdown—securing doors, turning off lighting, switching climate to eco mode, and arming Alexa Guard."

### 2:30 – 2:45: Conclusion & Architecture Recap
- **Voiceover:**
  > "EchoFlow is 100% open-source under the MIT license, complies with the Alexa+ Streamable HTTP MCP standard, and includes comprehensive developer friction logs for the Amazon team.
  > 
  > Thank you for building the future of voice agents with Alexa+ and AWS Bedrock!"
