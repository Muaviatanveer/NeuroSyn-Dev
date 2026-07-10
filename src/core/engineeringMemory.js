// AMD/src/core/engineeringMemory.js

import { UserSession } from '../config/db.js';
import logger from '../utils/logger.js';

export class EngineeringMemory {

    // 100% Real string similarity calculation (Jaccard Index)
    _calculateSimilarity(str1, str2) {
        const s1 = typeof str1 === 'string'
            ? str1
            : (str1 && typeof str1 === 'object' ? (str1.prompt || str1.task || '') : '');

        const s2 = typeof str2 === 'string'
            ? str2
            : (str2 && typeof str2 === 'object' ? (str2.prompt || str2.task || '') : '');

        const finalS1 = String(s1);
        const finalS2 = String(s2);

        const set1 = new Set(finalS1.toLowerCase().split(/\s+/));
        const set2 = new Set(finalS2.toLowerCase().split(/\s+/));

        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);

        if (union.size === 0) return 0;
        return Math.round((intersection.size / union.size) * 100);
    }

    /**
     * Searches persistent MongoDB storage for highly similar engineering tasks 
     * to inject into the planner as template guides.
     */
    async searchMemory(taskDescription) {
        try {
            // Retrieve past runs from MongoDB
            const memories = await UserSession.find({}).lean();
            if (memories.length === 0) return null;

            let highestSimilarity = 0;
            let bestMatch = null;

            for (const mem of memories) {
                const sim = this._calculateSimilarity(taskDescription, mem.prompt);
                if (sim > highestSimilarity && sim >= 50) { // 50% matching threshold
                    highestSimilarity = sim;
                    bestMatch = {
                        id: mem.id,
                        task: mem.prompt,
                        patch: mem.patch,
                        similarity: sim
                    };
                }
            }
            return bestMatch;
        } catch (error) {
            logger.error(`[Memory] Search query over MongoDB aborted: ${error.message}`);
            return null;
        }
    }

    async saveMemory(task, patch, repo) {
        try {
            const newMem = new UserSession({
                id: `MEM-${Date.now()}`,
                userId: 'system-agent@neurosyn.com', // System-level trace marker
                type: 'diagnostic',
                repo: repo || 'Local Target Execution',
                title: 'System Synthesized Resolution',
                prompt: task,
                patch: patch,
                logs: 'Auto-compiled via CLI memory save.'
            });

            await newMem.save();
            logger.info('[Memory] Institutional knowledge saved persistently to MongoDB.');
        } catch (error) {
            logger.error(`[Memory] Persistent save aborted: ${error.message}`);
        }
    }
}

export default new EngineeringMemory();