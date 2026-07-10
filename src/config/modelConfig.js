// AMD/src/config/modelConfig.js

const hasFireworks = !!process.env.FIREWORKS_API_KEY && process.env.FIREWORKS_API_KEY.trim() !== "";

export const MODEL_CONFIG = {
    // Dynamic Problem Planning Engine (Quantix)
    PLANNER: {
        client: hasFireworks ? 'fireworks' : 'localAmd',
        model: hasFireworks
            ? 'accounts/google/models/gemma2-27b-it' // ⚡ Updated
            : 'Qwen/Qwen2.5-Coder-7B-Instruct',
        description: hasFireworks ? 'Gemma 2 27B on Fireworks (AMD Cloud)' : 'Qwen-Coder 7B on Local vLLM'
    },

    // Dynamic Multi-Agent Peer Reviewers (Cognitive Mesh)
    DEBATER: {
        client: hasFireworks ? 'fireworks' : 'localAmd',
        model: hasFireworks
            ? 'accounts/google/models/gemma2-9b-it' // ⚡ Updated
            : 'Qwen/Qwen2.5-Coder-7B-Instruct',
        description: hasFireworks ? 'Gemma 2 9B on Fireworks (AMD Cloud)' : 'Qwen-Coder 7B on Local vLLM'
    },

    // Sandbox Execution Coder (Cognitive Mesh Sandbox)
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