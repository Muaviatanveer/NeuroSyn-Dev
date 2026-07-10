// AMD/src/config/clients.js

import OpenAI from 'openai';
import logger from '../utils/logger.js';

logger.info('Initializing NeuroSyn-Dev Adaptive Client Fabric...');

const clients = {};

const localApiBase = process.env.AMD_LOCAL_API_BASE || 'http://127.0.0.1:8000/v1';
const localApiKey = process.env.AMD_LOCAL_API_KEY || 'vllm-token';

clients.localAmd = new OpenAI({
    apiKey: localApiKey,
    baseURL: localApiBase,
    timeout: 180000 // 3-minute safe boundary
});
logger.info(`✅ Local AMD ROCm interface mapped to: ${localApiBase}`);

// --- 2. Fireworks AI (Google Gemma Models Hosted on Fireworks) ---
const rawKey = process.env.FIREWORKS_API_KEY;
const hasFireworks = !!rawKey && rawKey.trim() !== "";

if (hasFireworks) {
    clients.fireworks = new OpenAI({
        apiKey: rawKey.trim(), // ⚡ Safety: Explicitly trim whitespaces/newlines from Render env
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
        // ⚡ FIXED: Standardized Fireworks namespaces to use Google's official identifier endpoints
        gemma2_9b: 'accounts/google/models/gemma2-9b-it',
        gemma2_27b: 'accounts/google/models/gemma2-27b-it'
    },
    local: {
        qwenCoder: 'Qwen/Qwen2.5-Coder-7B-Instruct',
        gemma: 'Qwen/Qwen2.5-Coder-7B-Instruct',
        lightweight: 'Qwen/Qwen2.5-Coder-7B-Instruct'
    }
};

logger.info('✅ Client fabric initialization complete.');
export default clients;