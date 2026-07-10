// AMD/src/services/agentRegistry.js

import logger from '../utils/logger.js';

class AgentRegistry {
    constructor() {
        if (AgentRegistry.instance) return AgentRegistry.instance;

        this.agents = new Map();
        logger.info("AgentRegistry initialized successfully.");

        AgentRegistry.instance = this;
    }

    register(name, agentInstance) {
        if (this.agents.has(name)) {
            logger.warn(`AgentRegistry: Re-registering agent "${name}".`);
        }

        const capabilitiesMap = {};
        if (Array.isArray(agentInstance.capabilities)) {
            agentInstance.capabilities.forEach(cap => {
                capabilitiesMap[cap] = { task: cap, schema: {} };
            });
        } else {
            Object.assign(capabilitiesMap, agentInstance.capabilities || {});
        }

        const metadata = {
            status: 'active',
            type: name.toLowerCase().includes('system') ? 'system' : 'standard',
            capabilities: capabilitiesMap,
            provider: 'System'
        };

        this.agents.set(name, { agent: agentInstance, metadata });
        logger.info(`AgentRegistry: Agent "${name}" registered.`);
    }

    getAgent(name) {
        const entry = this.agents.get(name);
        if (entry?.metadata.status === 'active') return entry.agent;
        return null;
    }

    getAgentsByCapability(capability) {
        return Array.from(this.agents.entries())
            .filter(([_, entry]) => entry.metadata.status === 'active' &&
                entry.metadata.capabilities &&
                Object.keys(entry.metadata.capabilities).includes(capability))
            .map(([name, entry]) => ({ name, agent: entry.agent }));
    }

    listAllAgents() {
        return Array.from(this.agents.entries()).map(([name, { metadata }]) => ({
            name,
            capabilities: Object.keys(metadata.capabilities)
        }));
    }

    unregister(name) {
        if (this.agents.delete(name)) {
            logger.info(`AgentRegistry: Unregistered agent "${name}".`);
        }
    }
}

const instance = new AgentRegistry();
export default instance;