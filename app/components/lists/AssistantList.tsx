import TextInput from "@/app/components/inputs/TextInput";
import Modal from "@/app/components/modals/Modal";
import { listAssistants } from "@/app/services/api";
import { clearAssistantThreadFromLocalStorage, fetchAssistantThreadsFromLocalStorage } from "@/app/utils/localStorageAssistants";
import { Dispatch, FC, SetStateAction, use, useEffect, useState } from "react";
import { threadId } from "worker_threads";

export interface StoredAssistant {
    name: string | null;
    description?: string | null;
    instructions?: string | null;
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
    setInitialThreadMessage: Dispatch<SetStateAction<string>>;
    initialThreadMessage: string;
}


const AssistantList: FC<AssistantListProps> = ({ startExistingAssistant, setInitialThreadMessage, initialThreadMessage }) => {
    const [savedAssistants, setSavedAssistants] = useState<StoredAssistant[]>([]);
    const [allSavedAssistants, setAllSavedAssistants] = useState<StoredAssistant[]>([]);
    const [shownInstructions, setShownInstructions] = useState<Record<string, boolean>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAssistantId, setCurrentAssistantId] = useState<string | null>(null);
    const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

    const toggleInstructions = (index: number) => {
        setShownInstructions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const [currentPage, setCurrentPage] = useState(0);
    // can change from 1-100
    const assistantsPerPage = 20;
    // can change from 20-100
    const maxInitialFetchedAssistants = 100;


    const fetchInitialAssistantList = async () => {
        const res = await listAssistants(maxInitialFetchedAssistants);
        const updatedWithThreads = await fetchAssistantThreadsFromLocalStorage(res.assistants)
        setAllSavedAssistants(updatedWithThreads)
        const newSavedAssistants = updatedWithThreads.slice(0, assistantsPerPage)
        setSavedAssistants(newSavedAssistants)
    }

    const handleStartExistingAssistant = (assistantId: string | null, threadId: string | null) => {
        // Perform any additional logic here, e.g., fetch the initial message
        setCurrentAssistantId(assistantId)
        setCurrentThreadId(threadId)
        setInitialThreadMessage(''); // Set the initial message if needed
        setIsModalOpen(true); // Open the modal
    };


    useEffect(() => {
        fetchInitialAssistantList();
    }, []);

    useEffect(() => {
        console.log(savedAssistants)
    }, [savedAssistants])

    useEffect(() => {
        if (currentPage === 0) {
            setSavedAssistants([...allSavedAssistants.slice(0, assistantsPerPage)])
        } else {
            setSavedAssistants([...allSavedAssistants.slice(currentPage * assistantsPerPage, (currentPage + 1) * assistantsPerPage)])
        }


    }, [currentPage]);






    const getIndexOfLastDisplayedAssistant = () => {
        if (savedAssistants.length === 0) return
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





    return (
        <>
            <Modal
                showModal={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                }}>

                <div className="space-y-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Initial Message</h3>
                    <p className="text-sm text-gray-600">
                        Set an initial message for the thread. If not set, it will default to "Say hi to user!"
                    </p>
                    <div className="pb-4">
                        <TextInput setInputValue={setInitialThreadMessage} inputValue={initialThreadMessage} />
                    </div>
                    <button onClick={() => {
                        setIsModalOpen(false);
                        startExistingAssistant(currentAssistantId, currentThreadId)
                }} className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                        Start assistant!
                    </button>
                </div>
            </Modal>

            <div className="flex flex-col">
                <table className="min-w-full divide-y divide-gray-200 table-fixed text-center">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Existing thread?</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {savedAssistants.map((assistant, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{assistant.name}</td>
                                <td className="px-6 py-4" style={{ maxWidth: "250px" }}> {/* Set a maximum width */}
                                    <td className="px-6 py-4">
                                        {shownInstructions[index] ? (
                                            <div className="overflow-auto cursor-pointer" onClick={() => toggleInstructions(index)}>
                                                {assistant.instructions}
                                            </div>
                                        ) : (
                                            <div className="overflow-hidden whitespace-nowrap cursor-pointer underline"
                                                onClick={() => toggleInstructions(index)}
                                                style={{ maxWidth: "250px" }}>
                                                {assistant.instructions}
                                            </div>
                                        )}
                                    </td>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{assistant.threadId ? "YES" : "NO"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => {
                                                if (assistant.threadId) {
                                                    startExistingAssistant(assistant.id, assistant.threadId)
                                                } else {
                                                    handleStartExistingAssistant(assistant.id, null)
                                                }
                                            }


                                            }
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                            Start
                                        </button>
                                        {assistant.threadId && (
                                            <button
                                                onClick={() => clearAssistantThread(assistant?.id!)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                                Clear thread
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="border-t border-gray-200 mt-4"></div> {/* Horizontal border added here */}

                <div className="flex justify-between mt-4">
                    {currentPage === 0 ?
                        (<p></p>) :
                        (<button onClick={() => setCurrentPage(currentPage - 1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded">
                            Previous
                        </button>)}
                    {indexOfLastDisplayedAssistant !== (allSavedAssistants.length - 1) &&
                        (<button onClick={() => setCurrentPage(currentPage + 1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-4 rounded">
                            Next
                        </button>)}
                </div>
            </div>
        </>
    );
};

export default AssistantList;
