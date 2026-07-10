// AMD/src/server.js
import 'dotenv/config';
import app from './app.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logger.info('====================================================');
    logger.info(`🚀 NeuroSyn-Dev Engine Server running on Port: ${PORT}`);
    logger.info(`🏥 Health check path: http://localhost:${PORT}/health`);
    logger.info(`🛠️ Local AMD ROCm Inference Base: ${process.env.AMD_LOCAL_API_BASE || 'http://localhost:11434/v1'}`);
    logger.info('====================================================');
});

// --- Graceful Shutdown Setup ---
const handleShutdown = (signal) => {
    logger.warn(`Received ${signal}. Shutting down server and releasing socket resources...`);
    server.close(() => {
        logger.info('HTTP Server successfully closed. Exit status: success.');
        process.exit(0);
    });

    // Enforce instant kill safety boundary
    setTimeout(() => {
        logger.error('Force shutdown boundary exceeded. Terminating immediately.');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));