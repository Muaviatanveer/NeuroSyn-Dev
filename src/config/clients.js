// AMD/src/config/clients.js

import OpenAI from 'openai';
import logger from '../utils/logger.js';

logger.info('Initializing NeuroSyn-Dev Adaptive Client Fabric...');

const clients = {};

// --- 1. Local AMD GPU vLLM Server (ROCm Powered, Free, Unlimited) ---
// Points directly to the vLLM server running on your JupyterLab AMD GPU
const localApiBase = process.env.AMD_LOCAL_API_BASE || 'http://127.0.0.1:8000/v1';
const localApiKey = process.env.AMD_LOCAL_API_KEY || 'vllm-token';

clients.localAmd = new OpenAI({
    apiKey: localApiKey,
    baseURL: localApiBase,
    timeout: 180000 // 3-minute safe boundary
});
logger.info(`✅ Local AMD ROCm interface mapped to: ${localApiBase}`);

// --- 2. Fireworks AI (AMD-Hardware Hosted Gemma Models) ---
const hasFireworks = !!process.env.FIREWORKS_API_KEY;
if (hasFireworks) {
    clients.fireworks = new OpenAI({
        apiKey: process.env.FIREWORKS_API_KEY,
        baseURL: 'https://api.fireworks.ai/inference/v1'
    });
    logger.info('📡 Connection Available: Fireworks AI on AMD Hardware is online.');
} else {
    logger.info('ℹ️ Fireworks key not detected. Operating in local-offline mode.');
    clients.fireworks = null;
}

// --- 3. Fallback Alias Mapping ---
clients.openai = hasFireworks ? clients.fireworks : clients.localAmd;

// --- 4. Model Registry ---
clients.models = {
    fireworks: {
        gemma2_9b: 'accounts/fireworks/models/gemma2-9b-it',
        gemma2_27b: 'accounts/fireworks/models/gemma-2-27b-it'
    },
    local: {
        // Point to the exact model loaded inside your vLLM server
        qwenCoder: 'Qwen/Qwen2.5-Coder-7B-Instruct',
        gemma: 'Qwen/Qwen2.5-Coder-7B-Instruct',
        lightweight: 'Qwen/Qwen2.5-Coder-7B-Instruct'
    }
};

logger.info('✅ Client fabric initialization complete.');
export default clients;