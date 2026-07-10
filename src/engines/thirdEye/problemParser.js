// AMD/src/engines/thirdEye/problemParser.js

import logger from '../../utils/logger.js';
import clients from '../../config/clients.js';

export class ThirdEyeProblemParser {
    constructor() {
        this.clients = clients;
        // Prioritize local AMD ROCm Gemma/Qwen-Coder model; fall back to OpenAI cloud
        this.client = clients.localAmd || clients.openai;
        this.model = clients.models.local.gemma || clients.models.cloud.openai;
    }

    /**
     * Parses a raw engineering issue or stack trace into a structured, actionable object.
     * @param {string} rawProblem The raw description of the issue or traceback.
     * @param {string} [codebaseContext] Relevant directory layouts or files.
     * @returns {Promise<object>} Structured metadata about the issue.
     */
    async analyze(rawProblem, codebaseContext = '') {
        logger.info(`[ThirdEye] Parsing software engineering issue context...`);

        const systemPrompt = this._createParserPrompt();
        const userContent = `Issue/Log:\n${rawProblem}\n\nCodebase Context:\n${codebaseContext}`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userContent }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.1
            });

            const parsedResult = JSON.parse(response.choices[0].message.content);
            parsedResult.rawText = rawProblem;

            logger.info(`[ThirdEye] Parsed engineering problem type: ${parsedResult.type} (Complexity: ${parsedResult.complexity})`);
            return parsedResult;

        } catch (error) {
            logger.error(`[ThirdEye] Error in problem parsing: ${error.message}. Executing fallback parser.`);
            return this._getFallback(rawProblem);
        }
    }

    _createParserPrompt() {
        return `
You are ThirdEye, the Problem Understanding Engine of NeuroSyn-Dev.
Your job is to analyze software engineering tickets, raw bug reports, compilation failures, or security vulnerabilities and produce a clean, structured JSON analysis.

Output JSON structure:
{
  "type": "bug-fix" | "security-vulnerability" | "architectural-redesign" | "documentation" | "unit-test-generation",
  "complexity": "low" | "medium" | "high",
  "primaryComponent": "string", // Estimated target module or file system affected
  "stackTrace": {
    "hasTrace": boolean,
    "errorType": "string", // e.g., SyntaxError, ReferenceError, NullPointerException
    "failedFile": "string", // File where error occurred if visible in stack trace
    "failedLine": number // Line number where error occurred if visible
  },
  "constraints": ["string"], // Any specified language, package, or performance constraints
  "goal": "string" // Primary target objective of this fix
}

Keep your parsing strict, objective, and accurate to the logs.
`;
    }

    _getFallback(rawProblem) {
        return {
            type: 'bug-fix',
            complexity: 'medium',
            primaryComponent: 'unknown',
            stackTrace: {
                hasTrace: false,
                errorType: 'UnknownError',
                failedFile: 'unknown',
                failedLine: 0
            },
            constraints: [],
            goal: 'Resolve the reported software issue.',
            rawText: rawProblem,
            fallbackApplied: true
        };
    }
}

export default new ThirdEyeProblemParser();