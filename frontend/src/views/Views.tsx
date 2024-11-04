// import { Suspense } from 'react'
// import Loading from '@/components/shared/Loading'
// import appConfig from '@/configs/app.config'
// import PageContainer from '@/components/template/PageContainer'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import { useAppSelector } from '@/store'
// import ProtectedRouteComponent from '@/components/route/ProtectedRouteComponent'
// import PublicRouteComponent from '@/components/route/PublicRouteComponent'
// import AuthorityGuard from '@/components/route/AuthorityGuard'
// import AppRoute from '@/components/route/AppRoute'
// import type { LayoutType } from '@/@types/theme'
// import { adminRoutes, authRoutes, clientRoutes, publicRoutes } from '@/configs/routes.config/routes.config'

// interface ViewsProps {
//     pageContainerType?: 'default' | 'gutterless' | 'contained'
//     layout?: LayoutType
// }

// type AllRoutesProps = ViewsProps

// const { authenticatedEntryPath } = appConfig

// const AllAdminRoutes = (props: AllRoutesProps) => {
//     const userAuthority = useAppSelector((state) => state.auth.user.authority)

//     return (
//         <Routes>
//             <Route path="/" element={<ProtectedRouteComponent />}>
//                 <Route
//                     path="/"
//                     element={<Navigate replace to={authenticatedEntryPath} />}
//                 />
//                 {adminRoutes.map((route, index) => (
//                     <Route
//                         key={route.key + index}
//                         path={route.path}
//                         element={
//                             <AuthorityGuard
//                                 userAuthority={userAuthority}
//                                 authority={route.authority}
//                             >
//                                 <PageContainer {...props} {...route.meta}>
//                                     <AppRoute
//                                         routeKey={route.key}
//                                         component={route.component}
//                                         {...route.meta}
//                                     />
//                                 </PageContainer>
//                             </AuthorityGuard>
//                         }
//                     />
//                 ))}
//             </Route>
//             <Route path="*" element={<Navigate replace to="/" />} />
//         </Routes>
//     )
// }

// const AllClientRoutes = (props: AllRoutesProps) => {
//     const userAuthority = useAppSelector((state) => state.auth.user.authority)
//     return (
//         <Routes>
//             <Route path="/" element={<ProtectedRouteComponent />}>
//                 {/*<Route*/}
//                 {/*    path="/"*/}
//                 {/*    element={<Navigate replace to={authenticatedEntryPath} />}*/}
//                 {/*/>*/}
//                 {clientRoutes.map((route, index) => (
//                     <Route
//                         key={route.key + index}
//                         path={route.path}
//                         element={
//                             <AuthorityGuard
//                                 userAuthority={userAuthority}
//                                 authority={route.authority}
//                             >
//                                 <PageContainer {...props} {...route.meta}>
//                                     <AppRoute
//                                         routeKey={route.key}
//                                         component={route.component}
//                                         {...route.meta}
//                                     />
//                                 </PageContainer>
//                             </AuthorityGuard>
//                         }
//                     />
//                 ))}
//             </Route>
//         </Routes>
//     )
// }

// const AllPublicRoutes = (props: AllRoutesProps) => {
//     return (
//         <Routes>
//             <Route path="" element={<PublicRouteComponent />}>
//                 {publicRoutes.map((route) => (
//                     <Route
//                         key={route.path}
//                         path={route.path}
//                         element={
//                             <AppRoute
//                                 routeKey={route.key}
//                                 component={route.component}
//                                 {...route.meta}
//                             />
//                         }
//                     />
//                 ))}
//             </Route>
//             <Route path="*" element={<Navigate replace to="/" />} />
//         </Routes>
//     )
// }

// const AllAuthRoutes = (props: AllRoutesProps) => {
//     return (
//         <Routes>
//             <Route path="/" element={<PublicRouteComponent />}>
//                 {authRoutes.map((route) => (
//                     <Route
//                         key={route.path}
//                         path={route.path}
//                         element={
//                             <AppRoute
//                                 routeKey={route.key}
//                                 component={route.component}
//                                 {...route.meta}
//                             />
//                         }
//                     />
//                 ))}
//             </Route>
//         </Routes>
//     )
// }
// const AuthViews = (props: ViewsProps) => {
//     return (
//         <Suspense fallback={<Loading loading={true} />}>
//             <AllAuthRoutes {...props} />
//         </Suspense>
//     )
// }
// const PublicViews = (props: ViewsProps) => {
//     return (
//         <Suspense fallback={<Loading loading={true} />}>
//             <AllPublicRoutes {...props} />
//         </Suspense>
//     )
// }
// const AdminViews = (props: ViewsProps) => {
//     return (
//         <Suspense fallback={<Loading loading={true} />}>
//             <AllAdminRoutes {...props} />
//         </Suspense>
//     )
// }
// const ClientViews = (props: ViewsProps) => {
//     return (
//         <Suspense fallback={<Loading loading={true} />}>
//             <AllClientRoutes {...props} />
//         </Suspense>
//     )
// }

// export { AdminViews, ClientViews, PublicViews, AuthViews }

import { Suspense } from 'react'
import Loading from '@/components/shared/Loading'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import PageContainer from '@/components/template/PageContainer'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import ProtectedRoute from '@/components/route/ProtectedRoute'
import PublicRoute from '@/components/route/PublicRoute'
import AuthorityGuard from '@/components/route/AuthorityGuard'
import AppRoute from '@/components/route/AppRoute'
import type { LayoutType } from '@/@types/theme'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
    const userAuthority = useAppSelector((state) => state.auth.user.authority)

    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute />}>
                <Route
                    path="/"
                    element={<Navigate replace to={authenticatedEntryPath} />}
                />
                {protectedRoutes.map((route, index) => (
                    <Route
                        key={route.key + index}
                        path={route.path}
                        element={
                            <AuthorityGuard
                                userAuthority={userAuthority}
                                authority={route.authority}
                            >
                                <PageContainer {...props} {...route.meta}>
                                    <AppRoute
                                        routeKey={route.key}
                                        component={route.component}
                                        {...route.meta}
                                    />
                                </PageContainer>
                            </AuthorityGuard>
                        }
                    />
                ))}
                {/* <Route path="*" element={<Navigate replace to="/" />} /> */} day nhe b 
            </Route>
            <Route path="/" element={<PublicRoute />}>
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>
        </Routes>
    )
}

const Views = (props: ViewsProps) => {
    return (
        <Suspense fallback={<Loading loading={true} />}>
            <AllRoutes {...props} />
        </Suspense>
    )
}

export default Views
