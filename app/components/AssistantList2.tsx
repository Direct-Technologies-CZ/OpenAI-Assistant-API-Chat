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
    startExistingAssistant: (assistantId: string | null, threadId: string | null) => void;
}





// const randomAssistantList =[{'assistantName': 'Lauren',
//   'assistantDescription': 'Each listen able specific number add risk alone protect relationship finally.',
//   'assistantId': '851bce04-8cd2-4955-8d0b-dae426e8d948',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Cynthia',
//   'assistantDescription': 'Through make different goal phone bill gas for.',
//   'assistantId': '1675c151-85f9-4cfc-998f-d1b65ab740b6',
//   'threadId': '56505555-a8fd-474a-ab10-433bd852f1db'},
//  {'assistantName': 'Paul',
//   'assistantDescription': 'Moment miss us whose when they under short no issue old name sometimes.',
//   'assistantId': '72ec75c7-8714-4848-bc0d-be468b386154',
//   'threadId': '5b64189b-cf97-47c6-a48e-fc3cde8e3f71'},
//  {'assistantName': 'Juan',
//   'assistantDescription': 'Forget participant look real show experience beautiful impact wear reason.',
//   'assistantId': 'a332354c-7ab4-47f4-bc84-5113880c9249',
//   'threadId': 'fd2feac4-80a0-48a8-b793-d4d82a8bb87e'},
//  {'assistantName': 'Dylan',
//   'assistantDescription': 'Accept small understand international management several politics age these each about democratic kitchen.',
//   'assistantId': '5428e414-d439-4a42-a739-61e21fe3750d',
//   'threadId': '5cb5255e-3764-453f-abe2-cd2e58ca02e2'},
//  {'assistantName': 'Brianna',
//   'assistantDescription': 'Worker section speak put improve collection above both hit Mrs total and because.',
//   'assistantId': 'f3d3199e-dbac-417c-a3ac-c67be267b87b',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Susan',
//   'assistantDescription': 'Really home behind situation claim beyond rule price specific event arrive difference bring.',
//   'assistantId': '6f231c40-a0b5-4453-bba7-75b5ba2334f4',
//   'threadId': '5f60da63-d6c6-4114-8180-c5b279c8df92'},
//  {'assistantName': 'Sarah',
//   'assistantDescription': 'Wonder third couple town image difficult after have behavior beat new bag may.',
//   'assistantId': 'c5631334-f0e6-4859-838f-ee05238b8e4c',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Jennifer',
//   'assistantDescription': 'Where company this kid present moment court almost bring even too parent than.',
//   'assistantId': '3f9db4a0-49c1-4fa4-a8a2-c68f2d104744',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Molly',
//   'assistantDescription': 'Fire interview long understand building apply end memory physical.',
//   'assistantId': '89f00d04-346e-407e-80b4-6b183298a75e',
//   'threadId': '47862cec-e159-4efd-85ea-0d289c5188d1'},
//  {'assistantName': 'John',
//   'assistantDescription': 'May wide decade under relate ability.',
//   'assistantId': '6b7543a0-fd1d-4a40-a34f-505745616262',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Noah',
//   'assistantDescription': 'Other mouth life director TV ability mother cost air sometimes foreign.',
//   'assistantId': 'aafd3797-970e-4d3f-86c2-2279a6caea7d',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Charles',
//   'assistantDescription': 'Because some room between process draw standard.',
//   'assistantId': '18ef317d-3c37-4460-a27a-e6bca0002584',
//   'threadId': '77dd1ff4-e3f3-4e20-9ec4-43001b795bff'},
//  {'assistantName': 'Amber',
//   'assistantDescription': 'Claim call continue visit water student memory former sign.',
//   'assistantId': '3cbcf1f8-901f-4d01-ba00-5178203ca5a4',
//   'threadId': '7ec44726-0bf3-46a8-9311-7942830a1b26'},
//  {'assistantName': 'Thomas',
//   'assistantDescription': 'Body whom off pull material past month main thought.',
//   'assistantId': '1f0d80d6-2de5-4d8b-aa09-a39b7507d259',
//   'threadId': 'eb4b254a-fd1e-45b6-a209-c8f90e9a8c12'},
//  {'assistantName': 'Larry',
//   'assistantDescription': 'Wall piece that trip hotel happen industry language.',
//   'assistantId': 'df07d905-1882-4fcb-82ba-241220ab1155',
//   'threadId': 'b27ce30d-6cf1-4e52-a268-678102b20c6c'},
//  {'assistantName': 'Michael',
//   'assistantDescription': 'Gun accept usually test even which visit child score parent sell develop.',
//   'assistantId': '5d00ba29-f1c2-45f7-9890-e75a0f2beee7',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Laura',
//   'assistantDescription': 'Role step we its likely place.',
//   'assistantId': '05120cbe-a46f-4d54-97ab-653b224ca28c',
//   'threadId': 'ecd52699-a78e-4707-968a-c67734637a0d'},
//  {'assistantName': 'Linda',
//   'assistantDescription': 'Grow perhaps four debate conference a ever cost sell politics.',
//   'assistantId': 'ed8b7784-59bd-4521-aad3-ea9f445216ad',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Adam',
//   'assistantDescription': 'May civil forward such kitchen still than bed energy number.',
//   'assistantId': 'ff1f20a2-12a5-46da-87c6-e9d3256ac6a8',
//   'threadId': '6281b02b-063f-4a55-a183-b3d7bddf83c0'},
//  {'assistantName': 'Jennifer',
//   'assistantDescription': 'Pm near want quality camera free pass appear without this.',
//   'assistantId': 'd50fad71-c410-46aa-ae03-bfeaaeb64788',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Christopher',
//   'assistantDescription': 'Indeed yes play both ask daughter artist.',
//   'assistantId': 'f0c68714-f94c-45a8-a66e-be5ee26dfc2b',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Eric',
//   'assistantDescription': 'Space impact factor firm quality teach two serious.',
//   'assistantId': '1b6e5978-c07c-4286-bae6-5b40bacab7df',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Benjamin',
//   'assistantDescription': 'Thus red drive at particularly before wide should easy forget technology someone.',
//   'assistantId': '246542c3-97f7-4cac-a4da-753df0a4f278',
//   'threadId': 'c921002c-5a47-45cb-9a01-b28fee1e1c47'},
//  {'assistantName': 'Frederick',
//   'assistantDescription': 'Director career ten where just style establish baby month.',
//   'assistantId': 'b3f4a267-d37a-47ca-b82e-b1250a350559',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Kristen',
//   'assistantDescription': 'Resource trial trip write decision great gas source yes pick produce grow.',
//   'assistantId': '0a3d2b62-c7e8-456e-ac82-2c982a35acb3',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Daniel',
//   'assistantDescription': 'Religious feeling reality body technology tree must box bit.',
//   'assistantId': '0dd98919-2ef6-4bda-b597-3edafe1bb87e',
//   'threadId': '96ea55bc-ad6a-4db6-bd07-fd7f69d1deea'},
//  {'assistantName': 'Kelly',
//   'assistantDescription': 'Trouble identify figure him reflect party action could stock.',
//   'assistantId': '2dce9680-6ddd-44ba-911f-34eafa0bead1',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Donald',
//   'assistantDescription': 'Piece reason instead threat ahead American pretty.',
//   'assistantId': '20f8bd93-d1ff-4ad4-9a4b-c90975cc2d09',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Kevin',
//   'assistantDescription': 'Detail TV grow fund represent perform mean.',
//   'assistantId': '1f5a36b7-0e2e-4c9d-9328-387b83d8b297',
//   'threadId': '214f3dde-f04d-496e-8d3e-3d8b356c473a'},
//  {'assistantName': 'Jordan',
//   'assistantDescription': 'Believe star herself with newspaper health most edge attention serve story wide.',
//   'assistantId': '0b07607a-880b-4d76-9f17-5acb092f33f5',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Stephanie',
//   'assistantDescription': 'Yourself success citizen believe Mrs per would plan his him television design method.',
//   'assistantId': 'bbe43452-0c09-4b58-aef8-580232e448be',
//   'threadId': '0d800f99-cd77-44b8-b9bc-0b1bdedd46d9'},
//  {'assistantName': 'Donald',
//   'assistantDescription': 'Allow away street these activity road station require deal number another.',
//   'assistantId': 'eac13a97-91ed-47f5-b8d3-0850ed9238d2',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Cynthia',
//   'assistantDescription': 'Carry five big heart really laugh threat.',
//   'assistantId': 'ceaaad1f-f694-4ad3-88c6-8062506c32d0',
//   'threadId': "xxxxx"},
//  {'assistantName': 'Lynn',
//   'assistantDescription': 'Debate serve push have take two executive bag hundred will.',
//   'assistantId': 'e2d86f3d-f8a8-468b-9d74-9c0497cd9790',
//   'threadId': '6545b57a-47cf-41e7-83f9-8aa4664f39a6'},
//  {'assistantName': 'Madeline',
//   'assistantDescription': 'Discover scientist certainly get concern her entire those image become bill.',
//   'assistantId': 'd5dc130e-4f4d-4ce2-806d-0e539f2802e6',
//   'threadId': 'f996b7c8-a236-499f-948e-40a9ed14dd81'},
//  {'assistantName': 'Phillip',
//   'assistantDescription': 'Teach against board poor "xxxxx" itself total among.',
//   'assistantId': '16579943-badd-4511-8e7b-da855bd5bcac',
//   'threadId': '4cc2af4a-eada-4f08-8af8-acdfc58662c5'},
//  {'assistantName': 'Larry',
//   'assistantDescription': 'Ok star age hope trial become statement inside forget manage worker sing treat.',
//   'assistantId': '156ae3dd-66da-4db2-92ce-b3ebf7f696af',
//   'threadId': 'b1cd6b9d-f36b-451b-aead-63f418272797'},
//  {'assistantName': 'Travis',
//   'assistantDescription': 'Present center push executive force issue chance physical cup.',
//   'assistantId': '7f888158-9ec9-47f0-96bd-f96a4b143c5d',
//   'threadId': 'bbcd4309-d437-4d09-a9fd-98ee93731188'},
//  {'assistantName': 'Andrea',
//   'assistantDescription': 'Economy audience up or finish student well resource actually stage husband imagine everybody.',
//   'assistantId': '0acaf894-375f-4d5a-97b2-c6d921cda933',
//   'threadId': "xxxxx"},
// {'assistantName': 'Radko',
//   'assistantDescription': 'Each listen able specific number add risk alone protect relationship finally.',
//   'assistantId': '851bce04-8cd2-4955-8d0b-dae426e8d948',
//   'threadId': "kurkos"},
//  {'assistantName': 'Cynthia',
//   'assistantDescription': 'Through make different goal phone bill gas for.',
//   'assistantId': '1675c151-85f9-4cfc-998f-d1b65ab740b6',
//   'threadId': '56505555-a8fd-474a-ab10-433bd852f1db'},
//  {'assistantName': 'Paul',
//   'assistantDescription': 'Moment miss us whose when they under short no issue old name sometimes.',
//   'assistantId': '72ec75c7-8714-4848-bc0d-be468b386154',
//   'threadId': '5b64189b-cf97-47c6-a48e-fc3cde8e3f71'},
//  {'assistantName': 'Juan',
//   'assistantDescription': 'Forget participant look real show experience beautiful impact wear reason.',
//   'assistantId': 'a332354c-7ab4-47f4-bc84-5113880c9249',
//   'threadId': 'fd2feac4-80a0-48a8-b793-d4d82a8bb87e'},
//  {'assistantName': 'Dylan',
//   'assistantDescription': 'Accept small understand international management several politics age these each about democratic kitchen.',
//   'assistantId': '5428e414-d439-4a42-a739-61e21fe3750d',
//   'threadId': '5cb5255e-3764-453f-abe2-cd2e58ca02e2'},]

const AssistantList2: FC<AssistantListProps> = ({ startExistingAssistant }) => {
    const [savedAssistants, setSavedAssistants] = useState<StoredAssistant[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const assistantsPerPage = 20;

    useEffect(() => {
        // Load assistants and set initial state
        setSavedAssistants(fetchAssistantsFromLocalStorage());


        // set random assistant list for testing pagination purposes
        // setSavedAssistants(randomAssistantList);
    }, []);

    const deleteAssistant = (assistantId: string) => {
        removeAssistantFromLocalStorage(assistantId);
        setSavedAssistants(savedAssistants.filter(assistant => assistant.assistantId !== assistantId));
    };

    const clearAssistantThread = (assistantId: string) => {
        clearAssistantThreadFromLocalStorage(assistantId);
        setSavedAssistants(savedAssistants.map(assistant => assistant.assistantId === assistantId ? { ...assistant, threadId: null } : assistant));
    };

    // Calculate the current items to show
    const indexOfLastAssistant = (currentPage + 1) * assistantsPerPage;
    const indexOfFirstAssistant = indexOfLastAssistant - assistantsPerPage;
    const currentAssistants = savedAssistants.slice(indexOfFirstAssistant, indexOfLastAssistant);

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
                    {currentAssistants.map((assistant, index) => (
                        <tr key={index} className="border-b">
                            <td>{assistant.assistantName}</td>
                            <td>{assistant.assistantDescription}</td>
                            <td>{assistant.assistantId}</td>
                            <td>{assistant.threadId}</td>
                            <td>
                                <button onClick={() => startExistingAssistant(assistant.assistantId, assistant.threadId)}>Start</button>
                                <button onClick={() => deleteAssistant(assistant.assistantId!)}>Delete</button>
                                <button onClick={() => clearAssistantThread(assistant.assistantId!)}>Clear thread</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between mt-4">
                {currentPage === 0 ? <p></p> : <button onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous
                </button>}
                {!(indexOfLastAssistant >= savedAssistants.length) && <button onClick={() => setCurrentPage(currentPage + 1)} >
                    Next
                </button>}
            </div>
        </div>
    );
};

export default AssistantList2;
