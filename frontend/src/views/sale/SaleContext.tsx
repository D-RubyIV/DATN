import {ReactNode, createContext, useContext, useState, useEffect} from 'react'
import instance from "@/axios/CustomAxios";

type AppContextType = {
    isOpenCartDrawer: boolean;
    setIsOpenCartDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    myCartId: number | undefined ;
    setMyCartId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const SaleContext = createContext<AppContextType>({
    isOpenCartDrawer: false,
    setIsOpenCartDrawer: () => { },
    myCartId:  undefined,
    setMyCartId: () => {}
});

const SaleProvider = ({ children }: { children: ReactNode }) => {
    const [isOpenCartDrawer, setIsOpenCartDrawer] = useState<boolean>(false)
    const [myCartId, setMyCartId] = useState<number | undefined>(Number(localStorage.getItem("myCartId")) ?? undefined)

    const createNewCart = async () => {
        const response = await instance.get("/cart/new-cart")
        console.log(response)
        if (response.data?.id){
            localStorage.setItem('myCartId', response.data?.id.toString());
        }
    }

    useEffect(() => {
        if (myCartId !== undefined) {
            localStorage.setItem('myCartId', myCartId.toString());
        } else {
            localStorage.removeItem('myCartId'); // Xóa nếu `myCartId` là undefined
            createNewCart();

        }
    }, [myCartId]);

    return (
        <SaleContext.Provider value={{ isOpenCartDrawer, setIsOpenCartDrawer, myCartId, setMyCartId }}>
                {children}
        </SaleContext.Provider>
    );
};

export const useSaleContext = () => useContext(SaleContext);

export default SaleProvider;
