// app/page.tsx
"use client";


import {LinkBar, MessageList, WelcomeForm, InputForm} from '../app/components';
import {useChatState, useChatManager, useStartAssistant} from '@/app/hooks';

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
        files = null, setFiles,
        isStartLoading, setStartLoading,
        statusMessage, setStatusMessage,
        isSending, setIsSending,
        inputRef,
        formRef,
        initialThreadMessage,
        setInitialThreadMessage,
        setChatStarted,
        chatStarted: chatHasStarted,
        chatManager, setChatManager,
        assistantId,
        isMessageLoading, setIsMessageLoading,
        progress, setProgress,
        isLoadingFirstMessage,
        setIsLoadingFirstMessage
    } = useChatState();

    useChatManager(setChatMessages, setStatusMessage, setChatManager, setIsMessageLoading, setProgress, setIsLoadingFirstMessage);
    useStartAssistant(assId, chatManager, 'Introduce yourself');

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

    return (
        <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
            <img src="https://www.direct-technologies.cz/static/header/direct-technologies-black.svg" alt="logo"
                 style={{width: "100px", marginTop: "10px", marginBottom: "20px"}}/>
            {chatHasStarted || assId || isLoadingFirstMessage ? (
                <MessageList chatMessages={chatMessages} statusMessage={statusMessage} isSending={isSending}
                             progress={progress} isFirstMessage={isLoadingFirstMessage}/>
            ) : (
                <span>navazuji komunikaci s GPT ...</span>
            )}
            <InputForm {...{input: inputmessage, setInput: setInputmessage, handleFormSubmit, inputRef, formRef, disabled: isButtonDisabled || !chatManager, chatStarted: chatMessages.length > 0, isSending, isLoading: isMessageLoading}} />
        </main>
    );
}
