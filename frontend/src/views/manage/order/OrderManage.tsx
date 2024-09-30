import { OrderTable } from "./component/core/OrderTable";

const OrderManage = () => {
    return (
        <div className="">
            <div>
                <p className="font-semibold text-xl">Quản lý hóa đơn</p>
            </div>
            <div className="bg-white">
                <OrderTable></OrderTable>
            </div>
        </div>
    );
}

export default OrderManage;