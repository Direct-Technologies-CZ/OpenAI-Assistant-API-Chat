
"use client";



import "@/app/globals.css";
import { NextPage } from 'next';
import AssistantList from '@/app/components/lists/AssistantList';

import LinkBar from "@/app/components/navigation/LinkBar";


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