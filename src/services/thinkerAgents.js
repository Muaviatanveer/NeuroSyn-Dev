// AMD/src/services/thinkerAgents.js

import { BaseAgent } from './baseAgent.js';
import logger from '../utils/logger.js';

// --- Safe Tool Fail-safes ---
let searchArxiv = async (q) => { return [{ title: "Mock Arxiv Paper", summary: `No real paper found for ${q}` }]; };
let searchWeb = async (q) => { return `Mock search result for query: ${q}`; };

// Try loading external search tools if present, falling back gracefully
try {
    const arxivModule = await import('../tools/arxivSearch.js');
    searchArxiv = arxivModule.searchArxiv;
} catch (e) {
    logger.warn('[ThinkerAgents] External Arxiv tool not loaded. Using local emulator.');
}
try {
    const webModule = await import('../tools/webSearch.js');
    searchWeb = webModule.searchWeb;
} catch (e) {
    logger.warn('[ThinkerAgents] External Web Search tool not loaded. Using local emulator.');
}

function extractContent(response) {
    if (!response) return "";
    if (response.choices && response.choices.length > 0) {
        return response.choices[0].message?.content || response.choices[0].text || "";
    }
    if (response.content?.[0]?.text) {
        return response.content[0].text;
    }
    return "";
}

/**
 * Analytical Thinker Persona
 */
export class AnalyticalThinker extends BaseAgent {
    constructor({ clients }) {
        super({
            name: "AnalyticalThinker",
            capabilities: ["reasoning", "structured_thought", "conversational"],
            clients
        });
        // Favor local AMD model first, fall back to OpenAI cloud
        this.client = clients.localAmd || clients.openai;
        this.model = clients.models?.local?.gemma || clients.models?.cloud?.openai || "gpt-4o";
    }

    async think({ prompt, context = "" }) {
        logger.info(`[AnalyticalThinker] Evaluation started for prompt: "${prompt.slice(0, 60)}..."`);

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: "system", content: "You are the Analytical Thinker agent. Analyze structural code patterns and outline logical solutions." },
                    { role: "user", content: `Context: ${context}\n\nTask: ${prompt}` }
                ],
                temperature: 0.2
            });
            return { content: extractContent(response) };
        } catch (error) {
            logger.error(`[AnalyticalThinker] Error: ${error.message}`);
            return { content: null, error: error.message };
        }
    }
}

/**
 * Comprehensive Thinker Persona
 */
export class ComprehensiveThinker extends BaseAgent {
    constructor({ clients }) {
        super({
            name: "ComprehensiveThinker",
            capabilities: ["reasoning", "exhaustive_search"],
            clients
        });
        this.client = clients.localAmd || clients.openai;
        this.model = clients.models?.local?.gemma || clients.models?.cloud?.openai || "gpt-4o";
    }

    async think({ prompt, context = "" }) {
        logger.info(`[ComprehensiveThinker] Performing comprehensive evaluation...`);
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: "system", content: "You are the Comprehensive Thinker. Thoroughly document technical details and edge-case risks." },
                    { role: "user", content: `Context: ${context}\n\nTask: ${prompt}` }
                ],
                temperature: 0.3
            });
            return { content: extractContent(response) };
        } catch (error) {
            logger.error(`[ComprehensiveThinker] Error: ${error.message}`);
            return { content: null, error: error.message };
        }
    }
}

/**
 * Creative Thinker Persona
 */
export class CreativeThinker extends BaseAgent {
    constructor({ clients }) {
        super({
            name: "CreativeThinker",
            capabilities: ["reasoning", "creative_ideation"],
            clients
        });
        this.client = clients.localAmd || clients.openai;
        this.model = clients.models?.local?.gemma || clients.models?.cloud?.openai || "gpt-4o";
    }

    async think({ prompt, context = "" }) {
        logger.info(`[CreativeThinker] Synthesizing alternative solutions...`);
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: "system", content: "You are the Creative Thinker. Formulate out-of-the-box system improvements and elegant workarounds." },
                    { role: "user", content: `Context: ${context}\n\nTask: ${prompt}` }
                ],
                temperature: 0.8
            });
            return { content: extractContent(response) };
        } catch (error) {
            logger.error(`[CreativeThinker] Error: ${error.message}`);
            return { content: null, error: error.message };
        }
    }
}