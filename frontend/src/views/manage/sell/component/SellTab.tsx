import Tabs from '@/components/ui/Tabs'
import { HiOutlineHome, HiOutlineUser, HiOutlinePhone, HiPlusCircle, HiOutlineTrash, HiLockClosed } from 'react-icons/hi'
const { TabNav, TabList, TabContent } = Tabs

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { DoubleSidedImage, Loading } from '@/components/shared';
import TabCard from './card/TabCard';
import { useToast } from 'react-toastify';
import { useToastContext } from '@/context/ToastContext';
import CloseButton from '@/components/ui/CloseButton';

type TabObject = {
    label: string,
    value: string,
    content: any
}

const SellTab = () => {
    const [currentTab, setCurrentTab] = useState('');
    const [tabs, setTabs] = useState<TabObject[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { openNotification } = useToastContext()

    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const handleDelayScreen = async () => {
        setLoading(true);
        await sleep(500);
        setLoading(false);
    }

    const addNewTab = async () => {
        if (tabs.length >= 5) {
            openNotification('Bạn không thể tạo quá 5 đơn hàng.');
            return;
        }

        await handleDelayScreen();
        const newTabIndex = tabs.length + 1;
        const newTab = {
            value: `tab${newTabIndex}`,
            label: `Đơn hàng ${newTabIndex}`,
            content: <TabCard something={newTabIndex} /> // Nội dung có thể thay đổi tùy ý
        };
        setTabs([...tabs, newTab]);
        setCurrentTab(newTab.value); // Chuyển đến tab mới
    };

    const removeTab = (tabValue: string) => {
        const filteredTabs = tabs.filter(tab => tab.value !== tabValue);
        setTabs(filteredTabs);

        // Nếu tab đang active bị xóa, chuyển sang tab khác
        if (currentTab === tabValue && filteredTabs.length > 0) {
            setCurrentTab(filteredTabs[0].value);
        } else if (filteredTabs.length === 0) {
            setCurrentTab(''); // Không có tab nào sau khi xóa
        }
    };

    useEffect(() => {
        console.log("Current Tab: ", currentTab);
    }, [currentTab]);

    return (
        <div>
            <Loading loading={loading} type="cover">
                <div className='flex justify-between'>
                    <div>
                        <h1 className="font-semibold text-xl text-black text-transform: uppercase">Quản lý đơn hàng</h1>
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
                        <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)} >
                            <TabList>
                                {tabs.map((tab) => (
                                    <div key={tab.value} className="flex items-center justify-center gap-1">
                                        <TabNav
                                            value={tab.value}
                                            icon={<HiOutlineUser />}
                                            className={`${currentTab === tab.value ? "underline underline-offset-2" : ""} !p-1`}
                                            
                                        >
                                            {tab.label}
                                        </TabNav>
                                        <CloseButton
                                            className="text-gray-800 text-sm"
                                            onClick={() => removeTab(tab.value)}
                                            
                                        />
                                        <div>
                                            <p>
                                                {
                                                    " | "
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))}
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
    );
};

const NoHaveAnyTab = () => {
    return (
        <div className='h-[760px] flex justify-center items-center'>
            <div className='flex justify-center items-center flex-col'>
                <DoubleSidedImage
                    src="/img/others/image-removebg-preview-order-empty.png"
                    darkModeSrc="/img/others/image-removebg-preview-order-empty.png"
                    alt="No user found!"
                />
                <div className='py-3 font-semibold'>
                    <p className='text-xl'>Không có bất kì đơn hàng nào !!!</p>
                </div>
            </div>
        </div>
    );
}

export default SellTab;
