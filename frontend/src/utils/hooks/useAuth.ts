// import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService';
// import {
//     setUser,
//     signInSuccess,
//     signOutSuccess,
//     useAppSelector,
//     useAppDispatch,
// } from '@/store';
// import appConfig from '@/configs/app.config';
// import { REDIRECT_URL_KEY } from '@/constants/app.constant';
// import { useNavigate } from 'react-router-dom';
// import useQuery from './useQuery';
// import type { SignInCredential, SignUpCredential } from '@/@types/auth';

// type Status = 'OK' | 'failed';

// function useAuth() {
//     const dispatch = useAppDispatch();
//     const navigate = useNavigate();
//     const query = useQuery();
//     const { token, signedIn } = useAppSelector((state) => state.auth.session);

//     const handleRedirect = () => {
//         const redirectUrl = query.get(REDIRECT_URL_KEY);
//         navigate(redirectUrl || appConfig.authenticatedEntryPath);
//     };

//     const signIn = async (
//         values: SignInCredential
//     ): Promise<{ status: Status; message: string } | undefined> => {
//         try {
//             const resp = await apiSignIn(values);
//             if (resp.data && resp.data.status === 'OK') {
//                 const { token, id, username, roles } = resp.data.data;

//                 // Lưu token vào Redux store
//                 dispatch(signInSuccess(token));

//                 // Lưu thông tin người dùng vào Redux store
//                 dispatch(
//                     setUser({
//                         userName: username,
//                         authority: roles,
//                         email: username,
//                         avatar: '',  // Avatar có thể thêm hoặc lấy từ cấu trúc khác nếu có
//                     })
//                 );

//                 handleRedirect();
//                 return { status: 'OK', message: resp.data.message || '' };
//             }
//         } catch (error: any) {
//             return { status: 'failed', message: error?.response?.data?.message || error.toString() };
//         }
//     };

//     const signUp = async (values: SignUpCredential) => {
//         try {
//             const resp = await apiSignUp(values);
//             if (resp.data) {
//                 const { token, username, roles } = resp.data.data;

//                 // Lưu token và thông tin người dùng vào Redux store
//                 dispatch(signInSuccess(token));
//                 dispatch(
//                     setUser({
//                         userName: username,
//                         authority: roles,
//                         email: username,
//                         avatar: '',  // Avatar mặc định hoặc lấy từ cấu trúc khác nếu có
//                     })
//                 );

//                 handleRedirect();
//                 return { status: 'success', message: '' };
//             }
//         } catch (error: any) {
//             return { status: 'failed', message: error?.response?.data?.message || error.toString() };
//         }
//     };

//     const handleSignOut = () => {
//         dispatch(signOutSuccess());
//         navigate(appConfig.unAuthenticatedEntryPath);
//     };

//     const signOut = async () => {
//         try {
//             await apiSignOut();
//         } finally {
//             handleSignOut();
//         }
//     };

//     const authenticated = Boolean(token && signedIn);

//     return {
//         authenticated,
//         signIn,
//         signUp,
//         signOut,
//     };
// }

// export default useAuth;


import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'

type Status = 'OK' | 'failed';


function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

        const signIn = async (
        values: SignInCredential
    ): Promise<{ status: Status; message: string } | undefined> => {
        try {
            const resp = await apiSignIn(values);
            if (resp.data && resp.data.status === 'OK') {
                const { token, id, username, roles } = resp.data.data;

                // Lưu token vào Redux store
                dispatch(signInSuccess(token));

                // Lưu thông tin người dùng vào Redux store
                dispatch(
                    setUser({
                        userName: username,
                        authority: roles,
                        email: username,
                        avatar: '',  // Avatar có thể thêm hoặc lấy từ cấu trúc khác nếu có
                    })
                );
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return { status: 'OK', message: resp.data.message || '' };
            }
        } catch (error: any) {
            return { status: 'failed', message: error?.response?.data?.message || error.toString() };
        }
    };

    
    const signUp = async (values: SignUpCredential) => {
        try {
            const resp = await apiSignUp(values);
            if (resp.data) {
                const { token, username, roles } = resp.data.data;

                // Lưu token và thông tin người dùng vào Redux store
                dispatch(signInSuccess(token));
                dispatch(
                    setUser({
                        userName: username,
                        authority: roles,
                        email: username,
                        avatar: '',  // Avatar mặc định hoặc lấy từ cấu trúc khác nếu có
                    })
                );
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return { status: 'success', message: '' };
            }
        } catch (error: any) {
            return { status: 'failed', message: error?.response?.data?.message || error.toString() };
        }
    };

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(setUser({})) // Thiết lập giá trị rỗng
        navigate(appConfig.unAuthenticatedEntryPath)
        console.log("SIGNOUT")
    }

    const signOut = async () => {
        await apiSignOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        // authenticated: false,
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth
