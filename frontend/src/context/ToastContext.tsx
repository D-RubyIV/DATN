import { Notification, toast } from '@/components/ui'
import { ReactNode, createContext, useContext } from 'react'

type ContextType = {
    openNotification: (message: string) => void; // Thêm tham số message
};

const ToastContext = createContext<ContextType | undefined>(undefined)

const ToastProvider = ({ children }: { children: ReactNode }) => {
    function openNotification(message: string) {
        const toastNotification = (
            <Notification closable title="Thông báo mới" className="font-semibold">
                <p className="text-black font-normal">
                    {message}
                </p>
            </Notification>
        )
        toast.push(toastNotification)
    }

    return (
        <ToastContext.Provider value={{ openNotification }}>
            {children}
        </ToastContext.Provider>
    )
}

export const useToastContext = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToastContext must be used within an OrderProvider')
    }
    return context
}

export default ToastProvider
