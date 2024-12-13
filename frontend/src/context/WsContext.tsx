import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react'
import { useToastContext } from '@/context/ToastContext'
import { Client, Message } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

type AppContextType = {
    countOrder: number;
    setCountOrder: React.Dispatch<React.SetStateAction<number>>;
    callHaveNewOrder: () => void;
};

const WsContext = createContext<AppContextType>({
    countOrder: 0,
    setCountOrder: () => {
    },
    callHaveNewOrder: async () => {
    }  // Default sleep function that does nothing
})

const WsProvider = ({ children }: { children: ReactNode }) => {
    const clientRef = useRef<Client | null>(null)
    const [countOrder, setCountOrder] = useState<number>(0)
    const { openNotification } = useToastContext()

    useEffect(() => {
        console.log(countOrder)
    }, [countOrder])

    useEffect(() => {
        console.log('CONNECT WS')
        connect()
        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate()
            }
        }
    }, [])

    const connect = () => {
        // const tokenString = localStorage.getItem('token')
        // const token = tokenString ? JSON.parse(tokenString) : null
        // const accessToken = token ? token.accessToken : ''

        const socket = new SockJS(`http://localhost:8080/api/v1/ws-notifications`)
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                // Authorization: `Bearer ${accessToken}`
            },
            debug: function(str) {
                console.log(str)
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        })

        client.onConnect = function() {
            client.subscribe('/send/messages', (message: Message) => {
                const result = JSON.parse(message.body)
                openNotification(result.body, 'Thông báo mới', 'info', 10000)
            })
            client.subscribe('/receive/messages', (message: Message) => {
                const result = JSON.parse(message.body)
                console.log(result)
            })
            client.subscribe('/new-order/messages', (message: Message) => {
                const result = JSON.parse(message.body)
                console.log(result)
                setCountOrder((prevCountOrder) => prevCountOrder + 1)
            })

            client.publish({ destination: '/app/receive', body: 'MY MESSAGE' })
        }

        client.onStompError = function(frame) {
            console.error('Broker reported error: ' + frame.headers['message'])
            console.error('Additional details: ' + frame.body)
        }

        clientRef.current = client
        client.activate()
    }

    const callHaveNewOrder = () => {
        if (clientRef.current) {
            console.log('++++++++++++++')
            try{
                clientRef.current.publish({ destination: '/app/new-order', body: 'Hello word' })
            }
            catch (error){
                console.log(error)
            }
        } else {
            console.log('--------------')
        }
    }


    return (
        <WsContext.Provider value={{ callHaveNewOrder, countOrder, setCountOrder }}>
            {children}
        </WsContext.Provider>
    )
}

export const useWSContext = () => useContext(WsContext)

export default WsProvider
