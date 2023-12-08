import { listAssistants } from "@/app/services/api";
import { clearAssistantThreadFromLocalStorage, fetchAssistantsFromLocalStorage, removeAssistantFromLocalStorage } from "@/app/utils/localStorageAssistants";
import { FC, useEffect, useState } from "react";

export interface StoredAssistant {
    assistantName: string | null;
    assistantDescription: string | null;
    assistantId: string | null;
    threadId: string | null;
}

interface AssistantListProps {
    startExistingAssistant: (assistantId: string | null, threadId: string | null) => void
}

const AssistantList: FC<AssistantListProps> = ({ startExistingAssistant }) => {
    const [savedAssistants, setSavedAssistants] = useState<StoredAssistant[]>([]);

    useEffect(() => {
        const fetchAssistantList = async () => {
            await listAssistants();
        }

        console.log(fetchAssistantList())
        setSavedAssistants(fetchAssistantsFromLocalStorage());
        
    }, []);


      useEffect(() => {
        console.log(savedAssistants)
    
    }, [savedAssistants]);

    const deleteAssistant = (assistantId: string) => {
        removeAssistantFromLocalStorage(assistantId);
        setSavedAssistants(savedAssistants.filter(assistant => assistant.assistantId !== assistantId));
    };

    const clearAssistantThread = (assistantId: string) => {
        clearAssistantThreadFromLocalStorage(assistantId);
        setSavedAssistants(savedAssistants.map(assistant => assistant.assistantId === assistantId ? { ...assistant, threadId: null } : assistant));
    };

    return (
     savedAssistants.length !== 0 ? (<div className="flex flex-col space-y-3">
            {savedAssistants.map((assistant) => (
                <div key={assistant.assistantId} className="flex items-center p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold pr-4">{assistant.assistantName}</h3>
                    <div className="flex space-x-2 mt-2">
                        <button
                            type="button"
                            onClick={() => {
                                startExistingAssistant(assistant.assistantId, assistant.threadId)
                            }}


                            className="flex-1 bg-green-500 hover:bg-green-600 text-white p-2 rounded-md"
                        >
                            Start
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                            onClick={() => deleteAssistant(assistant.assistantId!)}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md"
                            onClick={() => clearAssistantThread(assistant.assistantId!)}
                        >
                            Clear thread
                        </button>
                    </div>
                </div>
            ))}
        </div>) : (<div className="text-lg font-semibold">No stored assistants. Would you like to <span><a className="underline" href="/">create</a></span> one?</div>)
    );
};

export default AssistantList;