import fs from 'fs/promises';
import path from 'path';
import logger from '../utils/logger.js';

const MEMORY_FILE = path.join(process.cwd(), 'memory.db.json');

export class EngineeringMemory {
    async _ensureDb() {
        try {
            await fs.access(MEMORY_FILE);
        } catch {
            await fs.writeFile(MEMORY_FILE, JSON.stringify([]));
        }
    }

    // 100% Real string similarity calculation (Jaccard Index)
    _calculateSimilarity(str1, str2) {
        // ⚡ Absolute String Coercion Guard: Maps both string fields and nested object shapes safely
        const s1 = typeof str1 === 'string'
            ? str1
            : (str1 && typeof str1 === 'object' ? (str1.prompt || str1.task || '') : '');

        const s2 = typeof str2 === 'string'
            ? str2
            : (str2 && typeof str2 === 'object' ? (str2.prompt || str2.task || '') : '');

        // Coerce completely to String objects to isolate .toLowerCase() calls
        const finalS1 = String(s1);
        const finalS2 = String(s2);

        const set1 = new Set(finalS1.toLowerCase().split(/\s+/));
        const set2 = new Set(finalS2.toLowerCase().split(/\s+/));

        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);

        if (union.size === 0) return 0;
        return Math.round((intersection.size / union.size) * 100);
    }

    async saveMemory(task, patch, repo) {
        await this._ensureDb();
        const data = await fs.readFile(MEMORY_FILE, 'utf-8');
        const memories = JSON.parse(data);

        memories.push({
            id: `MEM-${Date.now()}`,
            date: new Date().toISOString(),
            repo,
            task,
            patch
        });

        await fs.writeFile(MEMORY_FILE, JSON.stringify(memories, null, 2));
        logger.info(`[Memory] Institutional knowledge saved. DB size: ${memories.length} records.`);
    }
}

export default new EngineeringMemory();
