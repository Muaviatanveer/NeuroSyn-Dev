// AMD/src/services/baseAgent.js

import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

/**
 * @class BaseAgent
 * @description A foundational class for all specialized cognitive agents in NeuroSyn-Dev.
 * It provides core properties, identifies capabilities, and defines the standard 
 * `think` method that all subclasses must implement.
 */
export class BaseAgent {
    /**
     * Constructs a new BaseAgent instance.
     * @param {object} options - The configuration options for the agent.
     * @param {string} options.name - The unique name for the agent (e.g., "Gemma-Reasoner").
     * @param {string[]} options.capabilities - The agent's skills (e.g., ["reasoning", "critique"]).
     * @param {object} options.clients - An object containing the pre-initialized AI clients.
     * @param {string[]} [options.tags=[]] - Optional tags for strategy (e.g., ["critical", "fallback"]).
     */
    constructor({ name, capabilities, clients, tags = [] }) {
        if (!name || !capabilities || !clients) {
            throw new Error("BaseAgent requires name, capabilities, and clients during construction.");
        }

        this.id = uuidv4();
        this.name = name;
        this.capabilities = capabilities;
        this.clients = clients;
        this.tags = tags;

        logger.info(`[${this.name}] Agent instance ${this.id} created.`);
    }

    /**
     * Abstract 'think' method. This is the entry point for an agent to generate a "Thought".
     * Subclasses MUST override this method.
     * @param {object} input - The primary input data for the agent's thinking process.
     * @param {string} input.prompt - The user's core prompt.
     * @param {string} input.context - The retrieved context from memory.
     * @param {object} [input.systemPromptVariant] - An optional, tailored system prompt.
     * @returns {Promise<object>} A "Thought" object.
     */
    async think(input) {
        throw new Error(`Agent ${this.name} must implement the 'think' method.`);
    }

    /**
     * Helper to get a specific AI client.
     * @param {string} clientName - 'openai', 'anthropic', or 'gemini'.
     * @returns {any} The requested client instance.
     */
    getClient(clientName) {
        if (!this.clients[clientName]) {
            throw new Error(`Client "${clientName}" is not available in this agent.`);
        }
        return this.clients[clientName];
    }
}