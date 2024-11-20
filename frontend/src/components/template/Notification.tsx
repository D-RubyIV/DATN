import { useEffect, useState, useCallback } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import {
    HiOutlineBell,
    HiOutlineCalendar,
    HiOutlineClipboardCheck,
    HiOutlineBan,
    HiOutlineMailOpen,
} from 'react-icons/hi'
import { Link } from 'react-router-dom'
import isLastChild from '@/utils/isLastChild'
import useTwColorByName from '@/utils/hooks/useTwColorByName'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useAppSelector } from '@/store'
import useResponsive from '@/utils/hooks/useResponsive'
import acronym from '@/utils/acronym'
import { Client } from '@stomp/stompjs'
import io from 'socket.io-client' // Thêm thư viện socket.io-client

type NotificationList = {
    id: string
    target: string
    description: string
    date: string
    image: string
    type: number
    location: string
    locationLabel: string
    status: string
    readed: boolean
}

const WebSocketURL = 'http://localhost:8080/api/v1/ws'; // Đường dẫn WebSocket backend

const notificationTypeAvatar = (data: {
    type: number
    target: string
    image: string
    status: string
}) => {
    const { type, target, image, status } = data
    switch (type) {
        case 0:
            if (image) {
                return <Avatar shape="circle" src={`/img/avatars/${image}`} />
            } else {
                return <Avatar shape="circle">{target[0]}</Avatar> // Giả sử acronym từ target
            }
        case 1:
            return (
                <Avatar
                    shape="circle"
                    className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
                    icon={<HiOutlineCalendar />}
                />
            )
        case 2:
            return (
                <Avatar
                    shape="circle"
                    className={status === 'succeed'
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100'
                        : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100'
                    }
                    icon={status === 'succeed' ? <HiOutlineClipboardCheck /> : <HiOutlineBan />}
                />
            )
        default:
            return <Avatar />
    }
}

const NotificationToggle = ({
    className,
    dot,
}: {
    className?: string
    dot: boolean
}) => {
    return (
        <div className={className}>
            {dot ? (
                <Badge badgeStyle={{ top: '3px', right: '6px' }}>
                    <HiOutlineBell />
                </Badge>
            ) : (
                <HiOutlineBell />
            )}
        </div>
    )
}

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<NotificationList[]>([])
    const [unreadNotification, setUnreadNotification] = useState(false)
    const [loading] = useState(false)

    const updateUnreadStatus = useCallback(() => {
        const hasUnread = notificationList.some((item) => !item.readed)
        setUnreadNotification(hasUnread)
    }, [notificationList])

    useEffect(() => {
        const socket = io(WebSocketURL); // Sử dụng socket.io-client
        socket.on('connect', () => {
            console.log('Connected to WebSocket')
        })

        // Lắng nghe sự kiện mới từ server
        socket.on('new-notification', (notification) => {
            setNotificationList((prev) => [
                {
                    id: Date.now().toString(),
                    target: notification.target || 'Unknown',
                    description: notification.message,
                    date: new Date().toISOString(),
                    image: '',
                    type: 0,
                    location: '',
                    locationLabel: '',
                    status: 'new',
                    readed: false,
                },
                ...prev,
            ])
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        updateUnreadStatus()
    }, [notificationList, updateUnreadStatus])

    const onMarkAllAsRead = useCallback(() => {
        const list = notificationList.map((item) => ({
            ...item,
            readed: true,
        }))
        setNotificationList(list)
        setUnreadNotification(false)
    }, [notificationList])

    const onMarkAsRead = useCallback(
        (id: string) => {
            const list = notificationList.map((item) =>
                item.id === id ? { ...item, readed: true } : item
            )
            setNotificationList(list)
            updateUnreadStatus()
        },
        [notificationList, updateUnreadStatus]
    )

    return (
        <Dropdown
            renderTitle={
                <NotificationToggle
                    dot={unreadNotification}
                    className={className}
                />
            }
            menuClass="p-0 min-w-[280px] md:min-w-[340px]"
            placement="bottom-end"
        >
            <Dropdown.Item variant="header">
                <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-2 flex items-center justify-between">
                    <h6>Notifications</h6>
                    <Tooltip title="Mark all as read">
                        <Button
                            variant="plain"
                            shape="circle"
                            size="sm"
                            icon={<HiOutlineMailOpen className="text-xl" />}
                            onClick={onMarkAllAsRead}
                        />
                    </Tooltip>
                </div>
            </Dropdown.Item>
            <div className="overflow-y-auto h-72">
                {notificationList.length > 0 &&
                    notificationList.map((item, index) => (
                        <div
                            key={item.id}
                            className={`relative flex px-4 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-black dark:hover:bg-opacity-20`}
                            onClick={() => onMarkAsRead(item.id)}
                        >
                            <div>{notificationTypeAvatar(item)}</div>
                            <div className="ml-3">
                                <div>
                                    {item.target && (
                                        <span className="font-semibold">{item.target}</span>
                                    )}
                                    <span>{item.description}</span>
                                </div>
                                <span className="text-xs">{item.date}</span>
                            </div>
                            <Badge
                                className="absolute top-4 right-4 mt-1.5"
                                innerClass={`${item.readed ? 'bg-gray-300' : 'bg-theme'}`}
                            />
                        </div>
                    ))}
                {loading && (
                    <div className="flex items-center justify-center h-72">
                        <Spinner size={40} />
                    </div>
                )}
            </div>
        </Dropdown>
    )
}

const Notification = _Notification
export default Notification