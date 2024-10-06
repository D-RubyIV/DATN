import { OrderTable } from "./component/core/OrderTable";

const OrderManage = () => {
    return ( 
        <div className="bg-white">
            <div className="p-8 shadow-md rounded-md card h-full card-border">
                <OrderTable></OrderTable>
            </div>
        </div>
     );
}
 
export default OrderManage;