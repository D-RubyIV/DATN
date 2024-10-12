import { Button, Card } from "@/components/ui";
import { useEffect, useState } from "react";
import { HiArrowsExpand, HiPlusCircle, HiQrcode, HiSelector } from "react-icons/hi";
import { Fragment } from "react/jsx-runtime";
import { OrderDetailOverview } from "../..";
import SellProductTable from "../table/SellProductTable";
import SellCustomerTable from "../table/SellCustomerTable";
import { console } from "inspector";

const TabCard = ({ something }: { something: any }) => {

    // init variables
    const [isOpenCustomerModal, setIsOpenCustomerModal] = useState<boolean>(false)
    const [isOpenProductModal, setIsOpenProductModal] = useState<boolean>(false)
    const [listOrderDetailOverview, setListOrderDetailOverview] = useState<OrderDetailOverview[]>([])
    
    return (
        <Fragment>
            <div className="xl:grid xl:grid-cols-12 gap-5 mt-10">
                <Card className="xl:col-span-8">
                    <div className="flex justify-between items-center py-2">
                        <div className="font-semibold text-[16px] text-black">
                            <label>
                                Danh sách sản phẩm {something}
                            </label>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="default" icon={<HiQrcode />}>Quét mã QR</Button>
                            <Button variant="default" icon={<HiPlusCircle />}>Thêm sản phẩm</Button>
                        </div>
                    </div>
                    <div>
                        <SellProductTable></SellProductTable>
                    </div>
                </Card>
                <Card className="xl:col-span-4 flex justify-between py-2">
                    <div className="font-semibold text-[16px] text-black">
                        <label>Thông tin khách hàng</label>
                    </div>
                    <div className="flex gap-3 justify-between">
                        <div>
                            <Button
                                variant="default" icon={<HiArrowsExpand />}
                                onClick={() => setIsOpenCustomerModal(true)}
                            >Chọn
                            </Button>
                        </div>
                        <div>
                            <Button variant="default" icon={<HiPlusCircle />}>Thêm mới</Button>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                {
                    isOpenCustomerModal && (<SellCustomerTable setIsOpenModal={setIsOpenCustomerModal}></SellCustomerTable>)
                }
            </div>
        </Fragment >
    );
}

export default TabCard;