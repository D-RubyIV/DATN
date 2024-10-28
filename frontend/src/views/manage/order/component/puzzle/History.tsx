import Timeline from '@/components/ui/Timeline'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { HiTag } from 'react-icons/hi'
import type { AvatarProps } from '@/components/ui/Avatar'
import { BillResponseDTO } from '../../store'

type TimelineAvatarProps = AvatarProps

const TimelineAvatar = ({ children, ...rest }: TimelineAvatarProps) => {
    return (
        <Avatar {...rest} size={25} shape="circle">
            {children}
        </Avatar>
    )
}

const History = ({ selectObject }: { selectObject: BillResponseDTO }) => {
    return (
        <div className="max-w-[700px]">
            <Timeline>
                {
                    selectObject.historyResponseDTOS.map((item, index) => (
                        <Timeline.Item
                            media={
                                <TimelineAvatar
                                    src="/img/avatars/thumb-3.jpg"
                                    className="bg-amber-500"
                                />
                            }
                        >
                            <p className="my-1 flex items-center">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {item.createdBy || "Người dùng không xác định"}
                                </span>
                                <span className="mx-2">đã chuyển trạng thái </span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    Đơn hàng
                                </span>
                                <span className="ml-3 rtl:mr-3">2d trước</span>
                            </p>
                            <Card className="mt-4">
                                <p>
                                    Trạng thái:{" " + item.status}
                                </p>
                                <p>
                                    Ghi chú:{" " + item.note}
                                </p>
                            </Card>
                        </Timeline.Item>
                    ))
                }

            </Timeline>
        </div>
    )
}

export default History

