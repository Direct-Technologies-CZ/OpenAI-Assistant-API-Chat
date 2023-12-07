import { fetchAssistantsFromLocalStorage, getNumberOfSavedAssistants, removeAssistantFromLocalStorage } from "@/app/utils/localStorageAssistants";
import { useEffect, useState } from "react";

export interface StoredAssistant {
    assistantName: string;
    assistantDescription: string;
    assistantId: string;
    threadId: string;
}


const AssistantList = () => {
    const [savedAssistants, setSavedAssistants] = useState<Array<StoredAssistant>>()
    useEffect(() => {
        setSavedAssistants(fetchAssistantsFromLocalStorage());
    }, [savedAssistants])

    const deleteAssistant = (assistantId: string) => {
        removeAssistantFromLocalStorage(assistantId);
        setSavedAssistants(savedAssistants!.filter(assistant => assistant.assistantId !== assistantId));
    };

    return <div className="flex flex-col space-y-3">
        {savedAssistants?.map((assistant) => (
            <div key={assistant.assistantId} className="flex space-x-2">
                <button
                    type="button"
                    // onClick={() => startExistingAssistant(assistant.assistantId, assistant.threadId)}
                    className={`p-2 rounded-md flex-1 justify-center items-center relative overflow-hidden bg-green-500 text-white`}
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
}

export default AssistantList;