import OpenAI from 'openai';
import { exampleMap2 } from './levels';
import { locationPrompt } from './prompts';

class OpenAIService {

    constructor(private openai: OpenAI) {}

    async generateLocation(difficulty: string): Promise<{ map: number[][] }> {
        if (process.env.DEBUG === "true") {
          return exampleMap2;
        }
    
        const completion = await this.openai.chat.completions.create({
            messages: [
                { role: "system", content: locationPrompt },
                { role: "user", content: `Difficulty: ${difficulty}` }
            ],
            model: "gpt-4o",
            max_tokens: 2000,
            response_format: { type: "json_object" }
        });
    
        console.log(completion.choices[0].message.content);
        const ans = JSON.parse(completion.choices[0].message.content!);
        return ans;
      }
}

export default new OpenAIService(new OpenAI());