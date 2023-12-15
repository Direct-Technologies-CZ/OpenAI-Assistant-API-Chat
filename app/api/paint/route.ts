import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {

    const data = await req.json();
    console.log('paint data : ' + data);
    const input = data.message;


    let response = await openai.images.generate({
        model: "dall-e-3",
        prompt: input,
        size: "1024x1024",
        quality: "standard",
        n: 1});

    const url = response.data[0].url;

    return NextResponse.json({ message: "Message created successfully", url: url });


  } catch (error) {
    // Error handling with detailed logging
    if (error instanceof Error) {
      console.error('Error:', error);
      return NextResponse.json({ error: error.message });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ error: 'An unknown error occurred' });
    }
  }
}