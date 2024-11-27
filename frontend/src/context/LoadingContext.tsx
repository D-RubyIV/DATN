import { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import { Loading } from '@/components/shared'

type AppContextType = {
    isLoadingComponent: boolean;
    setIsLoadingComponent: React.Dispatch<React.SetStateAction<boolean>>;
    sleep: (ms: number) => Promise<unknown>;
};

// Create the LoadingContext with the default values
const LoadingContext = createContext<AppContextType>({
    isLoadingComponent: false,
    setIsLoadingComponent: () => { },
    sleep: async () => { }  // Default sleep function that does nothing
});

const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isLoadingComponent, setIsLoadingComponent] = useState<boolean>(false);
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        console.log("isLoadingComponent: ", isLoadingComponent)
    }, [isLoadingComponent])

    return (
        <LoadingContext.Provider value={{ isLoadingComponent, setIsLoadingComponent, sleep }}>
            <Loading loading={isLoadingComponent} type="cover">
                {children}
            </Loading>
        </LoadingContext.Provider>
    );
};

export const useLoadingContext = () => useContext(LoadingContext);

export default LoadingProvider;
