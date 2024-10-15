import { IconText } from "@/components/shared";
import { Avatar, Card, Input, Radio, Switcher, Tooltip } from "@/components/ui";
import AddressModal from "@/views/manage/order/component/puzzle/AddressModal";
import { BillResponseDTO } from "@/views/manage/order/store";
import { useState } from "react";
import { HiExternalLink, HiMail, HiPencilAlt, HiPhone } from "react-icons/hi";
import { Link } from "react-router-dom";

const CustomerInfo = ({ data }: { data: BillResponseDTO }) => {
    const [isOpenEditAddress, setIsOpenEditAddress] = useState(false);

    const customer = data?.customerResponseDTO || {};
    const addresses = customer.addressResponseDTOS || [];

    return (
        <Card className='mb-5 h-[450px]'>
            {isOpenEditAddress && <AddressModal onCloseModal={setIsOpenEditAddress} />}

            <h5 className="mb-4">
                Khách hàng #{customer.code || "Khách lẻ"}
            </h5>

            <Link className="group flex items-center justify-between" to="/app/crm/customer-details?id=11">
                <div className="flex items-center">
                    <Avatar shape="circle" src={"https://th.bing.com/th/id/OIP.QypR4Rt5VeZ3Po2g8HQ2_QAAAA?rs=1&pid=ImgDetMain"} />
                    <div className="ltr:ml-2 rtl:mr-2">
                        <div className="font-semibold group-hover:text-gray-900 group-hover:dark:text-gray-100">
                            {customer.name || "Khách lẻ"}
                        </div>
                        <span>
                            <span className="font-semibold">{customer.code ? 1 : 0}</span> đơn hàng trước đó
                        </span>
                    </div>
                </div>
                <HiExternalLink className="text-xl hidden group-hover:block" />
            </Link>
            <hr className="my-5" />
            {
                customer.code && (
                    <div>


                        <IconText className="mb-4" icon={<HiMail className="text-xl opacity-70" />}>
                            <span className="font-semibold">{customer.email || ""}</span>
                        </IconText>

                        <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                            <span className="font-semibold">{customer.phone || ""}</span>
                        </IconText>

                    </div>
                )
            }
            <hr className="my-5" />

            <div>
                <div className="flex justify-between items-center">
                    <div>
                        <h6 className="mb-4">Hình thức nhận hàng</h6>
                    </div>
                    <div className="text-black">
                        <div className="font-semibold">
                            <Radio className="mr-4" name="simpleRadioExample">
                                Tại quầy
                            </Radio>
                            <Radio defaultChecked name="simpleRadioExample">
                                Giao hàng
                            </Radio>
                        </div>
                    </div>
                </div>
                <address className="not-italic my-2">
                    <Input
                        disabled
                        value={data?.address || ""}
                        suffix={
                            <Tooltip title="Chỉnh sửa địa chỉ">
                                <HiPencilAlt className="text-lg cursor-pointer ml-1" onClick={() => setIsOpenEditAddress(true)} />
                            </Tooltip>
                        }
                    />
                </address>
                <Radio.Group vertical>
                    {addresses.length ? (
                        addresses.map((item, index) => (
                            <Radio value={item.id} key={index}>
                                {item.phone} - {item.detail}
                            </Radio>
                        ))
                    ) : (
                        <div className='flex justify-center items-center'>
                            <p className='py-2'>Không có bất kì địa chỉ nào khác</p>
                        </div>
                    )}
                </Radio.Group>
            </div>
        </Card>
    );
};

export default CustomerInfo;
