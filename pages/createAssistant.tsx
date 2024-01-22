// app/page.tsx

"use client";

import {LinkBar, MessageList, WelcomeForm, InputForm} from '@/app/components';
import {useChatState, useChatManager, useStartAssistant} from '@/app/hooks';
import {saveAssistantsToLocalStorage} from '@/app/utils/localStorageAssistants';
import AssistantList from "@/app/components/lists/AssistantList";
import "@/app/globals.css";
import {LoadingCircle} from "@/app/icons";
import React from "react";


const welcomeMessage = "Introduce yourself";
export default function Chat() {
    const {
        assistantName, setAssistantName,
        assistantModel, setAssistantModel,
        assistantDescription, setAssistantDescription,
        chatMessages, setChatMessages,
        files = [], setFiles,
        isStartLoading, setStartLoading,
        statusMessage, setStatusMessage,
        initialThreadMessage,
        setInitialThreadMessage,
        chatStarted: chatHasStarted,
        chatManager, setChatManager,
        assistantId,
        isMessageLoading, setIsMessageLoading,
        progress, setProgress,
        setIsLoadingFirstMessage,
    } = useChatState();

    useChatManager(setChatMessages, setStatusMessage, setChatManager, setIsMessageLoading, setProgress, setIsLoadingFirstMessage);
    useStartAssistant(assistantId, chatManager, initialThreadMessage || welcomeMessage);


    const startChatAssistant = async () => {

        setStartLoading(true);
        if (chatManager) {
            try {
                let initialMessage = initialThreadMessage || welcomeMessage;
                await chatManager.startAssistant({assistantName, assistantModel, assistantDescription}, files, initialMessage);
                console.log('Assistant started:', chatManager.getChatState());
                const {assistantId, threadId} = chatManager.getChatState()
                saveAssistantsToLocalStorage({assistantName, assistantDescription, assistantId: assistantId!, threadId: threadId!})
                const timer = setTimeout(() => {
                    window.location.href = `/runAssistant?assistant=${assistantId}&thread=${threadId}&initialMessage=${initialMessage}`;
                }, 10); // Redirect after 3 seconds
                return () => clearTimeout(timer);
            } catch (error) {
                console.error('Error starting assistant:', error);
                if (error instanceof Error) setStatusMessage(`Error: ${error.message}`);
            } finally {
                setStartLoading(false);
            }
        }
    };


    const handleFilesChange = (selectedFiles: File[]) => setFiles(selectedFiles);

    return (
        <main className="flex flex-col items-center justify-between pb-40 ">

            <LinkBar/>

            <WelcomeForm {...{assistantName, setAssistantName, assistantDescription, setAssistantDescription, assistantModel, setAssistantModel, files, handleFilesChange, startChatAssistant, isStartLoading, statusMessage, setInitialThreadMessage, initialThreadMessage}} />

        </main>
    );
}
