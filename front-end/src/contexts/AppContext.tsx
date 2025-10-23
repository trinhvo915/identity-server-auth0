'use client'
import {ReactNode, createContext, useState, JSX} from 'react';

type AppContext = {
    currentUser: any;
    setCurrentUser: (user: any) => void;
};

export const AppContext = createContext<AppContext>(
    {} as AppContext
);

type Props = {
    children: ReactNode;
};

export function AppProvider({ children }: Props): JSX.Element {
    const [currentUser, setCurrentUserState] = useState<any>(null);
    const setCurrentUser = (user: any): void => {
        setCurrentUserState(user);
    };

    return (
        <AppContext.Provider
            value={{
                currentUser,
                setCurrentUser
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
