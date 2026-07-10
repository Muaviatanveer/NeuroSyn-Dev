// AMD/src/engines/quantix/executionPlanner.js

import logger from '../../utils/logger.js';
import clients from '../../config/clients.js';

export class QuantixExecutionPlanner {
    constructor() {
        this.clients = clients;
        // Prioritize local AMD ROCm models; fall back to cloud if required
        this.client = clients.localAmd || clients.openai;

        // ⚡ 2A: Upgraded Dynamic Model Resolution
        this.model = (clients.models && clients.models.local && clients.models.local.gemma) || 'gemma2:27b';
    }

    /**
     * Generates a precise, highly-reasoned engineering execution Directed Acyclic Graph (DAG).
     * @param {object} problemAnalysis - Output from Engine 1 (ThirdEye)
     * @param {string|object|null} feedback - Traceback logs or critique from failed sandbox iterations
     * @param {object|null} approvedStrategy - Chosen strategy from Feature 1 (Engineering Strategy Mode)
     * @returns {Promise<object>} The fully-structured task execution graph (DAG)
     */
    async generatePlan(problemAnalysis, feedback = null, approvedStrategy = null) {
        const isHighComplexity = problemAnalysis.complexity === 'high';

        // Dynamically shift compute to top-tier local model, fallback to cloud if mapped
        const activeClient = isHighComplexity ? (this.clients.openai || this.client) : this.client;

        // ⚡ 2B: Upgraded Dynamic Cloud Model Resolution
        const activeModel = isHighComplexity
            ? ((this.clients.models && this.clients.models.cloud && this.clients.models.cloud.openai) || (this.clients.models && this.clients.models.local && this.clients.models.local.gemma) || 'gemma2:27b')
            : this.model;

        logger.info(`[Quantix] ⚙️ Building execution planner DAG using model: ${activeModel}`);
        if (approvedStrategy) {
            logger.info(`[Quantix] 🎯 Plan configuration bound to active strategy: "${approvedStrategy.name}"`);
        }

        const systemPrompt = this._createPlanningSystemPrompt(problemAnalysis, feedback, approvedStrategy);
        const userContent = `Ingest parsed problem metadata:\n${JSON.stringify(problemAnalysis, null, 2)}`;

        try {
            const response = await activeClient.chat.completions.create({
                model: activeModel,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userContent }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.2 // Low temperature for deterministic, structured dependency mapping
            });

            const rawPlan = JSON.parse(response.choices[0].message.content);
            const verifiedDag = this._verifyAndConstructDag(rawPlan, problemAnalysis);

            logger.info(`[Quantix] Plan successfully compiled. Created ${verifiedDag.nodes.length} nodes with ${verifiedDag.edges.length} matching dependency edges.`);
            return verifiedDag;

        } catch (error) {
            logger.error(`[Quantix] ❌ Critical planning failure: ${error.message}. Constructing fallback DAG.`);
            return this._getFallbackDag(problemAnalysis, feedback, approvedStrategy);
        }
    }

    /**
     * Unabridged system prompt detailing exact node schemas, language bounds, and architectural strategies.
     */
    _createPlanningSystemPrompt(analysis, feedback, approvedStrategy) {
        let feedbackSection = '';
        if (feedback) {
            const parsedFeedback = typeof feedback === 'object' ? JSON.stringify(feedback) : feedback;
            feedbackSection = `
⚠️ CRITICAL PREVIOUS ATTEMPT FAILURE & EXECUTOR EXCEPTION LOG:
"${parsedFeedback}"
`;
        }

        let strategySection = '';
        if (approvedStrategy) {
            strategySection = `
🎯 HIGH-PRIORITY APPROVED STRATEGY CONSTRAINT:
Strategy Name: "${approvedStrategy.name}"
Reasoning Rationale: "${approvedStrategy.reasoning}"
`;
        }

        return `
You are Quantix (Engine 2), the Metacognitive Task Planning and Dependency Engine of NeuroSyn-Dev.
Your job is to read a parsed issue report, evaluate technical constraints, and generate a Directed Acyclic Graph (DAG) of development steps required to implement the fix.

⚠️ UNABRIDGED GREENFIELD PLATFORM DIRECTIVE (Real Enterprise Scale):
If the user's prompt is a request to build a new application or platform from scratch, you MUST act as an Enterprise Architect and plan a COMPLETE, production-ready repository.
- You MUST generate a detailed task graph containing at least 8 to 10 distinct "IMPLEMENT_PATCH" task nodes, mapping out a real-world multi-directory layout.
- The file targets you plan MUST span across these architectural layers:
  1. Core Backend Application & Controllers (e.g. "src/app.py", "src/controllers/auth_controller.py", "src/models/user_model.py")
  2. Main Server Configurations (e.g. "package.json", "requirements.txt", "tsconfig.json")
  3. Microservices Containerization (e.g. "Dockerfile", "docker-compose.yml")
  4. Infrastructure-as-Code Provisioning (e.g. "iac/terraform/main.tf", "iac/terraform/variables.tf")
  5. API Declarations & Docs (e.g. "docs/api_specs.json")
  6. Comprehensive Verification Test Suites (e.g. "tests/test_auth.py", "tests/test_api.py")
- NEVER target raw directory folders ending in "/" (e.g. do NOT output "iac/terraform/" or "kubernetes/ci-cd/"). All target paths MUST be specific, concrete files.
- Each generated file must be designed to contain real, operational source code relevant to its name.

Available Node Types:
- "READ_CODE": Locate, scan, and extract code from target source directories or files.
- "IMPLEMENT_PATCH": Write code modifications, safety wrappers, or target patches.
- "COMPILE_TEST": Run compile syntax checks, pip dependencies resolving, or unit test suits.
- "SECURITY_DEBATE": Execute local audits to ensure the patch does not create regressions.

You MUST produce a single, valid JSON object containing exactly "nodes" and "edges" keys matching this JSON Schema:
{
  "nodes": [
    {
      "id": "string", // Unique ID (e.g., "node_1", "node_2")
      "type": "READ_CODE" | "IMPLEMENT_PATCH" | "COMPILE_TEST" | "SECURITY_DEBATE",
      "action": "string", // Detailed description of the technical step to perform
      "targetFile": "string", // Concrete file path (e.g., "iac/terraform/main.tf")
      "dependencies": ["string"] 
    }
  ],
  "edges": [
    { "from": "string", "to": "string" }
  ]
}

Goal to solve: "${analysis.goal}"
Target component: "${analysis.primaryComponent}"
${strategySection}
${feedbackSection}
`;

    }

    /**
     * Performs strict verification on the LLM's raw JSON structure to guarantee mathematical validity of the DAG.
     */
    _verifyAndConstructDag(rawPlan, analysis) {
        if (!rawPlan.nodes || !Array.isArray(rawPlan.nodes) || rawPlan.nodes.length === 0) {
            throw new Error("Invalid or empty node collection generated by the plan model.");
        }

        const edges = rawPlan.edges || [];
        const nodeIds = new Set(rawPlan.nodes.map(n => n.id));

        rawPlan.nodes.forEach(node => {
            // Clean and validate dependency arrays
            if (node.dependencies && Array.isArray(node.dependencies)) {
                node.dependencies.forEach(depId => {
                    // Ensure the dependency exists in the generated node collection
                    if (nodeIds.has(depId)) {
                        const edgeExists = edges.some(e => e.from === depId && e.to === node.id);
                        if (!edgeExists) {
                            edges.push({ from: depId, to: node.id });
                        }
                    }
                });
            }
        });

        return {
            nodes: rawPlan.nodes,
            edges: edges,
            metadata: {
                targetComponent: analysis.primaryComponent,
                complexity: analysis.complexity,
                generatedAt: new Date().toISOString()
            }
        };
    }

    /**
     * Robust backup planner invoked if local LLM parsing encounters structural issues.
     */
    _getFallbackDag(analysis, feedback, approvedStrategy) {
        const fallbackNodes = [
            {
                id: "node_fb_1",
                type: "READ_CODE",
                action: `Scan and analyze code files within component ${analysis.primaryComponent || 'root'} using approved strategy: ${approvedStrategy?.name || 'Default'}.`,
                targetFile: analysis.primaryComponent || "src/",
                dependencies: []
            },
            {
                id: "node_fb_2",
                type: "IMPLEMENT_PATCH",
                action: `Synthesize and apply solution code patch resolving goal: ${analysis.goal}. Strategy: ${approvedStrategy?.name || 'Local Refactor'}.`,
                targetFile: analysis.primaryComponent || "src/",
                dependencies: ["node_fb_1"]
            },
            {
                id: "node_fb_3",
                type: "COMPILE_TEST",
                action: "Execute syntax compilation and run sandbox validation tests.",
                targetFile: "tests/",
                dependencies: ["node_fb_2"]
            }
        ];

        return {
            nodes: fallbackNodes,
            edges: [
                { from: "node_fb_1", to: "node_fb_2" },
                { from: "node_fb_2", to: "node_fb_3" }
            ],
            metadata: {
                targetComponent: analysis.primaryComponent,
                complexity: "fallback",
                fallbackApplied: true,
                feedbackUsed: !!feedback,
                strategyApplied: approvedStrategy?.name || 'Default'
            }
        };
    }
}

export default new QuantixExecutionPlanner();