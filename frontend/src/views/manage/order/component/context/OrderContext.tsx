import { ReactNode, createContext, useContext, useState } from "react";

type AppContextType = {
    isDarkMode: boolean,
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>
};

const AppContext = createContext<AppContextType>({
    isDarkMode: false,
    setIsDarkMode: () => { },
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <AppContext.Provider value={{ isDarkMode, setIsDarkMode }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

export default AuthProvider;
