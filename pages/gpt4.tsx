// app/page.tsx
"use client";

import React, {useState, useEffect, useRef} from "react";
import ChatManager from '../app/services/ChatManager';
import LinkBar from '../app/components/LinkBar';
import MessageList from '../app/components/MessageList';
import WelcomeForm from '../app/components/WelcomeForm';
import InputForm from '../app/components/InputForm';
import {useChatState} from '@/app/hooks/useChatState';

import "../app/globals.css";

const assId = 'asst_aoXDGMp04YBqRQuaRO9ilXGT'

export default function Chat() {
    const {
        assistantName, setAssistantName,
        assistantModel, setAssistantModel,
        assistantDescription, setAssistantDescription,
        inputmessage, setInputmessage,
        chatMessages, setChatMessages,
        isButtonDisabled, setIsButtonDisabled,
        file = null, setFile,
        isStartLoading, setStartLoading,
        statusMessage, setStatusMessage,
        isSending, setIsSending,
        inputRef,
        formRef,
        initialThreadMessage,
        setInitialThreadMessage

    } = useChatState();

    // Initialize ChatManager only once using useEffect
    const [chatManager, setChatManager] = useState<ChatManager | null>(null);

    // Add a state to track loading status of message sending
    const [isMessageLoading, setIsMessageLoading] = useState(false);

    useEffect(() => {


        startChatAssistant().then(() => {
            console.log('assistant started');
        });
        // Update isMessageLoading based on the chatManager's isLoading state


    }, [setChatMessages, setStatusMessage]);

    // Update chat state and handle assistant response reception


    const startChatAssistant = async () => {
        console.log('start chat assistant')
        setIsButtonDisabled(true);
        setStartLoading(true);

        const chatManagerInstance = ChatManager.getInstance(setChatMessages, setStatusMessage);
        setChatManager(chatManagerInstance);

        if (chatManagerInstance) {
            setIsMessageLoading(chatManagerInstance.getChatState().isLoading);
            try {
                let searchParams = new URLSearchParams(window.location.search);
                let assistantIdParam = searchParams.get("assistantId");

                if (!assistantIdParam) {
                    assistantIdParam = assId;
                }
                const assistantId = assistantIdParam;
                await chatManagerInstance.startAssistantById(assistantId, 'Introduce yourself');
                console.log('Assistant started:', chatManagerInstance.getChatState());
            } catch (error) {
                console.error('Error starting assistant:', error);
                if (error instanceof Error) setStatusMessage(`Error: ${error.message}`);
            } finally {
                setIsButtonDisabled(false);
                setStartLoading(false);
            }

        }

    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // If a message is being sent, return immediately
        if (isSending) {
            return;
        }
        // Save the message
        const message = inputmessage;
        // Clear the input
        setInputmessage('');
        // Disable sending
        setIsSending(true);
        if (chatManager) {
            try {
                await chatManager.sendMessage(message);
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                // Enable sending
                setIsSending(false);
            }
        }
    };
    const handleFileChange = (selectedFile: File) => setFile(selectedFile);

    return (
        <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
            <img src="https://www.direct-technologies.cz/static/header/direct-technologies-black.svg" alt="logo" style={{width: "100px", marginTop:"10px", marginBottom: "20px"}}/>
            {chatMessages.length > 0 ? (
                <MessageList chatMessages={chatMessages}/>
            ) : (
                <span>navazuji komunikaci s GPT ...</span>
            )}
            <InputForm {...{input: inputmessage, setInput: setInputmessage, handleFormSubmit, inputRef, formRef, disabled: isButtonDisabled || !chatManager, chatStarted: chatMessages.length > 0, isSending, isLoading: isMessageLoading}} />
        </main>
    );
}
