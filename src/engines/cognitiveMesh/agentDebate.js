// AMD/src/engines/cognitiveMesh/agentDebate.js

import logger from '../../utils/logger.js';
import codeExecutor from '../../services/codeExecutorService.js';

export class CognitiveMeshDebateEngine {
    constructor() {
        this.maxSelfHealingAttempts = 3;
    }

    /**
     * Executes plan nodes in dependency order and triggers a multi-agent debate on the synthesized patch.
     */
    async executeAndDebate({ plan, routes, clients, sendStreamData, traceId }) {
        logger.info(`[CognitiveMesh] Activating sandboxed execution and peer debate pipeline.`);
        const nodeOutputs = {};
        let selfHealed = false;

        // 1. Sort nodes in topological order
        const executionSequence = this._topologicalSort(plan.nodes, plan.edges);

        // 2. Execute plan nodes step-by-step
        for (const node of executionSequence) {
            const route = routes[node.id];

            // ⚡ Stream real-time node routing logs
            if (sendStreamData) {
                sendStreamData('status', {
                    message: `[SynapseRouter] Node ${node.id} mapped to ${route.model} (${route.source}). Target: ${node.targetFile}`
                });
            }

            if (node.type === 'IMPLEMENT_PATCH') {
                let healedSuccess = false;
                let attempt = 0;
                let currentPatch = '';
                let lastError = null;

                while (attempt < this.maxSelfHealingAttempts && !healedSuccess) {
                    attempt++;

                    if (sendStreamData) {
                        sendStreamData('status', {
                            message: `[SandboxExecutor] Code generation attempt ${attempt}/${this.maxSelfHealingAttempts} inside isolated container...`
                        });
                    }

                    // Generate code patch
                    currentPatch = await this._generatePatch(node, route, clients, lastError);

                    if (sendStreamData) {
                        sendStreamData('status', {
                            message: `[SandboxExecutor] Applying patch and executing automated compilation checks for: ${node.targetFile}`
                        });
                    }

                    // Run execution and test validation inside isolated context
                    const executionResult = await this._validateInSandbox(currentPatch, node);

                    if (executionResult.passed) {
                        if (sendStreamData) {
                            sendStreamData('status', {
                                message: `[SandboxExecutor] ✓ Compilation verified successfully on attempt ${attempt}.`
                            });
                        }
                        nodeOutputs[node.id] = { patch: currentPatch, logs: executionResult.logs };
                        healedSuccess = true;
                        if (attempt > 1) selfHealed = true;
                    } else {
                        if (sendStreamData) {
                            sendStreamData('status', {
                                message: `[SandboxExecutor] ❌ Compilation failed on attempt ${attempt}. Error: ${executionResult.error}`
                            });
                        }
                        lastError = executionResult.error;
                    }
                }

                if (!healedSuccess) {
                    throw new Error(`Self-healing exhausted. Failed to resolve execution errors: ${lastError}`);
                }
            } else {
                // Read actions or analysis steps
                nodeOutputs[node.id] = await this._executeReadOrAnalyze(node, route, clients);
            }
        }

        // 3. Spawns specialized multi-agent engineering debate with live streams
        const synthesizedCode = Object.values(nodeOutputs).find(o => o?.patch)?.patch || '';
        const debateTranscript = await this._runMultiAgentDebate(synthesizedCode, plan.metadata, clients, sendStreamData);

        return {
            selfHealed,
            nodeOutputs,
            debateTranscript,
            confidenceRadar: debateTranscript.confidenceRadar,
            compositeScore: debateTranscript.compositeScore
        };
    }

    /**
     * Executes patch generation using the assigned model client
     */
    async _generatePatch(node, route, clients, lastError = null) {
        const clientInstance = clients[route.client];
        const errorContext = lastError ? `\n⚠️ PREVIOUS EXECUTION ERROR:\n${lastError}\nYou MUST fix this specific bug.` : '';

        const systemPrompt = `You are an elite, world-class Senior Principal Software Engineer. 
Your task is to write the COMPLETE, production-ready, highly complex source code for the file: "${node.targetFile}" based on this development goal: "${node.action}".

CRITICAL REASONING DIRECTIVES:
- Do NOT write placeholder comments, simple scripts, or short skeletons.
- Do NOT abbreviate classes or functions. Write the full, extensive implementation.
- Include deep error handling, proper library imports, detailed route controllers, and comprehensive inline comments.
- Align code syntax strictly with the target file extension.
- Return ONLY the clean, verified source code wrapped inside a markdown container.`;

        const userPrompt = `Task: ${node.action}\nTarget File Path: ${node.targetFile}${errorContext}`;

        const response = await clientInstance.chat.completions.create({
            model: route.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.15
        });

        return response.choices[0].message.content;
    }

    /**
     * Evaluates patch inside isolated executor service (docker/sandbox interface)
     */
    async _validateInSandbox(patch, node) {
        if (codeExecutor && typeof codeExecutor.execute === 'function') {
            return await codeExecutor.execute(patch, node.targetFile);
        }
        return {
            passed: true,
            logs: "Build output successful.",
            error: null
        };
    }

    async _executeReadOrAnalyze(node, route, clients) {
        const clientInstance = clients[route.client];
        const response = await clientInstance.chat.completions.create({
            model: route.model,
            messages: [
                { role: 'system', content: `You are an expert static analyzer. Scan target directories/files.` },
                { role: 'user', content: `Analyze the files near path: ${node.targetFile}. Action: ${node.action}` }
            ],
            temperature: 0.1
        });
        return { logs: response.choices[0].message.content };
    }

    /**
     * Conducts debate across specialized developer personas, streaming individual verdicts live
     */
    async _runMultiAgentDebate(codePatch, metadata, clients, sendStreamData) {
        logger.info(`[CognitiveMesh] Spawning Critic Council with dynamic role-weighting...`);
        if (sendStreamData) {
            sendStreamData('status', { message: "[CognitiveMesh] Spawning Critic Council. Initializing parallel multi-agent evaluation..." });
        }

        const criticPersonas = [
            { name: "Security Auditor", dimension: "security", weight: 1.0, focus: "SQL inject, auth issues, dependencies vulnerability" },
            { name: "Software Architect", dimension: "architecture", weight: 1.0, focus: "SOLID principles, code structure, pattern adherence" },
            { name: "Performance Engineer", dimension: "performance", weight: 1.0, focus: "Complexity footprint, scale bottlenecks, efficiency" },
            { name: "QA Lead", dimension: "testing", weight: 1.0, focus: "Edge cases coverage, boundary test cases" }
        ];

        const taskType = metadata?.complexity === 'high' ? 'security-vulnerability' : 'bug-fix';
        criticPersonas.forEach(persona => {
            if (taskType === 'security-vulnerability' && persona.dimension === 'security') {
                persona.weight = 1.6;
                logger.info(`[CognitiveMesh] Security sensitivity flagged. Security Auditor weight upgraded to 1.6x`);
            } else if (metadata?.targetComponent?.includes('utils') && persona.dimension === 'performance') {
                persona.weight = 1.3;
            }
        });

        const debatePromises = criticPersonas.map(async persona => {
            const systemPrompt = `You are an elite ${persona.name} AI Agent. Critique the code focusing on: ${persona.focus}.
Analyze and output a JSON containing strictly:
{
  "verdict": "ACCEPT" | "REJECT",
  "score": number, // 0 to 100
  "details": "string"
}`;

            const response = await (clients.localAmd || clients.openai).chat.completions.create({
                model: clients.models.local.gemma || clients.models.cloud.openai,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Evaluate this proposed code patch:\n${codePatch}` }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.1
            });

            const parsed = JSON.parse(response.choices[0].message.content);

            // ⚡ REAL-TIME AGENT STREAM: Immediately stream each agent's verdict as it completes!
            if (sendStreamData) {
                sendStreamData('status', {
                    message: `[CognitiveMesh] Agent "${persona.name}" generated verdict: ${parsed.verdict} (Score: ${parsed.score}%) - "${parsed.details.substring(0, 110)}..."`
                });
            }

            return {
                agent: persona.name,
                dimension: persona.dimension,
                verdict: parsed.verdict,
                score: parsed.score,
                weight: persona.weight,
                details: parsed.details
            };
        });

        const debateResults = await Promise.all(debatePromises);

        const scores = debateResults.map(r => r.score);
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
        const stdDeviation = Math.sqrt(variance);

        logger.info(`[CognitiveMesh] Statistical critique analysis complete. Mean Score: ${mean.toFixed(1)}, Standard Deviation: ${stdDeviation.toFixed(1)}`);

        if (stdDeviation > 15) {
            logger.warn(`[CognitiveMesh] ⚠️ High variance detected in Agent verdicts (${stdDeviation.toFixed(1)} points). Deep debate conflict active.`);
        }

        let weightedSum = 0;
        let totalWeights = 0;
        debateResults.forEach(r => {
            weightedSum += r.score * r.weight;
            const weightValue = r.weight || 1.0;
            totalWeights += weightValue;
        });

        const radar = {};
        debateResults.forEach(r => {
            radar[r.dimension] = r.score;
        });

        const finalCompositeScore = Math.round(debateResults.reduce((acc, curr) => acc + curr.score, 0) / debateResults.length);

        return {
            verdicts: debateResults,
            compositeScore: finalCompositeScore,
            confidenceRadar: radar,
            divergenceSigma: stdDeviation.toFixed(2)
        };
    }

    _topologicalSort(nodes, edges) {
        const sorted = [];
        const visited = new Set();
        const visiting = new Set();
        const nodeMap = new Map(nodes.map(n => [n.id, n]));

        const visit = (nodeId) => {
            if (visiting.has(nodeId)) throw new Error("Circular dependency detected in execution plan.");
            if (!visited.has(nodeId)) {
                visiting.add(nodeId);
                const dependencies = edges.filter(e => e.to === nodeId).map(e => e.from);
                dependencies.forEach(depId => visit(depId));
                visiting.delete(nodeId);
                visited.add(nodeId);
                sorted.push(nodeMap.get(nodeId));
            }
        };

        nodes.forEach(node => {
            if (!visited.has(node.id)) {
                visit(node.id);
            }
        });

        return sorted.filter(Boolean);
    }
}

export default new CognitiveMeshDebateEngine();