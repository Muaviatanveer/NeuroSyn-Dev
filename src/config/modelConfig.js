// AMD/src/config/modelConfig.js

const hasFireworks = !!process.env.FIREWORKS_API_KEY;

/**
 * central adaptive model mapping for NeuroSyn-Dev.
 * Configured specifically for your AMD GPU vLLM server and Fireworks API.
 */
export const MODEL_CONFIG = {
    // Dynamic Problem Planning Engine (Quantix)
    PLANNER: {
        client: hasFireworks ? 'fireworks' : 'localAmd',
        model: hasFireworks
            ? 'accounts/fireworks/models/gemma-2-27b-it'
            : 'Qwen/Qwen2.5-Coder-7B-Instruct',
        description: hasFireworks ? 'Gemma 2 27B on Fireworks (AMD Cloud)' : 'Qwen-Coder 7B on Local vLLM'
    },

    // Dynamic Multi-Agent Peer Reviewers (Cognitive Mesh)
    DEBATER: {
        client: hasFireworks ? 'fireworks' : 'localAmd',
        model: hasFireworks
            ? 'accounts/fireworks/models/gemma2-9b-it'
            : 'Qwen/Qwen2.5-Coder-7B-Instruct',
        description: hasFireworks ? 'Gemma 2 9B on Fireworks (AMD Cloud)' : 'Qwen-Coder 7B on Local vLLM'
    },

    // Sandbox Execution Coder (Cognitive Mesh Sandbox) - Runs completely free on your AMD GPU
    CODER: {
        client: 'localAmd',
        model: 'Qwen/Qwen2.5-Coder-7B-Instruct',
        description: 'Local Qwen-Coder 7B served via GPU vLLM.'
    },

    // Code Base Scanning Engine
    LIGHTWEIGHT: {
        client: 'localAmd',
        model: 'Qwen/Qwen2.5-Coder-7B-Instruct',
        description: 'Local Qwen-Coder 7B served via GPU vLLM.'
    }
};