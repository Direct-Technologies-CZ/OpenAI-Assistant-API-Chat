/**
 * API Route - List Messages in a Thread
 *
 * This API route is responsible for retrieving messages from a specific chat thread using the OpenAI API.
 * It processes POST requests that include a 'threadId' in the form data. The route fetches the messages
 * associated with the provided thread ID and returns them in a structured JSON format. It's designed to
 * facilitate the tracking and review of conversation threads created and managed via OpenAI's GPT models.
 *
 * Path: /api/listMessages
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
    const messages = await openai.beta.threads.messages.list(threadId);
    
    const messageList: Message[] = [];
    messages.data.forEach((message) => {
     if(message.content[0].type === "text"){
         let text = message.content[0].text.value;
         const annotations = message.content[0].text.annotations;
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


      messageList.push({content: text, role: message.role})
     } else {
         if(message.content[0].type === "image_file"){
             const filePath = message.content[0].image_file.file_id;
             const downloadPath = `/api/downloadImage/${filePath}`;
             const text = `![${filePath}](${downloadPath})`;
             messageList.push({content: text, role: message.role})
         }
     }
    });
    
    // Reverse array 
    const reversedMessages = messageList.reverse()

    // Log the count of retrieved messages for debugging
    console.log(`Retrieved ${messageList.length} messages`);
    console.log(messageList)

    // Return the retrieved messages as a JSON response
    return NextResponse.json({ ok: true, messages: reversedMessages });
  } catch (error) {
    // Log any errors that occur during the process
    console.error(`Error occurred: ${error}`);
  }
}