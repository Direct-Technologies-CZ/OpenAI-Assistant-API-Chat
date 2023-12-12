
"use client";



import "@/app/globals.css";
import { NextPage } from 'next';
import AssistantList from '@/app/components/AssistantList';
import { useChatState } from "@/app/hooks/useChatState";
import { useChatManager } from "@/app/hooks/useChatManager";
import { useStartAssistant } from "@/app/hooks/useStartAssistant";
import LinkBar from "@/app/components/LinkBar";
import { InputForm, MessageList } from "@/app/components";
import { addAssistantThreadToLocalStorage, saveAssistantsToLocalStorage } from "@/app/utils/localStorageAssistants";
import AssistantList2 from "@/app/components/AssistantList2";
import { useState } from "react";



const StoredAssistantsPage: NextPage = () => {

    const {
        assistantName, setAssistantName,
        assistantModel, setAssistantModel,
        assistantDescription, setAssistantDescription,
        inputmessage, setInputmessage,
        chatMessages, setChatMessages,
        isButtonDisabled, setIsButtonDisabled,
        files = [], setFiles,
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
        setIsLoadingFirstMessage,
        chatUploadedFiles = [], setChatUploadedFiles,
        chatFileDetails, setChatFileDetails,
    } = useChatState();


    useChatManager(setChatMessages, setStatusMessage, setChatManager, setIsMessageLoading, setProgress, setIsLoadingFirstMessage);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSending) {
            return;
        }
        const message = inputmessage;
        setInputmessage('');
        setIsSending(true);
        if (chatManager) {
            const currentFiles = chatUploadedFiles; // Save current files
            setChatUploadedFiles([]); // Reset the state after files are uploaded
            setChatFileDetails([]); // Reset the file details state
            try {
                await chatManager.sendMessage(message, currentFiles, chatFileDetails); // Send the saved files and file details
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsSending(false);
            }
        }
    };

    const handleFilesChange = (selectedFiles: File[]) => setFiles(selectedFiles);

    const handleChatFilesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            if (chatFileDetails.length + newFiles.length > 10) {
                alert('You can only upload up to 10 files.');
                return;
            }
            const fileArray = newFiles.map((file) => ({
                name: file.name,
                type: file.type,
                size: file.size,
            }));
            setChatFileDetails(prevFiles => [...prevFiles, ...fileArray]);
            setChatUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
        event.target.value = ''; // Clear the input's value
    };

    const removeChatFile = (fileName: string) => {
        const updatedFileDetails = chatFileDetails.filter((file) => file.name !== fileName);
        setChatFileDetails(updatedFileDetails);

        const updatedUploadedFiles = chatUploadedFiles.filter((file) => file.name !== fileName);
        setChatUploadedFiles(updatedUploadedFiles);
    };

    const startExistingAssistant = async (assistantId: string | null, threadId?: string | null) => {
        setIsButtonDisabled(true);
        setStartLoading(true);
        if (chatManager && threadId !== null) {
            try {
                await chatManager.resumeExistingAssistantThread(assistantId!, threadId!);
                console.log('Assistant resumed:', chatManager.getChatState());
                setChatStarted(true);

            } catch (error) {
                console.error('Error starting assistant:', error);
                if (error instanceof Error) setStatusMessage(`Error: ${error.message}`);
            } finally {
                setIsButtonDisabled(false);
                setStartLoading(false);
            }
        } else if (chatManager) {
            try {
                await chatManager.startAssistantWithId(assistantId!, "x");
                console.log('Assistant started:', chatManager.getChatState());
                const { threadId } = chatManager.getChatState()
                addAssistantThreadToLocalStorage(assistantId!, threadId!)
                setChatStarted(true);

            } catch (error) {
                console.error('Error starting assistant:', error);
                if (error instanceof Error) setStatusMessage(`Error: ${error.message}`);
            } finally {
                setIsButtonDisabled(false);
                setStartLoading(false);
            }
        }
    };


    return (
        <>




            <main className="flex flex-col items-center justify-between pb-40">
                <LinkBar />

                {chatHasStarted || assistantId || isLoadingFirstMessage ? (
                    <><MessageList chatMessages={chatMessages} statusMessage={statusMessage} isSending={isSending} progress={progress} isFirstMessage={isLoadingFirstMessage} fileDetails={chatFileDetails} /><InputForm {...{ input: inputmessage, setInput: setInputmessage, handleFormSubmit, inputRef, formRef, disabled: isButtonDisabled || !chatManager, chatStarted: chatMessages.length > 0, isSending, isLoading: isMessageLoading, handleChatFilesUpload, chatFileDetails, removeChatFile }} /></>
                ) : (
                  <AssistantList startExistingAssistant={startExistingAssistant} />
                )}



            </main></>
    );
}

export default StoredAssistantsPage