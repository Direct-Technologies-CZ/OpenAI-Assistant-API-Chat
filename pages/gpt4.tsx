//app/page.tsx
"use client";

import MessageList from '../app/components/MessageList';
import InputForm from '../app/components/InputForm';
import {useRef, useState} from "react";
import {useChat} from "ai/react";
import va from "@vercel/analytics";
import {
    createThread,
    runAssistant,
    checkRunStatus,
    listMessages,
    addMessage,
} from '@/app/api';

import "../app/globals.css";

// Chat component that manages the chat interface and interactions
export default function Chat() {
    // Refs for form and input elements
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Custom hook to manage chat state and interactions
    const {input, setInput, isLoading} = useChat({
        // Error handling callback
        onError: (error) => {
            va.track("Chat errored", {
                input,
                error: error.message,
            });
        },
    });

    // Determine if the chat interface should be disabled
    const disabled = isLoading || input.length === 0;

    // State variables for managing various aspects of the chat assistant
    const [chatMessages, setChatMessages] = useState<{ role: string; content: any; }[]>([]);
    const [chatStarted, setChatStarted] = useState(true);
    const [assistantId, setAssistantId] = useState('asst_aoXDGMp04YBqRQuaRO9ilXGT');
    const [threadId, setThreadId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);


    if (threadId) {
    } else {
        startAssistant();
    }

    // Handler for form submissions
    const handleFormSubmit = async (e: any) => {
        e.preventDefault();
        console.log('Handling form submission.');

        setIsSending(true);
        setChatMessages(prevMessages => [...prevMessages, {role: 'user', content: input}]);
        setInput('');

        let data = {input, threadId};

        console.log('Sending message to addMessage API endpoint.');
        const addMessageData = await addMessage(data);
        console.log('Message sent to addMessage API endpoint.');

        console.log('Invoking runAssistant API endpoint.');
        const runAssistantData = await runAssistant(assistantId, threadId);
        console.log('Received response from runAssistant API endpoint.');

        let status = runAssistantData.status;
        while (status !== 'completed') {
            const statusData = await checkRunStatus(threadId, runAssistantData.runId);
            status = statusData.status;
            console.log('Checking assistant response status:', status);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('Fetching messages from listMessages API endpoint.');
        const listMessagesData = await listMessages(threadId, runAssistantData.runId);
        console.log('Messages retrieved from listMessages API endpoint.');
        setIsSending(false);

        if (listMessagesData.ok) {
            console.log('Adding assistant\'s message to the chat.');
            setChatMessages(prevMessages => [...prevMessages, {role: 'assistant', content: listMessagesData.messages}]);
        } else {
            console.error('Error retrieving messages:', listMessagesData.error);
        }
    };


    async function startAssistant() {

        console.log('Creating thread.');
        const threadData = await createThread('Introduce yourself');
        const threadId = threadData.threadId;

        setThreadId(threadId);
        setChatStarted(true);

        console.log('Chat with assistant started successfully.');
    }

    return (
        <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
			<img src="https://www.direct-technologies.cz/static/header/direct-technologies-black.svg" alt="logo" style={{width: "100px", marginTop:"10px", marginBottom: "20px"}}/>
            Jak ti mohu dneska pomoci?
            <MessageList chatMessages={chatMessages}/>

            <InputForm
                input={input}
                setInput={setInput}
                handleFormSubmit={handleFormSubmit}
                inputRef={inputRef}
                formRef={formRef}
                disabled={disabled}
                chatStarted={chatStarted}
                isSending={isSending}
            />
        </main>
    );
};