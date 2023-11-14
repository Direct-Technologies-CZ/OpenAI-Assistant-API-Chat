//app/page.tsx
"use client";

import { useEffect } from 'react';
import { useRef} from "react";
import { useChat } from "ai/react";
import va from "@vercel/analytics";
import MessageList from '../app/components/MessageList';
import InputForm from '../app/components/InputForm';
import { useChatState } from '../app/hooks/useChatState';
import {
    createThread,
    runAssistant,
    checkRunStatus,
    listMessages,
    addMessage,
} from '../app/services/api';

import "../app/globals.css";
import WelcomeForm from "@/app/components/WelcomeForm";

// Chat component that manages the chat interface and interactions
export default function Chat() {

    useEffect(() => {
        // Spustí metodu startAssistant při prvním načtení komponenty
        startAssistant();
    }, []);


    // Refs for form and input elements
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Custom hook to manage chat state and interactions
    const { input, setInput, isLoading} = useChat({
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

    const {
        assistantName, setAssistantName,
        assistantModel, setAssistantModel,
        assistantDescription, setAssistantDescription,
        inputmessage, setInputmessage,
        chatMessages, setChatMessages,
        chatStarted, setChatStarted,
        isButtonDisabled, setIsButtonDisabled,
        file, setFile,
        assistantId, setAssistantId,
        threadId, setThreadId,
        isStartLoading, setStartLoading,
        isSending, setIsSending,
        statusMessage, setStatusMessage,
        counter,
    } = useChatState();

    async function startAssistant() {
        setStatusMessage('Initializing chat assistant.');
        console.log('Initializing chat assistant.');
        setStartLoading(true);
        setIsButtonDisabled(true);


        setStatusMessage('Creating assistant.');
        console.log('Creating assistant.');

        const assistantId = 'asst_aoXDGMp04YBqRQuaRO9ilXGT';

        let searchParams = new URLSearchParams(window.location.search);


        setStatusMessage('Creating thread.');
        console.log('Creating thread.');
        const threadData = await createThread('Introduce yourself');
        const threadId = threadData.threadId;

        setStatusMessage('Running assistant.');
        console.log('Running assistant.');
        const runAssistantData = await runAssistant(assistantId, threadId);

        let checkRunStatusData;
        counter.current = 0;
        do {
            checkRunStatusData = await checkRunStatus(threadId, runAssistantData.runId);
            counter.current += 1; // Increment counter
            setStatusMessage(`Running assistant - ${checkRunStatusData.status} (${counter.current} seconds elapsed)`);
            console.log('Run status:', checkRunStatusData.status);

            if (["cancelled", "cancelling", "failed", "expired"].includes(checkRunStatusData.status)) {
                console.error(`Run stopped due to status: ${checkRunStatusData.status}`);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        } while (checkRunStatusData.status !== 'completed');


        // Log the threadId and runId being used
        console.log('Using threadId:', threadId, 'and runId:', runAssistantData.runId);
        console.log('Fetching messages from listMessages API endpoint.');
        const listMessagesData = await listMessages(threadId, runAssistantData.runId);

        // Log the entire response data
        console.log('Received data from listMessages:', listMessagesData);

        if (listMessagesData.ok) {
            setStatusMessage('Done');
            console.log('Message content:', listMessagesData.messages);
            setChatMessages(prevMessages => {
                console.log('Previous messages:', prevMessages);
                console.log('Adding new messages to chat');
                return [...prevMessages, { role: 'assistant', content: listMessagesData.messages }];
            });
            console.log('Setting isButtonDisabled to false');
            setIsButtonDisabled(false);
        } else {
            setStatusMessage('Error retrieving messages.');
            console.error('Error fetching messages');
        }

        setAssistantId(assistantId);
        setThreadId(threadId);
        setChatStarted(true);
        setStatusMessage('Done');
        console.log('Chat with assistant started successfully.');
    }

    // Handler for form submissions
    const handleFormSubmit = async (e:any) => {

        e.preventDefault();

        console.log('Handling form submission.');

        setIsSending(true);
        setChatMessages(prevMessages => [...prevMessages, { role: 'user', content: input }]);
        setInput('');

        let data = { input, threadId };

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
            setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: listMessagesData.messages }]);
        } else {
            console.error('Error retrieving messages:', listMessagesData.error);
        }
    };

    return (
        <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
            <img src="https://www.direct-technologies.cz/static/header/direct-technologies-black.svg" alt="logo" style={{width: "100px", marginTop:"10px", marginBottom: "20px"}}/>

            {chatMessages.length > 0 ? (
                <MessageList chatMessages={chatMessages} />
            ) : (
                <span>navazuji komunikaci s GPT ...</span>
            )}

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