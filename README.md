<div align="center">
  <br>
  <img src="https://raw.githubusercontent.com/Muaviatanveer/NeuroSyn-Dev/main/frontend/public/logo.png" alt="NeuroSyn-Dev Logo" width="160" />

  # NeuroSyn-Dev
  ### The Metacognitive Engineering Intelligence Operating System

  <br>

  [![Track 3: Unicorn](https://img.shields.io/badge/AMD_Hackathon-Track_3_Unicorn-violet?style=for-the-badge)](https://amd.com)
  [![Powered by ROCm](https://img.shields.io/badge/AMD_ROCm-vLLM_Accelerated-ed1c24?style=for-the-badge)](https://rocm.amd.com/)
  [![Fireworks AI](https://img.shields.io/badge/Fireworks_AI-Cloud_Inference-ffb703?style=for-the-badge)](https://fireworks.ai/)

  <br>

  **[🚀 Live Demo](https://neurosyn-dev.onrender.com) | [🎥 Demo Video](https://drive.google.com/file/d/177VtmFqdKIfCiUTNCkLKDTCoyClBn85u/view) | [📊 Architecture Slides](https://storage.googleapis.com/lablab-static-eu/presentations/submissions/go8ozv45e60y0tgsdxw8b7la/go8ozv45e60y0tgsdxw8b7la-1783782354483_gajm4ubo7u5n50vit6u7edep.pdf)**
</div>

---

## 📋 Table of Contents
1. [Executive Summary & Vision](#-executive-summary--vision)
2. [AMD Compute & Hardware Integration (Track 3)](#-amd-compute--hardware-integration-track-3)
3. [The 5-Engine Cognitive Architecture](#-the-5-engine-cognitive-architecture)
4. [Deep-Dive Feature Map (16+ Integrations)](#-deep-dive-feature-map-16-integrations)
5. [Core Technical Workflows](#-core-technical-workflows)
6. [Security Architecture & Sandboxing](#-security-architecture--sandboxing)
7. [Un-Crashable State Machines (Resilience)](#-un-crashable-state-machines-resilience)
8. [UI/UX Design Philosophy](#-uiux-design-philosophy)
9. [Database & Backend Design](#-database--backend-design)
10. [API Specification](#-api-specification)
11. [Installation & Setup](#-installation--setup)
12. [License & Hackathon Credits](#-license--hackathon-credits)

---

## 🎯 Executive Summary & Vision

Current AI coding tools are reactive "black boxes" that generate code blindly. They cannot verify if code compiles, ignore architectural trade-offs, and hide their reasoning, leaving developers spending hours debugging AI-generated regressions.

**NeuroSyn-Dev** transitions AI from an assistant to a **verifiable autonomous engineer**. It is an Engineering Intelligence Operating System that thinks, plans, debates, and verifies its own code across heterogeneous compute environments before ever pushing to production.

---

## 💻 AMD Compute & Hardware Integration (Track 3)

NeuroSyn-Dev is engineered to showcase the efficiency of AMD hardware in hybrid decentralized AI deployments:

- **Local Compute (ROCm + vLLM):** Repetitive code-generation, formatting, and syntax correction are routed to `Qwen2.5-Coder-7B-Instruct` hosted locally on an AMD Radeon GPU using vLLM continuous batching, resulting in **$0.00 token costs**.
- **Cloud Compute (Fireworks AI):** High-level architectural reasoning and multi-agent debates are routed to `Gemma-2-27b-it` and `Gemma-2-9b-it` hosted on Fireworks AI's AMD hardware clusters.

```
                    +-------------------------------------+
                    |        User Input / Prompt           |
                    +-------------------------------------+
                                        |
                                        v
                    +-------------------------------------+
                    |        Synapse Heuristic Router      |
                    +-------------------------------------+
                          /                              \
          (Low Complexity / Code Gen)          (High Reasoning / Debate)
                        /                                  \
                       v                                    v
        +----------------------------+        +----------------------------+
        |     Local AMD Radeon GPU    |        |      Fireworks AI Cloud     |
        |   (ROCm + vLLM / Qwen 7B)   |        |   (Gemma 27B / AMD Clusters) |
        |         Cost: $0.00         |        |        Cost: Minimal         |
        +----------------------------+        +----------------------------+
```

> **Efficiency Metric:** By running a proprietary **Explainable Routing Engine**, NeuroSyn-Dev dynamically balances nodes in the DAG. This hybrid split yields an average **81% reduction in cloud token expenditure** compared to standard cloud-only loops, saving an estimated **$14.22 per run**.

---

## 🧠 The 5-Engine Cognitive Architecture

NeuroSyn-Dev coordinates tasks through five specialized cognitive engines:

| Engine | Technical Name | Core Responsibility | Key Technology |
| :--- | :--- | :--- | :--- |
| **Engine 1** | **ThirdEye** | Problem Parsing & Dependency Mapping | AST Parsing & Metadata Extraction |
| **Engine 2** | **Quantix** | Task Planning & DAG Compilation | Topological Dependency Sorting |
| **Engine 3** | **Synapse Router** | Heuristic Hardware Cost Balancing | Explainable Model-Switch Routing |
| **Engine 4** | **Cognitive Mesh** | Sandboxed Execution, Debate & Grading | Docker Sandboxing & Agent Debates |
| **Engine 5** | **Synthesizer Boss** | Decision Synthesis & Conflict Resolution | Statistical Consensus (Standard Dev) |

### Deep-Dive: How They Work

- **ThirdEye (Problem Parser):** Extracts target files and bounds complexity (Low/Medium/High). It analyzes abstract syntax trees to output pre-flight predictions on which files are at risk of breaking from a patch.
- **Quantix (Task Planning):** Structures an execution Directed Acyclic Graph (DAG). To prevent compilation loops, it strictly targets concrete file paths and automatically bypasses sandbox runs for non-executable files (`.yaml`, `.json`, `.md`).
- **Synapse Router (Adaptive Routing):** Heuristically evaluates context size, privacy constraints, and logical weight. It returns human-readable justifications to the UI (e.g., *"✓ 100% Data Privacy (Local Execution)"*).
- **Cognitive Mesh (Execution & Debate):** Mounts patches into an isolated Docker container. Spawns 4 specialized agent personas (Security Auditor, QA Lead, Architect, Performance) to debate the compilation output.
- **Synthesizer Boss (Resolution):** Computes the Standard Deviation (σ) of agent scores. If σ > 15, it flags active architectural disagreement in the logs, resolves conflicts, and strips markdown ticks to prevent JSON crashes.

---

## 🚀 Deep-Dive Feature Map (16+ Integrations)

1. **Engineering Strategy Mode:** Generates three counterfactual strategies (Patch vs. Refactor vs. Rewrite) with confidence and time saved metrics before writing any code.
2. **AI CTO Mode:** Crawls repository file trees to calculate a live health scorecard and identifies the top scaling blockers.
3. **Future Bug Prediction:** Analyzes code paths to predict which external modules are at risk of breaking due to the proposed patch.
4. **Engineering Simulator:** Returns the exact millisecond duration of the sandbox compile, file size byte deltas, and physical line counts.
5. **Multi-Objective Optimizer:** Front-end sliders let users configure priorities (Performance, Cost, Security) to guide model routing weights.
6. **AI Engineering Board:** Spawns a parallel multi-agent critic panel with dynamic role-weighting based on the problem type.
7. **Live Architecture Map:** An SVG sidebar visualization that pulses on the active directory module being sandboxed.
8. **Knowledge Graph:** A visual nested directory explorer that maps the structure of generated local file workspaces.
9. **Engineering Memory:** Persists validated solutions to MongoDB, using Jaccard string-similarity checking to retrieve past strategies.
10. **Explainable Routing:** Generates clear, granular text justifications explaining why a specific compute node was chosen.
11. **Time Machine:** Tracks Git repository commit history to calculate technical debt deltas (+12%, -4%) over time.
12. **Autonomous Sprint Planner:** Groups open GitHub issues into automated, prioritized 2-week Sprint arrays.
13. **Cost Intelligence:** Live telemetry metrics tracking saved cloud tokens and estimated hardware financial savings.
14. **Decision Replay:** An interactive timeline tracing each agent's execution and sandbox verification steps.
15. **Engineering DNA:** Visually presents grading cards (A to F) analyzing the repository's modularity, safety, and testing coverage.
16. **Greenfield IDE:** A recursive, file-tree explorer designed for managing progressive, multi-file software generation.

---

## 📦 Core Technical Workflows

### Progressive Greenfield IDE Workflow

To prevent model token cutoffs during large-scale builds, NeuroSyn-Dev splits generation into logical batches:

1. **Planning:** Quantix maps the full directory structure (Master Plan) based on the user's idea and saves it to MongoDB.
2. **Initial Batch:** The backend compiles the first 3 files (e.g., configurations, database models) on local AMD silicon.
3. **Commit & Pause:** Files are sandbox-verified, committed to GitHub, and the session status is saved as `paused`.
4. **User Continuation:** The UI displays a `⚡ PRESS TO GENERATE NEXT BATCH` button. Clicking it passes previously committed files as code context to Qwen, compiling the next files without losing logical consistency.

---

## 🔒 Security Architecture & Sandboxing

- **OAuth Authentication:** Integrates official Google OAuth 2.0 (`prompt=select_account`) for user profiling and segmentation.
- **Secure GitHub Integration:** Personal Access Tokens (PAT) are stored exclusively in the user's local browser storage and passed in the headers of secure HTTPS requests. Tokens are never saved to the backend database.
- **Docker Container Isolation:** Sandboxed runs are executed under strict system boundaries:
  - Memory allocation capped at **512MB**.
  - CPU quota bounded (`CpuQuota: 100000`).
  - Absolute execution kill-switch timeout set to **180,000ms (3 minutes)**.
  - Read-only mount access configurations wherever applicable.

---

## ⚡ Un-Crashable State Machines (Resilience)

NeuroSyn-Dev is packed with defensive engineering patterns to guarantee uptime during live demonstrations:

- **Double-Insurance Failover:** If the Fireworks Cloud API or local tunnels time out (returning 502/503), the orchestrator catches the exception, outputs a warning log, and seamlessly routes the payload to the local AMD GPU to complete the execution safely.
- **Regex String Extractors:** If a local model outputs unescaped JSON or code block fences, the custom `_parseJsonIfPossible` helper uses regular expressions to extract `prDescription` and `verifiedPatch` values directly without calling standard `JSON.parse` (which would otherwise crash the server).
- **Missing Dependency Auto-Installer:** If a container compilation fails with `ModuleNotFoundError` (Python) or `MODULE_NOT_FOUND` (Node.js), the Sandbox Executor parses the missing package name, runs an in-container background package manager command (`pip install` or `npm install`), and cleanly restarts compilation.

---

## 🎨 UI/UX Design Philosophy

NeuroSyn-Dev is styled with an aesthetic cybernetic Vercel-style theme (Background `#09090B`) utilizing precise, low-saturation accents in Cyan (`#06B6D4`), Emerald (`#10B981`), and Violet (`#8B5CF6`).

```
+-------------------------------------------------------------------+
|  HEADER BAR                                                        |
|  [N] NeuroSyn-Dev (OS v1.0.4)                 Active User Profile  |
+----------------+---------------------------------+-----------------+
|   NAV BAR      |      CENTRAL COMMAND PANEL       |    INSIGHTS     |
+----------------+---------------------------------+-----------------+
|  Dashboard     |                                   |  LIVE           |
|  Projects      |     Active Code / IDE Viewer       |  Gemma 27B      |
|  Analytics     |                                   |  Qwen 7B        |
|  History       +---------------------------------+  Gemma 9B       |
|                |     Live Terminal Log Stream       |  GPU Load       |
|                |                                   |  VRAM           |
|                +---------------------------------+-----------------+
|                |     Consensus / Sim Metrics        |  Reload         |
|                |                                   |  History        |
+----------------+---------------------------------+-----------------+
```

### Scroll-Synchronized Code Editor

The browser-based IDE features a custom-built, scroll-locked editor:

1. **Layer 1 (The Visual Background):** A read-only `<pre>` block that uses our single-pass, zero-dependency `colorizeCode` lexical tokenizer to apply syntax highlighting (strings are colored green, comments are grey, and keywords are violet).
2. **Layer 2 (The Input Foreground):** A fully transparent, editable `<textarea>` positioned directly on top of the `<pre>` block.
3. **The Sync Engine:** A scroll handler locks the `scrollTop` and `scrollLeft` positions of both elements together, creating a fast, un-crashable syntax-highlighted editor experience in the browser.

---

## 💾 Database & Backend Design

### Persistent MongoDB Schema

We transition from an ephemeral local file structure to a persistent MongoDB Atlas cluster. The schemas are indexed and segmented strictly by the user's authenticated email to support secure multi-tenancy.

```javascript
const SessionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true }, // Auth user email
    type: { type: String, default: 'diagnostic' },
    date: { type: Date, default: Date.now },
    repo: { type: String },
    title: { type: String },
    prompt: { type: String },
    patch: { type: String },
    logs: { type: String },
    scorecard: {
        security: { type: Number, default: 95 },
        performance: { type: Number, default: 90 },
        compositeConfidence: { type: Number, default: 92 }
    },
    files: [{
        path: { type: String },
        content: { type: String }
    }],
    rolloutStatus: { type: String, enum: ['idle', 'paused', 'completed'], default: 'idle' },
    masterPlan: [{
        path: { type: String },
        purpose: { type: String },
        dependencies: [{ type: String }]
    }]
});
```

---

## 🔌 API Specification

- **POST `/api/task/stream`**: Accepts `{ task, context }`. Initiates the 5-engine pipeline. Returns a real-time `text/event-stream` of JSON string status packets.
- **POST `/api/project/generate`**: Accepts `{ prompt, token }`. Plans the repository master DAG and compiles/commits the first file batch.
- **POST `/api/project/generate/resume`**: Accepts `{ sessionId, token }`. Loads the active session, identifies the next unbuilt files in the Master Plan, generates their complete code content (using completed files as reference context), and pushes to GitHub.
- **POST `/api/task/deploy`**: Accepts `{ repo, token, patch, targetFile }`. Fetches the target file's current SHA from GitHub and performs a secure overwrite PUT commit. Creates the file if it does not exist.
- **POST `/api/task/scan`**: Accepts `{ repo, token }`. AST static crawler. Generates CTO Scorecards, Scalability Blockers, and folders.
- **GET `/api/history/user?email=...`**: Fetches all persistent operational sessions logged under the verified user email.

---

## ⚙️ Installation & Setup

### Prerequisites

1. Node.js (v18+)
2. MongoDB Atlas connection string
3. GitHub OAuth credentials (or Personal Access Token)
4. (Optional) AMD GPU workspace with ROCm/vLLM hosting `Qwen/Qwen2.5-Coder-7B-Instruct` on port 8000.

### Local Execution

```bash
# 1. Clone the repository
git clone https://github.com/your-username/NeuroSyn-Dev.git
cd NeuroSyn-Dev

# 2. Install Dependencies
npm install
cd frontend && npm install && cd ..

# 3. Setup Environment Variables (.env)
PORT=3000
MONGODB_URI=mongodb+srv://...
FIREWORKS_API_KEY=fw_...
AMD_LOCAL_API_BASE=http://127.0.0.1:8000/v1
AMD_LOCAL_API_KEY=vllm-token
GOOGLE_CLIENT_ID=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# 4. Build & Run
npm run build
npm start
```

Navigate to `http://localhost:3000` to launch the OS.

---

## 📄 License & Hackathon Credits

This project is licensed under the MIT License.

Designed, architected, and built with ❤️ in 4 days for the AMD Developer Cloud Hackathon 2026.
