import { Request, Response } from 'express';
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

export class GameController {
    constructor() {}

    async generateWeapon(req: Request, res: Response) {
        try {
            const files = fs.readdirSync('./public/items');
            const images = files.map(file => {
                return {
                    type: "image_url",
                    image_url: {
                        url: `http://157.245.2.36:3000/items/${file}`
                    }
                }
            });
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: 
                    `Your task is to choose one image from given that is the most suitable for given description. Output example:
                    {
                        "number": 2
                    }`                  
                    },
                    { role: "user", content: [...images, {
                        type: "text",
                        text: `Description: ${req.body.description}`
                    } as any]}
                ],
                model: "gpt-4o",
            });

            const number = JSON.parse(completion.choices[0].message.content!).number;
            res.status(200).json({ response: files[number - 1] });
        }
        catch (err: any) {
            res.status(500).send('Server Error');
            console.log(err.message);
        }
    }

    async generateLevel(req: Request, res: Response) {
        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "Your task is to print out grid that contains only ." },
                    { role: "user", content: `Description: ${req.body.description}`}
                ],
                model: "gpt-4o",
            });
        }
        catch (err: any) {
            res.status(500).send('Server Error');
            console.log(err.message);
        }
    }
}