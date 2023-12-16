import {InputForm} from '@/app/components';
import "@/app/globals.css";
import AssistantList from '@/app/components/lists/AssistantList';
import MessageList from '@/app/components/lists/MessageList';
import LinkBar from '@/app/components/navigation/LinkBar';
import {useChatManager} from '@/app/hooks/useChatManager';
import {useChatState} from '@/app/hooks/useChatState';
import {addAssistantThreadToLocalStorage} from '@/app/utils/localStorageAssistants';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import {useEffect} from 'react';


const RunAssistantPage: NextPage = () => {

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

    const router = useRouter();
    const {query} = router;

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        await handleSubmit(e, 'message');
    }

    const handlePaintSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        await handleSubmit(e, 'paint');
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>, type: string) {
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
                await chatManager.sendMessage(message, type, currentFiles, chatFileDetails); // Send the saved files and file details
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsSending(false);
            }
        }
    }

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
        console.log('start existing assistant ' + assistantId + ' ' + threadId)
        setIsButtonDisabled(true);
        setStartLoading(true);
        if (chatManager && threadId !== null) {
            try {
                await chatManager.resumeExistingAssistantThread(assistantId!, threadId!);
                console.log('Assistant resumed:', chatManager.getChatState());
                setChatStarted(true);
                addAssistantThreadToLocalStorage(assistantId!, threadId!)
            } catch (error) {
                console.error('Error starting assistant:', error);
                if (error instanceof Error) setStatusMessage(`Error: ${error.message}`);
            } finally {
                setIsButtonDisabled(false);
                setStartLoading(false);
            }
        } else if (chatManager) {
            try {
                await chatManager.startAssistantWithId(assistantId!, initialThreadMessage || "Say hi to user!");
                console.log('Assistant started:', chatManager.getChatState());
                const {threadId} = chatManager.getChatState()
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
        if (chatManager && (!('thread' in router.query) || router.query.thread === null || router.query.thread === 'null')) {
            const {threadId} = chatManager.getChatState();
            await router.push(`/runAssistant?assistant=${assistantId}&thread=${threadId}`);
        }
    }

    useEffect(() => {

        if (typeof query.initialMessage === 'string' && query.initialMessage.length > 0) {
            // if you get an initial message in query, set initial message state from chat manager
            setInitialThreadMessage(query.initialMessage)
        }
        // if you get both query assistant and query thread run the assistant id and thread
        if (typeof query.assistant === "string" && typeof query.thread === "string" && query.assistant !== 'null' && query.thread !== 'null') {
            startExistingAssistant(query?.assistant!, query.thread)
        } else if (typeof query.assistant === "string" && query.assistant !== 'null' && !((typeof query.assistant === "string" && query.assistant !== "null" && query.thread === "null"))) {
            // if you get only assistant query and no thread query start a new thread with existing assistant, for aesthetic URL purposes
            startExistingAssistant(query?.assistant!, null)
        } else if (typeof query.assistant === "string" && query.assistant !== "null" && query.thread === "null") {
            // identical functionality to first block but not so aesthetic - if you get only the assistant id query and the thread is null, start a new thread with the existing assistant
            startExistingAssistant(query?.assistant!, null)
        }

    }, [chatManager, query]);

    return (
        <>
            <main className="flex flex-col items-center justify-between pb-40">
                <LinkBar/>

                {chatHasStarted || assistantId || isLoadingFirstMessage ? (
                    <><MessageList chatMessages={chatMessages} statusMessage={statusMessage} isSending={isSending}
                                   progress={progress} isFirstMessage={isLoadingFirstMessage}
                                   fileDetails={chatFileDetails}/><InputForm {...{input: inputmessage, setInput: setInputmessage, handleFormSubmit, handlePaintSubmit, inputRef, formRef, disabled: isButtonDisabled || !chatManager, chatStarted: chatMessages.length > 0, isSending, isLoading: isMessageLoading, handleChatFilesUpload, chatFileDetails, removeChatFile}} /></>
                ) : (
                    <><p> Running assistant with id: {query.assistant}    </p>{query.thread &&
                        <p> With the thread {query.thread} </p>} {query.initialMessage &&
                        <p> With the initial message {query.initialMessage}</p>}</>


                )}
            </main>
        </>)
};

export default RunAssistantPage;