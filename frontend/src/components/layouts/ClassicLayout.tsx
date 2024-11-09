import Header from '@/components/template/Header'
import SideNavToggle from '@/components/template/SideNavToggle'
import SidePanel from '@/components/template/SidePanel'
import MobileNav from '@/components/template/MobileNav'
import UserDropdown from '@/components/template/UserDropdown'
import SideNav from '@/components/template/SideNav'
import { Route, Routes } from 'react-router-dom'
import { AdminViews, AuthViews, ClientViews, PublicViews } from '@/views'
import Side from "@/components/layouts/AuthLayout/Side";
import Navbar from '@/views/client/Navbar/Navbar'
import Footer from '@/views/client/Footer/Footer'
import { useEffect, useState } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";

const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <>
            <SidePanel />
            <UserDropdown hoverable={false} />
        </>
    )
}

const AdminLayout = () => {
    return (
        <div className="app-layout-classic flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        className="shadow dark:shadow-2xl"
                        headerStart={<HeaderActionsStart />}
                        headerEnd={<HeaderActionsEnd />}
                    />
                    <div className="h-full flex flex-auto flex-col">
                        <AdminViews />
                    </div>
                </div>
            </div>
        </div>
    )
}
const ClientLayout = () => {
    const [orderPopup, setOrderPopup] = useState(false);

    const handleOrderPopup = () => {
        setOrderPopup(!orderPopup);
    };
    useEffect(() => {
        AOS.init({
            offset: 100,
            duration: 800,
            easing: "ease-in-sine",
            delay: 100,
        });
        AOS.refresh();
    }, []);
    return (
        <div className="app-layout-classic flex flex-auto flex-col">
                <Navbar handleOrderPopup={handleOrderPopup} />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <div className="h-full flex flex-auto flex-col">
                        <ClientViews />
                    </div>
                <Footer/>

                </div>
        </div>
    )
}
const PublicLayout = () => {
    return (
        <div className="app-layout-classic flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <div className="h-full flex flex-auto flex-col">
                    <PublicViews />
                </div>
            </div>
        </div>
    )
}
const SecurityLayout = () => {
    return (
        <Side>
            <div className="app-layout-classic flex flex-auto flex-col">
                <div className="flex flex-auto min-w-0">
                    <div className="h-full flex flex-auto flex-col">
                        <AuthViews/>
                    </div>
                </div>
            </div>
        </Side>
    )
}

const RootLayout = () => {
    return (
        <Routes>
            <Route path="/client/*" element={<ClientLayout/>}/>
            <Route path="/admin/*" element={<AdminLayout/>}/>
            <Route path="/auth/*" element={<SecurityLayout/>}/>
            <Route path="/*" element={<PublicLayout />} />
            {/*<Route path="*" element={<Navigate replace to="/sign-in" />} />*/}
        </Routes>
    )
}

export default RootLayout