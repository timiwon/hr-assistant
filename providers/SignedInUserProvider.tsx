"use client";

import { SignedInSessionResource, UserResource } from '@clerk/types';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser as useClerkUser, useSession } from "@clerk/nextjs";

type SignInUserContext = {
    isLoaded: boolean,
    isSignedIn: boolean | undefined,
    user: UserResource | undefined | null,
    session: SignedInSessionResource | undefined | null
}
const Context = createContext<SignInUserContext>({
    isLoaded: false,
    isSignedIn: undefined,
    user: undefined,
    session: undefined
});

type SignedInUserProviderProps = {
    children: React.ReactNode
}
export default function SignedInUserProvider({ children }: SignedInUserProviderProps) {
    const { isLoaded, isSignedIn, user } = useClerkUser();
    const { session } = useSession();

    const [customLoaded, setCustomLoaded] = useState(false);
    const [customSignedIn, setCustomSignedIn] = useState<boolean | undefined>(undefined);
    const [customUser, setCustomUser] = useState<UserResource | undefined | null>(undefined);
    const [customSession, setCustomSession] = useState<SignedInSessionResource | undefined | null>(undefined);

    useEffect(() => {
        setCustomLoaded(isLoaded);
    }, [isLoaded]);

    useEffect(() => {
        setCustomSignedIn(isSignedIn);
    }, [isSignedIn]);

    useEffect(() => {
        setCustomUser(user);
    }, [user]);

    useEffect(() => {
        setCustomSession(session);
    }, [session]);

    const contextValue = {
        isLoaded: customLoaded,
        isSignedIn: customSignedIn,
        user: customUser,
        session: customSession
    };
    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
}

export function useUser() {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error("useDBClient needs to be inside the provider");
    }

    return context;
}