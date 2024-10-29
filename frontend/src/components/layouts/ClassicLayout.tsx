// import Header from '@/components/template/Header'
// import SideNavToggle from '@/components/template/SideNavToggle'
// import SidePanel from '@/components/template/SidePanel'
// import MobileNav from '@/components/template/MobileNav'
// import UserDropdown from '@/components/template/UserDropdown'
// import SideNav from '@/components/template/SideNav'
// import { Route, Routes } from 'react-router-dom'
// import { AdminViews, AuthViews, ClientViews, PublicViews } from '@/views'

// const HeaderActionsStart = () => {
//     return (
//         <>
//             <MobileNav />
//             <SideNavToggle />
//         </>
//     )
// }

// const HeaderActionsEnd = () => {
//     return (
//         <>
//             <SidePanel />
//             <UserDropdown hoverable={false} />
//         </>
//     )
// }

// const AdminLayout = () => {
//     return (
//         <div className="app-layout-classic flex flex-auto flex-col">
//             <div className="flex flex-auto min-w-0">
//                 <SideNav />
//                 <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
//                     <Header
//                         className="shadow dark:shadow-2xl"
//                         headerStart={<HeaderActionsStart />}
//                         headerEnd={<HeaderActionsEnd />}
//                     />
//                     <div className="h-full flex flex-auto flex-col">
//                         <AdminViews />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
// const ClientLayout = () => {
//     return (
//         <div className="app-layout-classic flex flex-auto flex-col">
//             <div className="flex flex-auto min-w-0">
//                 <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
//                     <div className="h-full flex flex-auto flex-col">
//                         <ClientViews />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
// const PublicLayout = () => {
//     return (
//         <div className="app-layout-classic flex flex-auto flex-col">
//             <div className="flex flex-auto min-w-0">
//                 <div className="h-full flex flex-auto flex-col">
//                     <PublicViews />
//                 </div>
//             </div>
//         </div>
//     )
// }
// const SecurityLayout = () => {
//     return (
//         <div className="app-layout-classic flex flex-auto flex-col">
//             <div className="flex flex-auto min-w-0">
//                 <div className="h-full flex flex-auto flex-col">
//                     <AuthViews />
//                 </div>
//             </div>
//         </div>
//     )
// }

// const RootLayout = () => {
//     return (
//         <Routes>
//             <Route path="/admin/*" element={<AdminLayout />} />
//             <Route path="/auth/*" element={<SecurityLayout />} />
//             <Route path="/client/*" element={<ClientLayout />} />
//             <Route path="/*" element={<PublicLayout />} />
//             {/*<Route path="*" element={<Navigate replace to="/sign-in" />} />*/}
//         </Routes>
//     )
// }

// export default RootLayout


import Header from '@/components/template/Header'
import SideNavToggle from '@/components/template/SideNavToggle'
import Search from '@/components/template/Search'
import LanguageSelector from '@/components/template/LanguageSelector'
import Notification from '@/components/template/Notification'
import SidePanel from '@/components/template/SidePanel'
import MobileNav from '@/components/template/MobileNav'
import UserDropdown from '@/components/template/UserDropdown'
import SideNav from '@/components/template/SideNav'
import View from '@/views'

const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
            <Search />
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <>
            <LanguageSelector />
            <Notification />
            <SidePanel />
            <UserDropdown hoverable={false} />
        </>
    )
}

const ClassicLayout = () => {
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
                        <View />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClassicLayout
