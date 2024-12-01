import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'
import { useToastContext } from '@/context/ToastContext'

type Status = 'OK' | 'failed';


function useAuth() {
    const dispatch = useAppDispatch()
    const { openNotification } = useToastContext()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    const signIn = async (
        values: SignInCredential
    ): Promise<{ status: Status; message: string, accessToken: string } | undefined> => {
        try {
            const resp = await apiSignIn(values)
            if (resp.data && resp.data.status === 'OK') {
                const { token, id, username, roles } = resp.data.data

                console.log('ROLE-ROLE')
                console.log(roles)

                // Lưu token vào Redux store
                dispatch(signInSuccess(token))

                // Lưu thông tin người dùng vào Redux store
                dispatch(
                    setUser({
                        userName: username,
                        authority: roles,
                        email: username,
                        avatar: ''
                    })
                )
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return { status: 'OK', message: resp.data.message || '', accessToken: token }
            }
        } catch (error: any) {
            if(error?.response?.data?.error){
                openNotification(error?.response?.data?.error, 'Thông báo', 'danger', 5000)
            }
            return { status: 'failed', message: error?.response?.data?.message || error.toString() }
        }
    }


    const signUp = async (values: SignUpCredential) => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data) {
                const { token, username, roles } = resp.data.data

                // Lưu token và thông tin người dùng vào Redux store
                dispatch(signInSuccess(token))
                dispatch(
                    setUser({
                        userName: username,
                        authority: roles,
                        email: username,
                        avatar: ''  // Avatar mặc định hoặc lấy từ cấu trúc khác nếu có
                    })
                )
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return { status: 'success', message: '' }
            }
        } catch (error: any) {
            return { status: 'failed', message: error?.response?.data?.message || error.toString() }
        }
    }

    const handleSignOut = () => {
        localStorage.clear()
        // dispatch(signOutSuccess())
        // dispatch(setUser({})) // Thiết lập giá trị rỗng
        console.log('SIGNOUT')
        window.location.reload()
    }

    const signOut = async () => {
        // await apiSignOut()
        handleSignOut()
        console.log('SIGNOUT')

    }

    return {
        authenticated: token && signedIn,
        // authenticated: false,
        signIn,
        signUp,
        signOut
    }
}

export default useAuth
