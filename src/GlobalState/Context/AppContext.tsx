import React, { createContext, useReducer, ReactNode } from 'react';
import { appReducer, AppState, initialState } from '../Reducers/AppReducer';


interface IChildren {
    children: ReactNode;
  }

interface AppContextType {
    state: AppState;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: React.Dispatch<any>;
}

export const AppContext = createContext<AppContextType>({
    state: initialState,
    dispatch: () => null,
});

export const AppContextProvider = ({ children }: IChildren) => {
    const [state, dispatch] = useReducer( appReducer, initialState);

    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};