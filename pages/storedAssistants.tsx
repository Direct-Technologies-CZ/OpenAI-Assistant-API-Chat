
"use client";



import "@/app/globals.css";
import { NextPage } from 'next';
import AssistantList from '@/app/components/AssistantList';



const StoredAssistantsPage: NextPage = () => {

    return (
        <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
            <AssistantList />
        </main>
    );
}

export default StoredAssistantsPage