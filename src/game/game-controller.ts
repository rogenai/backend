import { Request, Response } from 'express';
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

const levelPrompt = `
Game map contains 1 - enemy spawn 0 - empty tile 2 - wall and 3 - player spawn. Player spawn can be only placed once. The walls should not block the player's path. Your task is to create game map from description. Minimum 7x7. Maximum 30x30. Do not print any other symbols. Example:

Description: banana, apple
Your answer:
{
    "map": [
        [0, 0, 1, 1, 0, 1, 0],
        [0, 0, 2, 2, 0, 2, 2],
        [0, 0, 2, 1, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 2, 2, 2, 2],
        [2, 0, 0, 0, 0, 0, 0]
    ]
}
`;

const weaponPrompt = `
Your task is to choose one image from given that is the most suitable for given description. Output example:
{
    "number": 2
}
`

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
                    { role: "system", content: weaponPrompt },
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
                    { role: "system", content: levelPrompt },
                    { role: "user", content: `Description: ${req.body.description}` }
                ],
                model: "gpt-4o",
            });

            const ans = JSON.parse(completion.choices[0].message.content!);
            res.status(200).json(ans);
        }
        catch (err: any) {
            res.status(500).send('Server Error');
            console.log(err.message);
        }
    }
}