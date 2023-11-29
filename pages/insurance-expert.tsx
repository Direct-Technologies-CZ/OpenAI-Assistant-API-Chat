// app/page.tsx
"use client";


import {LinkBar, MessageList, WelcomeForm, InputForm} from '../app/components';
import {useChatState, useChatManager, useStartAssistant} from '@/app/hooks';

import "../app/globals.css";

const assId = 'asst_c9T3MrMSRkMqHSSVMNJ5Exgp'


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
        setIsLoadingFirstMessage,
        chatUploadedFiles = [], setChatUploadedFiles,
        chatFileDetails, setChatFileDetails,
    } = useChatState();

    useChatManager(setChatMessages, setStatusMessage, setChatManager, setIsMessageLoading, setProgress, setIsLoadingFirstMessage);
    useStartAssistant(assId, chatManager, 'Introduce yourself');

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
                await chatManager.sendMessage(message, currentFiles, chatFileDetails);// Send the saved files
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsSending(false);
            }
        }
    };

    //This function takes an array of File objects (the files selected by the user) and uses the setFiles function to update the files state.
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

    return (
        <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
            <img src="https://www.direct-technologies.cz/static/header/direct-technologies-black.svg" alt="logo"
                 style={{width: "100px", marginTop: "10px", marginBottom: "20px"}}/>
            {chatHasStarted || assId || isLoadingFirstMessage ? (
                <MessageList chatMessages={chatMessages} statusMessage={statusMessage} isSending={isSending} progress={progress} isFirstMessage={isLoadingFirstMessage} fileDetails={chatFileDetails} />
            ) : (
                <span>navazuji komunikaci s GPT ...</span>
            )}
            <InputForm {...{input: inputmessage, setInput: setInputmessage, handleFormSubmit, inputRef, formRef, disabled: isButtonDisabled || !chatManager, chatStarted: chatMessages.length > 0, isSending, isLoading: isMessageLoading, handleChatFilesUpload, chatFileDetails, removeChatFile}} />
        </main>
    );
}
