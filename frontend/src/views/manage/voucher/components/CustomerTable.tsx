import { useState, useEffect } from 'react';
import { Button } from "@/components/ui";
import axios from "axios";

type ICustomer = {
    id: number;
    name: string;
    email: string;
};

type CustomerTableProps = {
    onSelectedCustomersChange: (selectedCustomers: ICustomer[]) => void;
};

const CustomerTable = ({ onSelectedCustomersChange }: CustomerTableProps) => {
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);

    // Fetch customers from API
    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:8080/api/v1/customer');
                setCustomers(res.data.content);
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    // Effect to notify parent of selected customers
    useEffect(() => {
        const selectedCustomers = customers.filter(customer => selectedCustomerIds.includes(customer.id));
        onSelectedCustomersChange(selectedCustomers);
    }, [selectedCustomerIds, customers]); // Chỉ bao gồm selectedCustomerIds và customers

    // Handle customer selection
    const handleSelectCustomer = (customerId: number) => {
        setSelectedCustomerIds((prevSelected) => {
            const updatedSelected = prevSelected.includes(customerId)
                ? prevSelected.filter((id) => id !== customerId)
                : [...prevSelected, customerId];

            return updatedSelected; 
        });
    };

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
        </div>
    );
};

export default CustomerTable;
