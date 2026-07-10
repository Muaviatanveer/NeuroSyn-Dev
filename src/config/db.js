// AMD/src/config/db.js

import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
    if (!MONGODB_URI) {
        logger.warn("[Database] MONGODB_URI is not set. Falling back to local offline mode.");
        return false;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        logger.info("✅ MongoDB connected successfully and persistently.");
        return true;
    } catch (error) {
        logger.error(`❌ MongoDB connection failed: ${error.message}`);
        return false;
    }
};

const SessionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    type: { type: String, default: 'diagnostic' },
    date: { type: Date, default: Date.now },
    repo: { type: String, default: 'Local Target Execution' },
    title: { type: String, default: 'Autonomous Resolution' },
    prompt: { type: String },
    patch: { type: String },
    logs: { type: String },
    scorecard: {
        security: { type: Number, default: 95 },
        performance: { type: Number, default: 90 },
        compositeConfidence: { type: Number, default: 92 }
    },
    files: [{
        path: { type: String },
        content: { type: String }
    }],

    // --- ⚡ NEW PROGRESSIVE ROLLOUT SCHEMA FIELDS ---
    rolloutStatus: { type: String, enum: ['idle', 'paused', 'completed'], default: 'idle' },
    masterPlan: [{
        path: { type: String },
        purpose: { type: String },
        dependencies: [{ type: String }] // Lists paths of files that must compile first
    }]
});

export const UserSession = mongoose.model('UserSession', SessionSchema);