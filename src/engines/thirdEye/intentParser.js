// AMD/src/engines/thirdEye/intentParser.js

import logger from '../../utils/logger.js';
import clients from '../../config/clients.js';

export class ThirdEyeIntentParser {
    constructor() {
        this.clients = clients;
        // Prioritize lightweight local models for fast task classification
        this.client = clients.localAmd || clients.openai;
        this.model = clients.models.local.lightweight || clients.models.cloud.openai;
    }

    /**
     * Translates general intent into concrete execution parameters.
     * @param {object} report The incoming user command or issue tracking data.
     */
    async parseIntent(report) {
        const { prompt, id = 'unknown' } = report;
        logger.info(`[IntentParser][${id}] Assessing development intent and cognitive parameters...`);

        const systemPrompt = `
You are the Intent Parser of NeuroSyn-Dev. Your job is to classify the developer's request into precise cognitive routing vectors.
Analyze the request and provide a JSON response exactly matching this schema:
{
  "primary_intent": "BUG_REPAIR" | "REFACTOR" | "TEST_GENERATION" | "SYSTEM_DEPLOY",
  "cognitiveVector": {
    "complexity": "low" | "medium" | "high",
    "urgency": number // scale of 0.0 to 1.0 based on wording of the user request (high-severity, critical, crash should be >0.8)
  },
  "entities": {
    "target_module": "string",
    "required_technologies": ["string"]
  },
  "questions_to_answer": ["string"] // Key technical details the implementation must resolve
}
`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.1
            });

            const parsed = JSON.parse(response.choices[0].message.content);

            return {
                prompt,
                intent: parsed.primary_intent || 'BUG_REPAIR',
                cognitiveVector: parsed.cognitiveVector || { complexity: 'medium', urgency: 0.5 },
                entities: parsed.entities || { target_module: 'unknown', required_technologies: [] },
                questions_to_answer: parsed.questions_to_answer || ["How can we repair this issue safely?"],
                output_format_instructions: "Generate a clean, modular code patch accompanied by descriptive test files."
            };

        } catch (error) {
            logger.error(`[IntentParser][${id}] Intent parsing failed: ${error.message}. Falling back.`);
            return {
                prompt,
                intent: 'BUG_REPAIR',
                cognitiveVector: { complexity: 'medium', urgency: 0.5 },
                entities: { target_module: 'unknown', required_technologies: [] },
                questions_to_answer: ["How can we verify the bug repair?"],
                output_format_instructions: "Standard patch code format."
            };
        }
    }
}

export default new ThirdEyeIntentParser();