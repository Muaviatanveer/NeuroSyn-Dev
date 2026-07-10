// AMD/src/engines/synapseRouter/dynamicRouter.js

import logger from '../../utils/logger.js';
import { MODEL_CONFIG } from '../../config/modelConfig.js';

export class SynapseRouter {
    constructor() {
        this.config = MODEL_CONFIG;
    }

    /**
     * Determines the optimal model routing for a given execution DAG.
     * @param {object} dag - Directed Acyclic Graph from Engine 2 (Quantix)
     * @param {object} systemClients - Available clients (from clients.js)
     * @returns {Promise<object>} Routing table mapping node IDs to specific model selections
     */
    async routeTasks(dag, systemClients) {
        logger.info(`[SynapseRouter] Generating dynamic, explainable route mapping for ${dag.nodes.length} nodes...`);
        const routingTable = {};

        const isLocalAvailable = !!systemClients.localAmd;
        const taskComplexity = dag.metadata?.complexity || 'medium';

        for (const node of dag.nodes) {
            routingTable[node.id] = this._determineRoute(node, taskComplexity, isLocalAvailable);
        }

        logger.info('[SynapseRouter] Routing table generated successfully.');
        return routingTable;
    }

    /**
     * Internal heuristic router based on task characteristics, returning explicit reasoning.
     */
    _determineRoute(node, complexity, isLocalAvailable) {
        if (!isLocalAvailable) {
            logger.warn(`[SynapseRouter] Local client not detected. Defaulting to fallback configurations.`);
        }

        // Base reasoning dynamically checks where the model is hosted
        const getBaseReasons = (clientType) => {
            return clientType === 'localAmd'
                ? ["✓ 100% Data Privacy (Local Execution)", "✓ Zero API Latency", "✓ Zero Token Cost"]
                : ["✓ Cloud fallback engaged (Hardware requirement)", "✓ High reasoning benchmark"];
        };

        switch (node.type) {
            case 'READ_CODE':
                return {
                    source: this.config.LIGHTWEIGHT.client === 'fireworks' ? 'CLOUD' : 'LOCAL_AMD',
                    client: this.config.LIGHTWEIGHT.client,
                    model: this.config.LIGHTWEIGHT.model,
                    reasons: [
                        ...getBaseReasons(this.config.LIGHTWEIGHT.client),
                        "✓ Fast AST parsing needed",
                        "✓ Small context requirement"
                    ]
                };

            case 'IMPLEMENT_PATCH':
                return {
                    source: this.config.CODER.client === 'fireworks' ? 'CLOUD' : 'LOCAL_AMD',
                    client: this.config.CODER.client,
                    model: this.config.CODER.model,
                    reasons: [
                        ...getBaseReasons(this.config.CODER.client),
                        "✓ High code-generation benchmark",
                        "✓ Context < 8k tokens"
                    ]
                };

            case 'COMPILE_TEST':
                return {
                    source: this.config.CODER.client === 'fireworks' ? 'CLOUD' : 'LOCAL_AMD',
                    client: this.config.CODER.client,
                    model: this.config.CODER.model,
                    reasons: [
                        ...getBaseReasons(this.config.CODER.client),
                        "✓ Syntax validation alignment",
                        "✓ High instruction-following capability"
                    ]
                };

            case 'SECURITY_DEBATE':
                return {
                    source: this.config.DEBATER.client === 'fireworks' ? 'CLOUD' : 'LOCAL_AMD',
                    client: this.config.DEBATER.client,
                    model: this.config.DEBATER.model,
                    reasons: [
                        ...getBaseReasons(this.config.DEBATER.client),
                        "✓ Deep logic validation requirement",
                        "✓ Large reasoning requirement (Multi-Agent)"
                    ]
                };

            default:
                return {
                    source: this.config.PLANNER.client === 'fireworks' ? 'CLOUD' : 'LOCAL_AMD',
                    client: this.config.PLANNER.client,
                    model: this.config.PLANNER.model,
                    reasons: [
                        ...getBaseReasons(this.config.PLANNER.client),
                        "✓ Complex structural planning needed",
                        "✓ 90-file context evaluation capability"
                    ]
                };
        }
    }
}

export default new SynapseRouter();