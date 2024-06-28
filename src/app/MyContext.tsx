"use client";

import {
    createContext,
    useState,
    useContext,
    Dispatch,
    SetStateAction,
} from "react";
import { Socket } from "socket.io-client";

type state = {
    socket: Socket | null;
    host: boolean;
};

type context = {
    state: state;
    setState: Dispatch<SetStateAction<state>>;
};

export const myContext = createContext({});

export default function ContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, setState] = useState<state>({
        socket: null,
        host: false,
    });

    return (
        <myContext.Provider value={{ state, setState }}>
            {children}
        </myContext.Provider>
    );
}

export const useMyContext = () => {
    return useContext(myContext) as context;
};
