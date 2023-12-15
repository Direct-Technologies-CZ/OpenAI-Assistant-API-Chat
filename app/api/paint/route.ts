import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import {randomUUID} from "crypto";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Přechodné úložiště pro odpovědi
const responses = new Map<string, any>();

export async function POST(req: NextRequest) {
    const taskId = randomUUID(); // Generování unikátního UUID
    processRequest(req, taskId); // Zpracování požadavku na pozadí
    return NextResponse.json({ taskId }); // Okamžitý návrat s UUID
}

async function processRequest(req: NextRequest, taskId: string) {
    console.log('paint started ' + taskId);
    try {
        const data = await req.json();
        console.log('paint data : ' + data);
        const input = data.message;

        let response = await openai.images.generate({
            model: "dall-e-3",
            prompt: input,
            size: "1024x1024",
            quality: "standard",
            n: 1
        });

        const url = response.data[0].url;
        responses.set(taskId, { message: "Message created successfully", url: url }); // Uložení odpovědi
    } catch (error) {
        console.error('Error:', error);
        responses.set(taskId, { error: error }); // Uložení chyby
    }
    console.log('paint finished ' + taskId);
}

export async function GET(req: NextRequest) {
    const urlObj = new URL(req.url);
    const params = new URLSearchParams(urlObj.search);
    const taskId = params.get('taskId');

    console.log('paint status query: ' + taskId)
    if (!taskId || !responses.has(taskId)) {
        return NextResponse.json({ error: 'Task not found or not yet completed' });
    }

    const result = responses.get(taskId);

    return NextResponse.json({done: true, url: result.url});
}
