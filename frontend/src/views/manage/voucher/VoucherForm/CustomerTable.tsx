import { useState, useEffect } from 'react';
import { Button } from "@/components/ui";
import axios from "axios";

type ICustomer = {
    id: number;
    name: string;
    email: string;
}

const CustomerTable = () => {
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]); // Lưu danh sách ID khách hàng được chọn

    // Xử lý khi chọn hoặc bỏ chọn khách hàng
    const handleSelectCustomer = (customerId: number) => {
        setSelectedCustomerIds((prevSelected) =>
            prevSelected.includes(customerId)
                ? prevSelected.filter((id) => id !== customerId) // Bỏ chọn khách hàng
                : [...prevSelected, customerId] // Thêm ID vào danh sách đã chọn
        );
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:8080/api/v1/customer/get-all');
                setCustomers(res.data); // Giả sử API trả về danh sách khách hàng
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    return (
        <div>
            <h2>Customer List</h2>
            {loading ? (
                <p>Loading customers...</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Select</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td className="border px-4 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedCustomerIds.includes(customer.id)}
                                        onChange={() => handleSelectCustomer(customer.id)}
                                    />
                                </td>
                                <td className="border px-4 py-2">{customer.name}</td>
                                <td className="border px-4 py-2">{customer.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="mt-4">
                <Button size="md" onClick={() => console.log('Selected Customer IDs:', selectedCustomerIds)}>
                    Get Selected Customers
                </Button>
            </div>
        </div>
    );
};

export default CustomerTable;
