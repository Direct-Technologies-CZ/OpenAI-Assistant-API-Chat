/**
 * API Route - List Runs in a Thread
 *
 * This API route is responsible for retrieving runs from a specific chat thread using the OpenAI API.
 * It processes POST requests that include a 'threadId' in the form data. The route fetches the runs
 * associated with the provided thread ID and returns them in a structured JSON format. It's designed to
 * facilitate the tracking and review of runs created and managed via OpenAI's GPT models.
 *
 * Path: /api/listRuns
 */

import { Message } from '@/app/components/lists/MessageList';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

// Initialize OpenAI client using the API key from environment variables
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
}); 

// Define an asynchronous POST function to handle incoming requests
export async function POST(req: NextRequest) {
  try {
    // Extract JSON data from the request
    const data = await req.json();

    // Retrieve 'threadId' from JSON data
    const threadId = data.threadId;

    // Log the received thread ID for debugging
    console.log(`Received request with threadId: ${threadId}`);

    // Retrieve messages for the given thread ID using the OpenAI API
    const runs = await openai.beta.threads.runs.list(threadId)
    
    console.log(runs.data)
    // Reverse array 
    

    // Log the count of retrieved messages for debugging
    console.log(`Retrieved ${runs.data.length} runs`);


    // Return the retrieved messages as a JSON response
    return NextResponse.json({ ok: true, runs: runs.data });
  } catch (error) {
    // Log any errors that occur during the process
    console.error(`Error occurred: ${error}`);
  }
}