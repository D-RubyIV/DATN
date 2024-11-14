import {ReactNode, createContext, useContext, useState, useEffect} from 'react'
import instance from "@/axios/CustomAxios";
import {CartDetailResponseDTO} from "@/views/sale/index";

type AppContextType = {
    isOpenCartDrawer: boolean;
    setIsOpenCartDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    myCartId: number | undefined;
    setMyCartId: React.Dispatch<React.SetStateAction<number | undefined>>;
    listCartDetailResponseDTO: CartDetailResponseDTO[],
    setListCartDetailResponseDTO:  React.Dispatch<React.SetStateAction<CartDetailResponseDTO[]>>
    getCartDetailInCard: () => void;
};

const SaleContext = createContext<AppContextType>({
    isOpenCartDrawer: false,
    setIsOpenCartDrawer: () => {
    },
    myCartId: undefined,
    setMyCartId: () => {
    },
    listCartDetailResponseDTO: [],
    setListCartDetailResponseDTO: () => {
    },
    getCartDetailInCard: () => {}
});

const SaleProvider = ({children}: { children: ReactNode }) => {
    const [isOpenCartDrawer, setIsOpenCartDrawer] = useState<boolean>(false)
    const [myCartId, setMyCartId] = useState<number | undefined>(Number(localStorage.getItem("myCartId")) ?? undefined)
    const [listCartDetailResponseDTO, setListCartDetailResponseDTO] = useState<CartDetailResponseDTO[]>([])

    const getCartDetailInCard = () => {
        instance.get(`cart-details/in-cart/${myCartId}`).then(function (response){
            console.log(response)
            if (response?.data) {
                setListCartDetailResponseDTO(response?.data)
            }
        })
    }
    useEffect(() => {
        if (isOpenCartDrawer) {
            getCartDetailInCard()
        }
    }, [isOpenCartDrawer]);

    const createNewCart = async () => {
        const response = await instance.get("/cart/new-cart")
        console.log(response)
        if (response.data?.id) {
            // check valid cart
            localStorage.setItem('myCartId', response.data?.id.toString());
            setMyCartId(response.data?.id)
        }
    }

    useEffect(() => {
        if (myCartId === undefined || myCartId === 0) {
            localStorage.removeItem('myCartId'); // Xóa nếu `myCartId` là undefined
            createNewCart();
        } else {
            localStorage.setItem('myCartId', myCartId.toString());
            instance.get(`/cart/check-cart-active/${myCartId.toString()}`).then(function (response) {
                console.log(response)

            }).catch(function (error) {
                console.log(error);
                if (error.response && error.response.status === 400) {
                    createNewCart();
                }
            });
        }
    }, [myCartId]);

    return (
        <SaleContext.Provider value={{getCartDetailInCard, listCartDetailResponseDTO, setListCartDetailResponseDTO, isOpenCartDrawer, setIsOpenCartDrawer, myCartId, setMyCartId}}>
            {children}
        </SaleContext.Provider>
    );
};

export const useSaleContext = () => useContext(SaleContext);

export default SaleProvider;
