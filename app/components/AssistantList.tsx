import { fetchAssistantsFromLocalStorage, getNumberOfSavedAssistants, removeAssistantFromLocalStorage } from "@/app/utils/localStorageAssistants";
import { FC, useEffect, useState } from "react";

export interface StoredAssistant {
    assistantName: string;
    assistantDescription: string;
    assistantId: string;
    threadId: string;
}


interface AssistantListProps {
    startChatAssistant: (assistantId: string, threadId: string) => void
}

const AssistantList: FC<AssistantListProps> = ({ startChatAssistant }) => {
    const [savedAssistants, setSavedAssistants] = useState<Array<StoredAssistant>>()
    useEffect(() => {
        setSavedAssistants(fetchAssistantsFromLocalStorage());
    }, [])

    const deleteAssistant = (assistantId: string) => {
        removeAssistantFromLocalStorage(assistantId);
        setSavedAssistants(savedAssistants!.filter(assistant => assistant.assistantId !== assistantId));
    };

    return <div className="flex flex-col space-y-3">
        {savedAssistants?.map((assistant) => (
            <div key={assistant.assistantId} className="flex space-x-2">
                <button
                    type="button"
                    onClick={() => startChatAssistant(assistant.assistantId, assistant.threadId)}
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