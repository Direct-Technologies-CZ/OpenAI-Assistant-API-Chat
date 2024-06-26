import React, {useState, ChangeEvent} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFileUpload} from '@fortawesome/free-solid-svg-icons';
import {LoadingCircle} from '@/app/icons';

// Definice typů pro props
interface WelcomeFormProps {
    assistantName: string;
    setAssistantName: (name: string) => void;
    assistantDescription: string;
    setAssistantDescription: (description: string) => void;
    assistantModel: string;
    setAssistantModel: (model: string) => void;
    setInitialThreadMessage: (message: string) => void;
    initialThreadMessage: string;
    files: File[];
    handleFilesChange: (files: File[]) => void;
    startChatAssistant: () => void;
    isStartLoading: boolean;
    statusMessage: string;
}

const statusToProgress: { [status: string]: number } = {
    // ... stejná mapování stavů na pokrok
    'Initializing chat assistant...': 5,
    'Starting upload...': 10,
    'Preparing file for upload...': 15,
    'File is an image, getting description...': 20,
    'Converting image to base64...': 25,
    'Getting image description...': 30,
    'Creating description file...': 35,
    'Uploading description file...': 40,
    'Description file uploaded successfully. File ID: ': 45,
    'Uploading file...': 50,
    'File uploaded successfully. File ID: ': 55,
    'Upload complete..': 60,
    'Create Assistant...': 65,
    'Assistant created...': 70,
    'Creating thread...': 75,
    'Received thread_ID...': 80,
    'Running assistant...': 85,
    'Received Run_ID..': 90,
    'checking status...': 95,
    'Run completed...': 100,
    'Received messages...': 105,
    'Adding messages to chat...': 110,
    'Done': 115,
};


const WelcomeForm: React.FC<WelcomeFormProps> = ({
             assistantName,
             setAssistantName,
             assistantDescription,
             setAssistantDescription,
             assistantModel,
             setAssistantModel,
             setInitialThreadMessage,
             initialThreadMessage,
             files,
             handleFilesChange,
             startChatAssistant,
             isStartLoading,
             statusMessage,
         }) => {
    const [lastProgress, setLastProgress] = useState<number>(0);
    const baseStatusMessage = statusMessage.replace(/ \(\d+ seconds elapsed\)$/, '');
    let progress = statusToProgress[baseStatusMessage] || 0;
    const isButtonDisabled = !assistantName || !assistantDescription;

    if (progress === 0 && lastProgress !== 0) {
        progress = lastProgress;
    } else if (progress !== lastProgress) {
        setLastProgress(progress);
    }

    return (
        <div className="border-gray-500 bg-gray-200 sm:mx-0 mx-5 mt-10 max-w-screen-md rounded-md border-2 sm:w-full">
            <div className="flex flex-col space-y-4 p-7 sm:p-10">
                <h1 className="text-lg font-semibold text-black">
                    Welcome to ChatGPT!
                </h1>
                <form className="flex flex-col space-y-3">
                    <input
                        type="text"
                        placeholder="Assistant Name"
                        value={assistantName}
                        onChange={(e) => setAssistantName(e.target.value)}
                        required
                        className="p-2 border border-gray-200 rounded-md"
                    />

                    <input
                        type="text"
                        placeholder="Assistant Description"
                        value={assistantDescription}
                        onChange={(e) => setAssistantDescription(e.target.value)}
                        required
                        className="p-2 border border-gray-200 rounded-md"
                    />

                    <textarea
                        placeholder="Initial thread message, if not set defaults to 'introduce yourself'"
                        value={initialThreadMessage}
                        onChange={(e) => setInitialThreadMessage(e.target.value)}
                        required
                        className="p-2 border border-gray-200 rounded-md"
                    />

                    <div className='flex space-x-3'>
                        <button
                            type="button"
                            onClick={() => setAssistantModel('gpt-4-turbo')}
                            className={`p-1 border border-gray-400 rounded-md ${assistantModel === 'gpt-4-turbo' ? 'bg-blue-500 text-white' : ''}`}
                            //######################################
                            //just delete the disabled prop to enable GPT4
                            //disabled GPT4 because its expensive in the Demo
                            // disabled={process.env.NEXT_PUBLIC_DEMO_MODE === 'true'}
                            //######################################
                        >
                            GPT-4
                        </button>
                        <button
                            type="button"
                            onClick={() => setAssistantModel('gpt-3.5-turbo')}
                            className={`p-1 border border-gray-400 rounded-md ${assistantModel === 'gpt-3.5-turbo' ? 'bg-blue-500 text-white' : ''}`}
                        >
                            GPT-3.5
                        </button>
                    </div>

                    <div
                        className="drop-area border-2 border-dashed border-gray-400 rounded-md p-4 text-center"
                        onClick={() => {
                            const fileInput = document.getElementById('file-input');
                            if (fileInput) {
                                fileInput.click();
                            }
                        }}
                    >
                        <input
                            id="file-input"
                            type="file"
                            accept=".xls,.xlsx,.xlsm,.c,.cpp,.csv,.docx,.html,.java,.json,.md,.pdf,.pptx,.txt,.tex,image/jpeg,image/png"
                            onChange={(e) => {
                                if (e.target.files) {
                                    handleFilesChange(Array.from(e.target.files));
                                }
                            }}
                            required
                            style={{display: 'none'}}
                            multiple
                        />
                        {files.length > 0 ? (
                            <>
                                <FontAwesomeIcon icon={faFileUpload} className="text-green-500 mb-2"/>
                                {files.map((file, index) => (
                                    <p key={index} className="text-gray-700 text-lg font-bold">{file.name}</p>
                                ))}
                            </>
                        ) : (
                            <p className="text-gray-500">Select a File</p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={startChatAssistant}
                        disabled={isButtonDisabled}
                        className={`p-2 rounded-md flex justify-center items-center relative overflow-hidden ${isButtonDisabled ? 'bg-gray-500 text-gray-300' : 'bg-green-500 text-white'}`}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${progress}%`,
                                background: 'rgba(0, 0, 0, 0.2)'
                            }}
                        />
                        {isStartLoading ? (
                            <div className="flex flex-col items-center space-y-2">
                                <LoadingCircle/>
                                <p className="text-sm text-gray-700">{statusMessage}</p>
                            </div>
                        ) : "Start"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WelcomeForm;