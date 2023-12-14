/**
 * API Route - Fetch assistant response message
 *
 * This API route is responsible for retrieving the assistant response message from a specific chat thread using the OpenAI API.
 * It processes POST requests that include a 'threadId' in the form data. The route fetches the message
 * associated with the provided thread ID and returns it in a structured JSON format.
 *
 * Path: /api/getAssistantResponse
 */

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
    const messages = await openai.beta.threads.messages.list(threadId);
    
    // Log the count of retrieved messages for debugging
    console.log(`Retrieved ${messages.data.length} messages`);


    console.log(messages)
    
    // Find the first assistant message
    const assistantMessage = messages.data.find(message => message.role === 'assistant');

    if (!assistantMessage) {
      return NextResponse.json({ error: "No assistant message found" });
    }

    const assistantMessageContent = assistantMessage.content.at(0);
    if (!assistantMessageContent) {
      return NextResponse.json({ error: "No assistant message content found" });
    }


    if(assistantMessageContent.type === "text"){
        let text = assistantMessageContent.text.value;
        const annotations = assistantMessageContent.text.annotations;
        annotations.forEach((annotation) => {
            if (annotation.type === "file_path") {
                const filePath = annotation.text;
                const fileId = annotation.file_path.file_id;
                const downloadPath = `/api/downloadFile/${fileId}`;
                // Create a regex pattern to match the markdown link format
                const pattern = new RegExp(`\\[([^\\]]+)\\]\\(${filePath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\)`, 'g');
                text = text.replace(pattern, (match, p1) => `[${p1}](${downloadPath})`);
            }
        });
        return NextResponse.json({ ok: true, messages: text });
    }
    console.log(assistantMessageContent.type);
    if(assistantMessageContent.type === "image_file"){
        const filePath = assistantMessageContent.image_file.file_id;
        const downloadPath = `/api/downloadImage/${filePath}`;
        console.log(downloadPath);

        const text = `![${filePath}](${downloadPath})`;

        console.log(text);
        return NextResponse.json({ ok: true, messages: text});
    }

    // Return the retrieved messages as a JSON response
    return NextResponse.json({ ok: false, messages: "Error" });
  } catch (error) {
    // Log any errors that occur during the process
    console.error(`Error occurred: ${error}`);
  }
}