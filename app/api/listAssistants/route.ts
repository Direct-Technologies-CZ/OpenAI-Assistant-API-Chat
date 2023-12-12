/**
 * API Route - List Assistants
 *
 * This API route is responsible for retrieving assistants from your account using the OpenAI API.
 * It is a simple GET request. The route fetches the assistants
 * associated with the provided api key and returns them in a structured JSON format. It's designed to
 * retrieve your assistants created using OpenAI's GPT models.
 *
 * Path: /api/listAssistants
 */

import { Message } from '@/app/components/MessageList';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

// Initialize OpenAI client using the API key from environment variables
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
}); 

// Define an asynchronous POST function to handle incoming requests
export async function POST(req: NextRequest) {
  console.log("here!")
  try {

    const data = await req.json();
    const {limit, after, before } = data;

    // Log the received thread ID for debugging
    console.log(`Fetching all assistants`);

    // Retrieve messages for the given thread ID using the OpenAI API
    const assistants = await openai.beta.assistants.list({limit: limit, after: after, before: before})
    
    // Log the list of assistants
    console.log(assistants.data)
    
    // Log the count of retrieved messages for debugging
    console.log(`Retrieved ${assistants.data.length} assistants`);

    // Return the retrieved messages as a JSON response
    return NextResponse.json({ ok: true, assistants: assistants.data });
  } catch (error) {
    // Log any errors that occur during the process
    console.error(`Error occurred: ${error}`);
  }
}