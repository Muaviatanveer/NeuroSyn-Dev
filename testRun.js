// AMD/testRun.js

import logger from './src/utils/logger.js';
import synapseFabric from './src/core/synapseFabric.js';

// Setup Mock Stream Handler for the CLI
const mockStreamHandler = (type, data) => {
    if (type === 'status') {
        logger.info(`[STREAM STATUS] ➡️ ${data.message}`);
    } else if (type === 'content') {
        // Output incremental patches or logs
    } else if (type === 'error') {
        logger.error(`[STREAM ERROR] ❌ ${data.message}`);
    }
};

async function executeDiagnosticTest() {
    logger.info('========================================================');
    logger.info('🧪 Starting NeuroSyn-Dev AMD Hackathon Diagnostic Test');
    logger.info('========================================================');

    // Simulated technical issue
    const mockIssue = `
BUG REPORT:
File: src/calculator.py
Error: ZeroDivisionError: division by zero in average calculator.

The average helper function crashes when the items list is empty:
def calculate_average(items):
    return sum(items) / len(items)

Goal: Fix this function to handle empty arrays safely and return 0.
`;

    const options = {
        context: "The calculator module is used for processing financial metrics. Python 3 environment.",
        sendStreamData: mockStreamHandler
    };

    try {
        const startTime = Date.now();
        const output = await synapseFabric.processTask(mockIssue, options);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        logger.info('========================================================');
        logger.info(`✅ DIAGNOSTIC PIPELINE RUN SUCCESSFUL (${duration}s)`);
        logger.info('========================================================');
        logger.info(`PR Description: \n${output.prDescription}`);
        logger.info('--------------------------------------------------------');
        logger.info(`Scorecard: ${JSON.stringify(output.scorecard, null, 2)}`);
        logger.info('========================================================');

    } catch (error) {
        logger.error(`❌ Diagnostic pipeline failed: ${error.message}`);
        process.exit(1);
    }
}

executeDiagnosticTest();