"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

import type { Client } from '@/types/models';
import { createClient } from '@/integrations/supabase/client';
import { useUser } from '@/providers/SignedInUserProvider';

type ClientContext = {
    dbClient: Client | null;
    isLoaded: boolean;
};
const Context = createContext<ClientContext>({
    dbClient: null,
    isLoaded: false
});

type DBClientProviderProps = {
    children: React.ReactNode
};
export default function DBClientProvider({children}: DBClientProviderProps) {
    const { session } = useUser();
    const [dbClient, setDbClient] = useState<Client | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (!session) return;

        const client = createClient(session);
        setDbClient(client);
        setIsLoaded(true);
    }, [session]);

    return (
        <Context.Provider value={{ dbClient, isLoaded }}>
            {isLoaded ? children : <div>Loading...</div>}
        </Context.Provider>
    )
}

export const useDBClient = () => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error("useDBClient needs to be inside the provider");
    }

    return context;
}