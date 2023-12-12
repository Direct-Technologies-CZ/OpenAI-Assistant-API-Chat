import { listAssistants } from "@/app/services/api";
import { clearAssistantThreadFromLocalStorage, fetchAssistantThreadsFromLocalStorage} from "@/app/utils/localStorageAssistants";
import { FC, useEffect, useState } from "react";

export interface StoredAssistant {
    name: string | null;
    description: string | null;
    id: string | null;
    threadId?: string | null;
}

export interface LocalStoredAssistant {
    assistantName?: string | null;
    assistantDescription?: string | null;
    assistantId: string | null;
    threadId?: string | null;
}

interface AssistantListProps {
    startExistingAssistant: (assistantId: string | null, threadId: string | null) => void;
}


const AssistantList: FC<AssistantListProps> = ({ startExistingAssistant }) => {
    const [savedAssistants, setSavedAssistants] = useState<StoredAssistant[]>([]);
    const [allSavedAssistants, setAllSavedAssistants] = useState<StoredAssistant[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const assistantsPerPage = 20;
    const maxInitialFetchedAssistants = 100;
        
    
    const fetchInitialAssistantList = async () => {
        const res = await listAssistants(maxInitialFetchedAssistants);
        console.log(res)
        const updatedWithThreads = await fetchAssistantThreadsFromLocalStorage(res.assistants)
        setAllSavedAssistants(updatedWithThreads)
        const newSavedAssistants = updatedWithThreads.slice(0, assistantsPerPage)
        setSavedAssistants(newSavedAssistants)

    }
    

    useEffect(() => {
        fetchInitialAssistantList();
        
    }, []);

    useEffect(() => {
        if(currentPage === 0){
            setSavedAssistants([...allSavedAssistants.slice(0, assistantsPerPage)])
        } else {
            setSavedAssistants([...allSavedAssistants.slice(currentPage * assistantsPerPage, (currentPage + 1) * assistantsPerPage)])
        }
        
    
    }, [currentPage]);






        const getIndexOfLastDisplayedAssistant = () => {
        if(savedAssistants.length === 0) return
        const idOfLastDisplayedAssistant = savedAssistants[savedAssistants.length - 1].id
        return allSavedAssistants.indexOf(allSavedAssistants?.find((assistant) => assistant.id === idOfLastDisplayedAssistant)!)
    }

    const indexOfLastDisplayedAssistant = getIndexOfLastDisplayedAssistant()

      useEffect(() => {
     
        console.log(indexOfLastDisplayedAssistant)
    
    }, [indexOfLastDisplayedAssistant]);


    const clearAssistantThread = (assistantId: string) => {
        clearAssistantThreadFromLocalStorage(assistantId);
        setSavedAssistants(savedAssistants.map(assistant => assistant.id === assistantId ? { ...assistant, threadId: null } : assistant));
    };

    // Calculate the current items to show




    return (
        <div className="flex flex-col">
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>ID</th>
                        <th>Thread ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {savedAssistants.map((assistant, index) => (
                        <tr key={index} className="border-b">
                            <td>{assistant.name}</td>
                            <td>{assistant.description}</td>
                            <td>{assistant.id}</td>
                            <td>{assistant.threadId}</td>
                            <td>
                                <button onClick={() => startExistingAssistant(assistant.id, assistant.threadId || null)}>Start</button>
                                <button onClick={() => clearAssistantThread(assistant.id!)}>Clear thread</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between mt-4">
                {currentPage === 0 ? <p></p> : <button onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous
                </button>}
                {indexOfLastDisplayedAssistant! !== (allSavedAssistants.length - 1) && <button onClick={() => setCurrentPage(currentPage + 1)} >
                    Next
                </button>}
            </div>
        </div>
    );
};

export default AssistantList;
