import CustomerTable from "./component/CustomerTable";


const CustomerManage = () => {

    return (
        <div className="bg-white">
            <div className="p-8 shadow-md rounded-md card h-full card-border">
                <CustomerTable />
            </div>
        </div>
    );
}

export default CustomerManage;