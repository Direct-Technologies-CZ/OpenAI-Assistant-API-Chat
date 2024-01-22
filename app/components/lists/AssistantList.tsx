import TextInput from "@/app/components/inputs/TextInput";
import Modal from "@/app/components/modals/Modal";
import {listAssistants} from "@/app/services/api";
import {
    clearAssistantThreadFromLocalStorage,
    fetchAssistantThreadsFromLocalStorage
} from "@/app/utils/localStorageAssistants";
import {useRouter} from "next/router";
import {FC, useEffect, useState} from "react";

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

}


const AssistantList: FC<AssistantListProps> = ({}) => {
    const [savedAssistants, setSavedAssistants] = useState<StoredAssistant[]>([]);
    const [allSavedAssistants, setAllSavedAssistants] = useState<StoredAssistant[]>([]);
    const [shownInstructions, setShownInstructions] = useState<Record<string, boolean>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAssistantId, setCurrentAssistantId] = useState<string | null>(null);
    const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
    const [currentInitialThreadMessage, setCurrentInitialThreadMessage] = useState<string | null>(null)
    const router = useRouter();

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
        setCurrentInitialThreadMessage(''); // Set the initial message if needed
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
        setSavedAssistants(savedAssistants.map(assistant => assistant.id === assistantId ? {...assistant, threadId: null} : assistant));
    };


    return (
        <>
            <Modal
                showModal={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                }}>

                <div className="relative space-y-6 p-4 bg-white rounded-lg shadow-inner">
                    {/* Close button */}
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        aria-label="Close">
                        <span className="text-2xl">&times;</span>
                    </button>

                    <h3 className="text-lg font-medium leading-6 text-gray-900">Initial Message</h3>
                    <p className="text-sm text-gray-600">
                        Set an initial message for the thread. If not set, it will default to "Introduce yourself"
                    </p>
                    <div className="pb-4">
                        <TextInput setInputValue={setCurrentInitialThreadMessage}
                                   inputValue={currentInitialThreadMessage}/>
                    </div>
                    <div className="flex justify-center">
                        <button onClick={() => {
                            setIsModalOpen(false);
                            router.push(`/runAssistant?assistant=${currentAssistantId}&thread=${currentThreadId}&initialMessage=${currentInitialThreadMessage}`)
                        }}
                                className="text-[#5a2382] border-[#5a2382] bg-white font-bold py-2 px-4 rounded-full transition-colors duration-150 hover:bg-[#F5EFFB] border-2">
                            Start assistant!
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col mt-8">
                    <div className="align-middle rounded-lg min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-[#5a2382] via-[#8868b3] to-[#a59cc6] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {savedAssistants.map((assistant, index) => (
                                <tr key={index}>
                                    <td className="w-1/2 px-6 py-4 whitespace-nowrap align-top text-left overflow-hidden">
                                        <div onClick={() => toggleInstructions(index)} className="cursor-pointer underline text-ellipsis overflow-hidden">
                                            {assistant.name}
                                        </div>
                                        {shownInstructions[index] && (
                                            <div className="overflow-auto cursor-pointer max-w-prose whitespace-pre-wrap"
                                                 onClick={() => toggleInstructions(index)}>
                                                {assistant.instructions}
                                            </div>
                                        )}
                                    </td>
                                    <td className="w-1/2 px-6 py-4 whitespace-nowrap align-top text-left">
                                        <div className="flex space-x-3 justify-start">
                                                <button
                                                    onClick={() => {
                                                        console.log(assistant.threadId)
                                                        console.log(assistant.id)
                                                        if (assistant.threadId) {
                                                            router.push(`/runAssistant?assistant=${assistant.id}&thread=${assistant.threadId}`)
                                                        } else {
                                                            handleStartExistingAssistant(assistant.id, null)
                                                        }
                                                    }


                                                    }
                                                    className="text-[#5a2382] border-[#5a2382] bg-white font-bold py-2 px-4 rounded-full transition-colors duration-150 hover:bg-[#F5EFFB] border-2">
                                                    Start
                                                </button>
                                                {assistant.threadId && (
                                                    <button
                                                        onClick={() => clearAssistantThread(assistant?.id!)}
                                                        className="text-white font-bold py-2 px-4 rounded-full transition-colors duration-150 border-transparent hover:brightness-110"
                                                        style={{
                                                            background: 'radial-gradient(transparent 20px, rgb(90, 83, 225) 20px, rgb(90, 83, 225) 21px, transparent 21px), linear-gradient(to right, rgb(90, 83, 225), rgb(204, 126, 255)), radial-gradient(circle at 0% 100%, transparent 20px, rgb(204, 126, 255) 20px, rgb(204, 126, 255) 21px, transparent 21px), linear-gradient(rgb(204, 126, 255), rgb(90, 83, 225)), radial-gradient(circle at 0% 0%, transparent 20px, rgb(90, 83, 225) 20px, rgb(90, 83, 225) 21px, transparent 21px), linear-gradient(to left, rgb(90, 83, 225), rgb(204, 126, 255)), radial-gradient(circle at 100% 0%, transparent 20px, rgb(204, 126, 255) 20px, rgb(204, 126, 255) 21px, transparent 21px), linear-gradient(to top, rgb(204, 126, 255), rgb(90, 83, 225))'
                                                        }}>
                                                        Clear thread
                                                    </button>
                                                )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {/* <div className="py-2 align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden border-gray-200 sm:rounded-lg">
                            {currentPage === 0 ?
                                (<p></p>) :
                                (<button onClick={() => setCurrentPage(currentPage - 1)}
                                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded">
                                    Previous
                                </button>)}
                            {indexOfLastDisplayedAssistant !== (allSavedAssistants.length - 1) &&
                                (<button onClick={() => setCurrentPage(currentPage + 1)}
                                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-4 rounded">
                                    Next
                                </button>)}
                        </div>
                    </div>*/}
                </div>
            </div>
        </>
    );
};

export default AssistantList;
