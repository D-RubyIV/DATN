import Tabs from '@/components/ui/Tabs'
import { HiOutlineUser, HiPlusCircle } from 'react-icons/hi'

import React, { ReactNode, useEffect, useState } from 'react'
import { Badge, Button } from '@/components/ui'
import { DoubleSidedImage, Loading } from '@/components/shared'
import TabCard from './card/TabCard'
import { useToastContext } from '@/context/ToastContext'
import CloseButton from '@/components/ui/CloseButton'
import instance from '@/axios/CustomAxios'
import { OrderResponseDTO } from '../../../../@types/order'
import { useLoadingContext } from '@/context/LoadingContext'

const { TabNav, TabList, TabContent } = Tabs

type TabObject = {
    orderId: number,
    label: string,
    value: string,
    content: ReactNode
}
type QuantityInOrder = {
    id: number,
    code: string,
    quantity: number
}

const SellTab = () => {
    const listIndexTab = [1, 2, 3, 4, 5]
    const [currentTab, setCurrentTab] = useState('')
    const [tabs, setTabs] = useState<TabObject[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const { openNotification } = useToastContext()
    const [orderIds, setOrderIds] = useState<number[]>([])
    const [quantityInOrder, setQuantityInOrder] = useState<QuantityInOrder[]>([])

    const { isLoadingComponent } = useLoadingContext()
    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const getIndex = () => {
        
    }

    useEffect(() => {
        if (tabs.length > 0) {
            setCurrentTab(tabs[tabs.length-1].value)
        }
    }, [tabs])
    
    useEffect(() => {
        reloadQuantityInOrder()
    }, [currentTab, tabs, isLoadingComponent])

    const reloadQuantityInOrder = async () => {
        const ids = tabs.map((s) => s.orderId)
        await instance.get(`/orders/count-order-detail?ids=${ids}`).then(function(response) {
            console.log(response)
            setQuantityInOrder(response.data)
        })
    }

    const handleDelayScreen = async () => {
        setLoading(true)
        await sleep(200)
        setLoading(false)
    }

    const handleCreateNewOrder = async (): Promise<OrderResponseDTO> => {
        const data = {
            'name': 'Hoa Don',
            'address': '',
            'phone': '',
            'deleted': false,
            'total': 0,
            'subTotal': 0,
            'voucher': null,
            'type': 'INSTORE'
        }

        try {
            const response = await instance.post('/orders', data)

            console.log('RESPONSE DATA')
            console.log(response.data)

            return response.data
        } catch (error) {
            console.error('Error creating new order:', error)
            throw error
        }
    }

    const addNewTab = async () => {
        const newOrder = await handleCreateNewOrder()
        if (tabs.length >= 5) {
            openNotification('Bạn không thể tạo quá 5 đơn hàng.')
            return
        }

        await handleDelayScreen()
        const newTabIndex = tabs.length + 1
        const value = `tab${newTabIndex}`
        const newTab = {
            value: value,
            label: `Đơn hàng ${newTabIndex}`,
            orderId: newOrder.id,
            content: <TabCard idOrder={newOrder.id} removeCurrentTab={() => removeTab(value)} />
        }
        setTabs([...tabs, newTab])

        const updatedOrderIds = [...orderIds, newOrder.id]
        localStorage.setItem('orderIds', JSON.stringify(updatedOrderIds))
        setOrderIds(updatedOrderIds)
    }

    const removeTab = (tabValue: string) => {
        console.log("TAB VALUE: ", tabValue)
        console.log("tabs: ", tabs)
        const filteredTabs = tabs.filter(tab => tab.value !== tabValue)
        console.log("LIST: ", filteredTabs)
        setTabs(filteredTabs)

        const updatedOrderIds = filteredTabs.map(s => s.orderId)
        setOrderIds(updatedOrderIds)
        localStorage.setItem('orderIds', JSON.stringify(updatedOrderIds))

        if (currentTab === tabValue && filteredTabs.length > 0) {
            setCurrentTab(filteredTabs[filteredTabs.length - 1].value)
        } else if (filteredTabs.length === 0) {
            setCurrentTab('')
        }
        reloadTab()
    }

    useEffect(() => {
        console.log('Current Tab: ', currentTab)
    }, [currentTab])


    const reloadTab = () => {
        const savedIds = JSON.parse(localStorage.getItem('orderIds') || '[]')
        setOrderIds(savedIds)
        
        const newTabs = savedIds.map((id: number, index: number) => ({
            value: `tab${index + 1}`,
            label: `Đơn hàng ${index + 1}`,
            orderId: id,
            content: <TabCard idOrder={id} removeCurrentTab={() => removeTab(`tab${index + 1}`)} />
        }))
        setTabs(newTabs)
    }

    useEffect(() => {
        reloadTab()
    }, [])


    return (
        <div>
            <Loading loading={loading} type="cover">
                <div className="flex justify-between">
                    <div>
                        <h1 className="font-semibold text-xl text-black text-transform: uppercase">Quản lý bán hàng</h1>
                    </div>
                    <div>
                        <Button
                            variant="default"
                            icon={<HiPlusCircle />}
                            onClick={addNewTab}>
                            Tạo đơn hàng mới
                        </Button>
                    </div>
                </div>
                {
                    tabs.length > 0 ? (
                        <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
                            <TabList className="flex justify-between py-2">
                                <div className="flex">
                                    {tabs.map((tab) => (
                                        <div key={tab.value} className="flex items-center justify-center gap-1">
                                            <Badge
                                                className="mr-1"
                                                content={quantityInOrder.find((s) => s.id === tab.orderId)?.quantity}
                                                // maxCount={tab.orderId}
                                                innerClass="bg-red-50 text-red-500">
                                                <TabNav
                                                    value={tab.value}
                                                    icon={<HiOutlineUser />}
                                                    className={`${currentTab === tab.value ? 'text-[15px]' : ''} !p-1`}
                                                >
                                                    {tab.label} - HD{tab.orderId}
                                                </TabNav>
                                            </Badge>
                                            <CloseButton
                                                className="text-gray-800 text-[18px] hover:text-red-500 transition-all duration-500"
                                                onClick={() => removeTab(tab.value)}
                                            />
                                            <div>
                                                <p>
                                                    {
                                                        ' | '
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabList>
                            <div className="py-1">
                                {tabs.map((tab) => (
                                    <TabContent key={tab.value} value={tab.value}>
                                        {tab.content}
                                    </TabContent>
                                ))}
                            </div>
                        </Tabs>
                    ) : (
                        <NoHaveAnyTab />
                    )
                }
            </Loading>
        </div>
    )
}

const NoHaveAnyTab = () => {
    return (
        <div className="h-[760px] flex justify-center items-center">
            <div className="flex justify-center items-center flex-col">
                <DoubleSidedImage
                    src="/img/others/image-removebg-preview-order-empty.png"
                    darkModeSrc="/img/others/image-removebg-preview-order-empty.png"
                    alt="No user found!"
                />
                <div className="py-3 font-semibold">
                    <p className="text-xl">Không có bất kì đơn hàng nào !!!</p>
                </div>
            </div>
        </div>
    )
}

export default SellTab
