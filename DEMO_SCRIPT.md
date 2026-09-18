# 🎬 EchoFlow: 3-Minute Video Demo Presentation Script

> **Presenter:** Ayoola Damisile  
> **Project:** EchoFlow — Autonomous Alexa+ MCP Agent with AWS Bedrock  
> **Hackathon:** Build, Ship, Shape: Amazon Developer Hackathon 2026  
> **Target Video Length:** 2 minutes 30 seconds to 2 minutes 45 seconds (Strictly under 3:00)  
> **Screen Setup:** Full screen browser showing `http://localhost:5173`

---

## 🎙️ Word-for-Word Teleprompter Script

### ⏱️ [0:00 – 0:35] Introduction & The Problem
*(Look at the camera or show the top header of EchoFlow on screen)*

> **Read aloud:**  
> "Hello Amazon hackathon judges and developer community! My name is **Ayoola Damisile**, and today I am excited to present **EchoFlow**—an autonomous, proactive agent bridge for **Alexa+**, built on the official **Model Context Protocol (MCP) Streamable HTTP specification** and powered by **AWS Bedrock**.
>
> Today’s voice assistants are mostly passive, single-command speakers. If you want to start your morning or manage your smart home, you have to issue dozens of repetitive commands.
>
> We built EchoFlow to transform Alexa+ into an autonomous, proactive smart life agent that can understand complex intent, orchestrate multi-step IoT routines in parallel, and deliver voice-synthesized daily intelligence."

---

### ⏱️ [0:35 – 1:15] Demo 1: Proactive "Good Morning Launch"
*(Move your mouse to the top row of cards and click on **`Good Morning Launch`**)*

> **What to do on screen:**  
> 1. Click the **`Good Morning Launch`** card.  
> 2. Watch Alexa speak: *"Good morning, Ayoola! I have activated your morning routine..."*  
> 3. Point your mouse to the **Live MCP Protocol Inspector** on the right and the **Smart Home Sandbox** below.
>
> **Read aloud:**  
> "Watch what happens in a single conversational turn. 
> 
> Alexa+ connects to our self-hosted Streamable HTTP MCP server on port 3001. Using Anthropic Claude 3.5 Sonnet on AWS Bedrock, it analyzes my morning schedule and coordinates two MCP tools: `trigger_ops_routine` and `get_daily_briefing`.
> 
> As you can see on screen, my living room lights set to energizing daylight, the smart thermostat adjusts to 22.5 degrees, the overnight security alarm disarms, and Alexa speaks a personalized morning briefing summarizing my 4 calendar events and home energy usage."

---

### ⏱️ [1:15 – 1:55] Demo 2: Deep Focus Mode & Live Protocol Inspection
*(Move your mouse to the **`Deep Focus Mode`** card and click it)*

> **What to do on screen:**  
> 1. Click the **`Deep Focus Mode`** card.  
> 2. On the **Smart Home Sandbox**, notice the office desk lamp turn on with cyan focus light while the living room dims.  
> 3. Click on the topmost packet in the **Live MCP Protocol Inspector** on the right to expand the raw JSON-RPC code.
>
> **Read aloud:**  
> "Next, let's look at **Deep Focus Mode**. With one click, EchoFlow tunes my home office lighting to focus cyan and dims the living room to eliminate distractions and conserve energy.
> 
> On the right, our **Live MCP Protocol Inspector** displays the exact Server-Sent Events (SSE) packets streamed in real time, adhering strictly to the **MCP 2025-11-25+ standard**. Every tool call, parameter schema, and response payload is completely auditable with sub-50 millisecond execution latency."

---

### ⏱️ [1:55 – 2:25] Demo 3: Away Lockdown & Security Automation
*(Move your mouse to the **`Away Lockdown`** card and click it)*

> **What to do on screen:**  
> 1. Click the **`Away Lockdown`** card.  
> 2. Watch all lights turn to `0% (POWERED DOWN)`, the front door deadbolt lock to green `🔒 LOCKED`, and Alexa Guard arm to `ARMED_AWAY`.
>
> **Read aloud:**  
> "When leaving the house, I simply say *'Alexa, I am leaving'*. 
> 
> EchoFlow executes the `away_secure` routine: every light in the house is powered down, the front door deadbolt is secured, the climate switches to eco mode, and Alexa Guard security arms whole-home perimeter monitoring."

---

### ⏱️ [2:25 – 2:45] Conclusion & Open Source
*(Scroll smoothly to show the whole dashboard and conclude)*

> **Read aloud:**  
> "EchoFlow is 100% open-source under the MIT license on GitHub, includes comprehensive unit test coverage, and provides detailed developer friction logs to help Amazon shape the future of the Alexa+ developer ecosystem.
> 
> Thank you for watching, and I look forward to your feedback!"

---

## 💡 Quick Tips for Ayoola Before Recording:
1. **Pacing:** Speak at a calm, natural, conversational pace. You don't need to rush; the script is timed at ~2 minutes 35 seconds.
2. **Audio Check:** Make sure your computer sound is unmuted so Alexa's voice synthesis can be heard clearly in the video.
3. **Screen Size:** Maximize your browser window (`F11` or full screen) so the dashboard looks crisp and clean.
