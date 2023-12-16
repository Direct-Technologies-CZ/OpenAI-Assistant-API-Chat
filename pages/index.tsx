// pages/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/storedAssistants');
    }, [router]);

    return null; // nebo nějaký načítací indikátor
};

export default Home;