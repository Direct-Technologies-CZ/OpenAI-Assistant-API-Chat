import { fetchAssistantsFromLocalStorage, removeAssistantFromLocalStorage } from "@/app/utils/assistantsLocalStorage";
import { useState, useEffect } from "react";

const AllAssistants = ({
    setAssistantId,
    startChatAssistant,
    setThreadId,
    isButtonDisabled,
    chatManager,
    setStatusMessage,
    isStartLoading,
    statusMessage,
}) => {

    const [assistants, setAssistants] = useState([]);

    const storedAssistants = fetchAssistantsFromLocalStorage();
    useEffect(() => {
        const storedAssistants = fetchAssistantsFromLocalStorage();
        setAssistants(storedAssistants);
    }, []);

    const deleteAssistant = (assistantId) => {
        removeAssistantFromLocalStorage(assistantId);
        setAssistants(assistants.filter(assistant => assistant.assistantId !== assistantId));
    };
    // ... code to update the state and re-render the component, if necessary


    const startExistingAssistant = async (assistantId, threadId) => {
        setAssistantId(assistantId); // Save the assistantId in state
        setThreadId(threadId); // Save the threadId in state

        if (chatManager && assistantId && threadId) {
            // setIsButtonDisabled(true);
            // setStartLoading(true);
            setStatusMessage(`Resuming conversation with Assistant ID: ${assistantId}`);
            try {
                // This is how you'd resume the assistant based on the new code
                // await chatManager.startAssistantWithId(assistantId, initialThreadMessage);
                await chatManager.getExistingAssistantWithId()

                console.log('Assistant resumed:', chatManager.getChatState());
                // Presumably, you'd want to update the UI to show the resumed conversation
            } catch (error) {
                console.error('Error resuming assistant:', error);
                if (error instanceof Error) setStatusMessage(`Error: ${error.message}`);
            } finally {
                // setIsButtonDisabled(false);
                // setStartLoading(false);
            }
        } else {
            setStatusMessage("ChatManager not initialized or missing assistant/thread ID.");
        }
    };

    return (
        <div className="border-gray-500 bg-gray-200 sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border-2 sm:w-full">
            <div className="flex flex-col space-y-4 p-7 sm:p-10">
                <h1 className="text-lg font-semibold text-black">Stored assistants!</h1>
                <div className="flex flex-col space-y-3">
                    {storedAssistants.map((assistant) => (
                        <div key={assistant.assistantId} className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => startExistingAssistant(assistant.assistantId, assistant.threadId)}
                                disabled={isButtonDisabled}
                                className={`p-2 rounded-md flex-1 justify-center items-center relative overflow-hidden ${isButtonDisabled ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-green-500 text-white'}`}
                            >
                                {assistant.assistantName}
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                                onClick={() => deleteAssistant(assistant.assistantId)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllAssistants;


