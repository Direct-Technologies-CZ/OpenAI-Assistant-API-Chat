// File: app/api/downloadFile/[file_id]/route.ts

import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest and NextResponse from 'next/server'
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest, { params }: { params: { file_id: string, disposition : string } }) {
    // Extract the file_id from the dynamic route parameter
    const { file_id, disposition } = params;

    // Validate the file_id
    if (!file_id) {
        // Return a response with a 400 status code
        return new Response(JSON.stringify({ error: 'A valid file ID is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Construct the URL for the OpenAI API call

    try {
        // Make a GET request to the OpenAI API to retrieve the file content

        let fileResponse = await openai.files.retrieve(file_id);
        let contentResponse = await openai.files.content(file_id);

        const fileName = fileResponse.filename;

        // Check if the OpenAI API response is OK
        if (!contentResponse.ok) {
            // Return a response with the status code from the OpenAI response
            return new NextResponse(JSON.stringify({ error: 'Failed to retrieve file content from OpenAI' }), {
                status: contentResponse.status,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Get the file content from the OpenAI API response
        const fileContent = contentResponse.body;

        // Create a new response for the file download
        const headers = new Headers();
        headers.set('Content-Disposition', `${disposition}; filename="${fileName}"`);

        return new NextResponse(fileContent, {
            status: 200, // or other appropriate status code
            headers: headers,
        });
    } catch (error) {
        // Handle any errors that occur during the API request
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
