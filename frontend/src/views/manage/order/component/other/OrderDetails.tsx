import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import BillTimeLine from '../puzzle/OrderTimeLine';
import Timeline from '@/components/ui/Timeline/Timeline';
import TimeLineItem from '@/components/ui/Timeline/TimeLineItem';
import Axios from 'axios';
import { BillResponseDTO, OrderDetailResponseDTO, ProductOrderDetail } from '../../store';
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiMail, HiPhone, HiExternalLink, HiPlusCircle } from 'react-icons/hi'
import { Link, useParams } from 'react-router-dom'
import OrderProducts from '../puzzle/OrderProducts';
import PaymentSummary from '../puzzle/PaymentSummary';
import OrderStep from '../puzzle/OrderStep';
import OrderInfo from '../puzzle/OderInfo';
import { Radio } from '@/components/ui';

interface IProps {
    selectedId: number,
    dialogIsOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;  // Sửa kiểu hàm setIsOpen
}

const OrderDetails = () => {

    const { id } = useParams()

    const [selectObject, setSelectObject] = useState<BillResponseDTO>()
    const [listOrderDetail, setListOrderDetail] = useState<OrderDetailResponseDTO[]>([])
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        await Axios.get(`http://localhost:8080/api/v1/orders/${id}`).then(function (response) {
            console.log(response)
            setSelectObject(response.data)
            setListOrderDetail(response.data.orderDetailResponseDTOS)
        })
    }

    useEffect(() => {
        console.log("Selected Bill: ", selectObject)
    }, [selectObject])



    return (
        <div>
            <div>
                <div className='grid grid-cols-12 gap-5'>
                    <div className='col-span-8'>
                        <div className='flex flex-col gap-5'>
                            <OrderStep></OrderStep>
                            <OrderProducts data={listOrderDetail}></OrderProducts>
                        </div>
                    </div>
                    <div className='col-span-4'>
                        {selectObject !== undefined && <OrderInfo data={selectObject}></OrderInfo>}
                        {selectObject !== undefined && <CustomerInfo data={selectObject}></CustomerInfo>}
                        <PaymentSummary></PaymentSummary>
                    </div>
                </div>
            </div>
        </div>
    )
}




const CustomerInfo = ({ data }: { data: BillResponseDTO }) => {
    return (
        <Card className='mb-4'>
            <h5 className="mb-4">Customer #{data.customerResponseDTO.code}</h5>
            <Link
                className="group flex items-center justify-between"
                to="/app/crm/customer-details?id=11"
            >
                <div className="flex items-center">
                    <Avatar shape="circle" src={"https://th.bing.com/th/id/OIP.QypR4Rt5VeZ3Po2g8HQ2_QAAAA?rs=1&pid=ImgDetMain"} />
                    <div className="ltr:ml-2 rtl:mr-2">
                        <div className="font-semibold group-hover:text-gray-900 group-hover:dark:text-gray-100">
                            {data?.customerResponseDTO.name}
                        </div>
                        <span>
                            <span className="font-semibold">
                                {1}{' '}
                            </span>
                            previous orders
                        </span>
                    </div>
                </div>
                <HiExternalLink className="text-xl hidden group-hover:block" />
            </Link>
            <hr className="my-5" />
            <IconText
                className="mb-4"
                icon={<HiMail className="text-xl opacity-70" />}
            >
                <span className="font-semibold">{data?.customerResponseDTO.email}</span>
            </IconText>
            <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                <span className="font-semibold">{data?.customerResponseDTO.phone}</span>
            </IconText>
            <hr className="my-5" />
            <h6 className="mb-4">Shipping Address</h6>
            <address className="not-italic">
                <div className="mb-1">{data?.address}</div>
                <Radio.Group vertical >
                    {
                        data.customerResponseDTO.addressResponseDTOS.map((item, index) => (
                            <Radio value={item.id} key={index}>{item.phone} - {item.detail}</Radio>
                        ))
                    }
                </Radio.Group>
                <ul>

                </ul>
            </address>
        </Card>
    )
}


export default OrderDetails
