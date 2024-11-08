import Side from './Side'
// import Cover from './Cover'
// import Simple from './Simple'
import { useAppSelector } from '@/store'
import { LAYOUT_TYPE_BLANK } from '@/constants/theme.constant'
import { AuthViews } from '@/views'
import RootLayout from '../ClassicLayout'

const AuthLayout = () => {
    const layoutType = useAppSelector((state) => state.theme.layout.type)

    return (
        <div className="app-layout-blank flex flex-auto flex-col h-[100vh]">
            {layoutType === LAYOUT_TYPE_BLANK ? (
                <RootLayout />
            ) : (
                <Side>
                    <RootLayout />
                </Side>
            )}
        </div>
    )
}

export default AuthLayout
