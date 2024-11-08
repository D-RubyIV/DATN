import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import TabCard from '../component/card/TabCard'

type TabObject = {
    orderId: number,
    label: string,
    value: string,
    content: ReactNode
}

type AppContextType = {
    tabs: TabObject[];
    setTabs: React.Dispatch<React.SetStateAction<TabObject[]>>;
    createTab: (orderId: number) => void;
    removeTab: (orderId: number) => void;
};


const SellContext = createContext<AppContextType>({
    tabs: [],
    setTabs: () => {
    },
    createTab: () => {
    },
    removeTab: () => {
    }
})

const SellProvider = ({ children }: { children: ReactNode }) => {
    const [tabs, setTabs] = useState<TabObject[]>([])
    useEffect(() => {
        setTabs(getTabsFromLocalStorage())
    }, [])

    const getTabsFromLocalStorage = () => {
        const savedIds = JSON.parse(localStorage.getItem('orderIds') || '[]')
        let listTab: TabObject[] = []
        listTab = savedIds.map((id: number, index: number) => ({
            value: `tab${index + 1}`,
            label: `Đơn hàng ${index + 1}`,
            orderId: id,
            content: <TabCard idOrder={id} />
        }))
        console.log('TABS: ', listTab)
        return listTab
    }

    const createTab = (orderId: number) => {
        const savedIds = JSON.parse(localStorage.getItem('orderIds') || '[]')
        if (!savedIds.includes(orderId)) {
            savedIds.push(orderId)
            localStorage.setItem('orderIds', JSON.stringify(savedIds))
            setTabs(getTabsFromLocalStorage())
        }
    }

    const removeTab = (orderId: number) => {
        let savedIds = JSON.parse(localStorage.getItem('orderIds') || '[]')
        if (savedIds.includes(orderId)) {
            savedIds = savedIds.filter((s: number) => s !== orderId)
            localStorage.setItem('orderIds', JSON.stringify(savedIds))
            setTabs(getTabsFromLocalStorage())
        }
    }

    return (
        <SellContext.Provider value={{ tabs, setTabs, createTab, removeTab }}>
            {children}
        </SellContext.Provider>
    )
}

export const useSellContext = () => useContext(SellContext)

export default SellProvider
