import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import BillTimeLine from './OrderTimeLine';
import Timeline from '@/components/ui/Timeline/Timeline';
import TimeLineItem from '@/components/ui/Timeline/TimeLineItem';
import Axios from 'axios';
import { BillResponseDTO } from '../store';
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiMail, HiPhone, HiExternalLink } from 'react-icons/hi'
import { Link, useParams } from 'react-router-dom'
import OrderProducts from './OrderProducts';
import PaymentSummary from './PaymentSummary';
import OrderStep from './OrderStep';

interface IProps {
    selectedId: number,
    dialogIsOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;  // Sửa kiểu hàm setIsOpen
}

const OrderDetails = () => {

    const { id } = useParams()

    const [selectObject, setSelectObject] = useState<BillResponseDTO>()
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        await Axios.get(`http://localhost:8080/api/v1/orders/${id}`).then(function (response) {
            console.log(response)
            setSelectObject(response.data)
        })
    }

    useEffect(() => {
        console.log("Selected Bill: ", selectObject)
    }, [selectObject])



    return (
        <div>
            <div>
                <div className='grid grid-cols-12 gap-10'>
                    <div className='col-span-8'>
                        <div>
                            <OrderProducts></OrderProducts>
                            <OrderStep></OrderStep>
                        </div>
                    </div>
                    <div className='col-span-4'>
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
        <Card>
            <h5 className="mb-4">Customer</h5>
            <Link
                className="group flex items-center justify-between"
                to="/app/crm/customer-details?id=11"
            >
                <div className="flex items-center">
                    <Avatar shape="circle" src={"https://elstar.themenate.net/img/avatars/thumb-11.jpg"} />
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

            </address>
        </Card>
    )
}


export default OrderDetails
