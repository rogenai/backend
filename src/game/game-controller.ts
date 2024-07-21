import { Request, Response } from 'express';
import fs from "fs";
import { locationPrompt, weaponPrompt } from '../ai/prompts';
import { exampleMap2 } from '../ai/levels';

export class GameController {
    constructor() {}

    // async generateWeapon(req: Request, res: Response) {
    //     try {
    //         const files = fs.readdirSync('./public/items');
    //         const images = files.map(file => {
    //             return {
    //                 type: "image_url",
    //                 image_url: {
    //                     url: `http://157.245.2.36:3000/items/${file}`
    //                 }
    //             }
    //         });
    //         const completion = await openai.chat.completions.create({
    //             messages: [
    //                 { role: "system", content: weaponPrompt },
    //                 { role: "user", content: [...images, {
    //                     type: "text",
    //                     text: `Description: ${req.body.description}`
    //                 } as any]}
    //             ],
    //             model: "gpt-4o-mini",
    //             response_format: { type: "json_object" }
    //         });

    //         const number = JSON.parse(completion.choices[0].message.content!).number;
    //         console.log({ response: files[number - 1] });
    //         res.status(200).json({ response: files[number - 1] });
    //     }
    //     catch (err: any) {
    //         res.status(500).send('Server Error');
    //         console.log(err.message);
    //     }
    // }
}