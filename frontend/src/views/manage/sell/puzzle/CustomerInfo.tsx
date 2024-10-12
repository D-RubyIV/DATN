import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import Timeline from '@/components/ui/Timeline/Timeline';
import TimeLineItem from '@/components/ui/Timeline/TimeLineItem';
import Axios from 'axios';
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiMail, HiPhone, HiExternalLink, HiPlusCircle, HiOutlineExclamationCircle, HiPencil, HiPencilAlt } from 'react-icons/hi'
import { Link, useParams } from 'react-router-dom'
import { Input, Notification, Radio, toast, Tooltip } from '@/components/ui';
import { inspect } from 'util';
import instance from '@/axios/CustomAxios';
import AddressModal from '@/views/manage/order/component/puzzle/AddressModal';

type AddressResponseDTOS = {
    id: number,
    phone: string,
    detail: string
}

type CustomerResponseDTO = {
    code: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    deleted: boolean;
    birthDay: string; // Consider using Date type if applicable
    addressResponseDTOS: AddressResponseDTOS[]; // Define this type if applicable
}

type BillResponseDTO = {
    address: string;
    customerResponseDTO: CustomerResponseDTO;
}

const CustomerInfo = ({ data }: { data: BillResponseDTO }) => {
    const [isOpenEditAddress, setIsOpenEditAddress] = useState<boolean>(false)

    return (
        <Card className='mb-5 h-[450px]'>
            {isOpenEditAddress && <AddressModal onCloseModal={setIsOpenEditAddress}></AddressModal>}

            <h5 className="mb-4">Khách hàng #{data.customerResponseDTO.code}</h5>
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
                            đơn hàng trước đó
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
            <h6 className="mb-4">Địa chỉ nhận hàng</h6>
            <address className="not-italic">
                <div className="mb-4">
                    {/* {data?.address} */}
                    <Input
                        disabled

                        value={data.address}
                        suffix={
                            <Tooltip title="Field info">
                                <HiPencilAlt className="text-lg cursor-pointer ml-1" onClick={() => setIsOpenEditAddress(true)} />
                            </Tooltip>
                        }
                    ></Input>
                </div>
                <Radio.Group vertical>
                    {data.customerResponseDTO?.addressResponseDTOS?.length ? (
                        data.customerResponseDTO.addressResponseDTOS.map((item, index) => (
                            <Radio value={item.id} key={index}>
                                {item.phone} - {item.detail}
                            </Radio>
                        ))
                    ) : (
                        <div className='flex justify-center items-center'>
                            <div className='py-2'>
                                <p>Không có bất kì địa chỉ nào khác</p>
                            </div>
                        </div>
                    )}
                </Radio.Group>

                <ul>

                </ul>
            </address>
        </Card>
    )
}
