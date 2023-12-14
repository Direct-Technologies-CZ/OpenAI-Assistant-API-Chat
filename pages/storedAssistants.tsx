
"use client";



import "@/app/globals.css";
import { NextPage } from 'next';
import AssistantList from '@/app/components/lists/AssistantList';
import { useChatState } from "@/app/hooks/useChatState";
import { useChatManager } from "@/app/hooks/useChatManager";
import { useStartAssistant } from "@/app/hooks/useStartAssistant";
import LinkBar from "@/app/components/navigation/LinkBar";
import { InputForm, MessageList } from "@/app/components";
import { addAssistantThreadToLocalStorage, saveAssistantsToLocalStorage } from "@/app/utils/localStorageAssistants";

import { useState } from "react";



const StoredAssistantsPage: NextPage = () => {




    return (
        <>




            <main className="flex flex-col items-center justify-between pb-40">
                <LinkBar />


                  <AssistantList />
    



            </main></>
    );
}

export default StoredAssistantsPage