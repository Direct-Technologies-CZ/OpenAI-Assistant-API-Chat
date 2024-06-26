// MessageList.tsx
import React from 'react';
import clsx from "clsx";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ImageIcon, DocumentIcon } from '@/app/icons';
import { FC } from "react";

export interface MessageListProps {
  chatMessages?: Message[];
  statusMessage: string;
  isSending?: boolean;
  progress?: any;
  isFirstMessage?: boolean;
  fileDetails?: any[]
}


export interface MessageProps {
  progress?: any;
    fileDetails?: Array<any>;
  isFirstMessage?: boolean;
  message?: Message;
}

export interface Message {
  content?: string;
  fileDetails?: Array<any>;
  isLoading?: boolean;
  role?: string;
  statusMessage?: string;
}

// Message component to display individual messages
const Message: FC<MessageProps> = ({ message, progress, isFirstMessage, fileDetails }) => {
  return (
    <div
      className={clsx(
        "flex w-full items-center justify-center border-b border-gray-200 py-8",
        message?.role === "user" ? "bg-white" : "bg-gray-100"
      )}
    >
      <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
        <div
          className={clsx(
            "p-1.5 text-white rounded-full",
            message?.role === "assistant" ? "bg-[#becd00]" : "bg-black"
          )}
        >
          {message?.role === "user" ? <User width={25} /> : <Bot width={25} />}
        </div>
        {message?.role === "assistant" && message.isLoading ? (
          <>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className={clsx("h-full bg-[#becd00]", isFirstMessage ? "animate-spin-slow" : "")} style={{ width: `${progress}%` }}></div>
            </div>
            <div className="w-full flex items-center justify-center text-xs text-[#becd00]">
              {message.statusMessage}
            </div>
          </>
        ) : (
          <div className="flex flex-col w-full">
            <ReactMarkdown
              className="prose mt-1 break-words prose-p:leading-relaxed"
              remarkPlugins={[remarkGfm]}
              components={{
                a: (props) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {message?.content}
            </ReactMarkdown>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {fileDetails && fileDetails.map((file) => (
                <div key={file.name} className="flex items-center space-x-1">
                  {file.type.startsWith('image') ? <ImageIcon className="h-3 w-3" /> : <DocumentIcon className="h-3 w-3" />}
                  <span className="text-xs text-gray-500 truncate w-28 block">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// MessageList component to display a list of messages
const MessageList: FC<MessageListProps> = ({ chatMessages, statusMessage, isSending, progress, isFirstMessage, fileDetails}) => {
  let messages = [...chatMessages!];

  // Add a loading message when the site loads and isFirstMessage is true
  if (isFirstMessage && messages.length === 0) {
    messages.push({
      role: "assistant",
      isLoading: true,
      statusMessage: "Loading...",
    });
  }

  const loadingMessageIndex = messages.findIndex(
    (message) => message.role === "assistant" && message.isLoading
  );

  if (isSending) {
    if (loadingMessageIndex !== -1) {
      messages[loadingMessageIndex].statusMessage = statusMessage;
    } else {
      messages.push({
        role: "assistant",
        isLoading: true,
        statusMessage,
      });
    }
  } else if (loadingMessageIndex !== -1) {
    messages.splice(loadingMessageIndex, 1);
  }

  return (
    <>
      {isFirstMessage && (
        <div className="status-messages">
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div className={clsx("h-full bg-[#becd00] animate-pulse", isFirstMessage ? "animate-spin-slow" : "")} style={{ width: `${progress}%` }}></div>
          </div>
          <div className="w-full flex items-center justify-center text-xs text-[#becd00]">
            {statusMessage}
          </div>
        </div>
      )}
      {messages.map((message, i) => (
        <Message key={i} message={message} progress={progress} isFirstMessage={isFirstMessage && i === 0} fileDetails={message.fileDetails} />
      ))}
    </>
  );
};

export default MessageList;