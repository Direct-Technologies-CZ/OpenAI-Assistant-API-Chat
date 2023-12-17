import React from 'react';
import clsx from 'clsx';
import Textarea, { TextareaAutosizeProps } from 'react-textarea-autosize';
import { SendIcon, LoadingCircle, DocumentIcon, XIcon, ImageIcon, PaintIcon } from '@/app/icons';

// Definování typů pro soubory a props
interface FileDetail {
    name: string;
    type: string;
}

interface InputFormProps {
    input: string;
    setInput: (value: string) => void;
    handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handlePaintSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
    inputRef: React.RefObject<any>;
    formRef: React.RefObject<HTMLFormElement>;
    disabled: boolean;
    chatStarted: boolean;
    isSending: boolean;
    isLoading: boolean;
    handleChatFilesUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    chatFileDetails: FileDetail[];
    removeChatFile: (fileName: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ input, setInput, handleFormSubmit, handlePaintSubmit, inputRef, formRef, disabled, chatStarted, isSending, isLoading, handleChatFilesUpload, chatFileDetails, removeChatFile }) => {
    const handlePaintButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        handlePaintSubmit(e);
    };
    return (
    <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
      <div className="flex flex-col items-stretch w-full max-w-screen-md">
        <div className="flex flex-wrap items-center space-x-2 mb-2">
          {chatFileDetails.map((file) => (
            <div key={file.name} className="flex items-center space-x-1">
              {file.type.startsWith('image') ? <ImageIcon className="h-3 w-3" /> : <DocumentIcon className="h-3 w-3" />}
              <span className="text-xs text-gray-500">{file.name}</span>
              <button
                type="button"
                onClick={() => removeChatFile(file.name)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSending}
              >
                <XIcon className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
        <form
          ref={formRef}
          onSubmit={handleFormSubmit}
          className="relative rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && chatStarted) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full pr-20 pl-10 focus:outline-none" 
            disabled={disabled || !chatStarted}
          />
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={handleChatFilesUpload}
            disabled={disabled || !chatStarted || isSending}
            multiple
            accept=".c,.cpp,.csv,.docx,.html,.java,.json,.md,.pdf,.pptx,.txt,.tex,image/jpeg,image/png"
          />
            <label
                htmlFor="file-upload"
                className={clsx(
                    "text-white absolute inset-y-0 left-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
                    disabled || !chatStarted || isSending
                        ? "cursor-not-allowed bg-gray-300"
                        : "bg-[#becd00] hover:brightness-110",
                )}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z" fill="currentColor"></path></svg>
            </label>
          <button
            className={clsx(
              "absolute inset-y-0 right-12 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled || !chatStarted || input.trim().length === 0 || isSending
                ? "cursor-not-allowed bg-white"
                : "bg-[#becd00] hover:brightness-110",
            )}
            disabled={disabled || !chatStarted || isLoading || isSending}
          >
            {isSending ? (
              <LoadingCircle />
            ) : (
              <SendIcon
                className={clsx(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white",
                )}
              />
            )}
          </button>
            <button
                onClick={handlePaintButtonClick}
                className={clsx(
                    "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
                    disabled || !chatStarted || input.trim().length === 0 || isSending
                        ? "cursor-not-allowed bg-white"
                        : "bg-[#5a2382] hover:brightness-125",
                )}
                disabled={disabled || !chatStarted || isSending}
            >
                <PaintIcon
                    className={clsx(
                        "h-4 w-4",
                        input.length === 0 ? "text-gray-300" : "text-white",
                    )}
                />
            </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;