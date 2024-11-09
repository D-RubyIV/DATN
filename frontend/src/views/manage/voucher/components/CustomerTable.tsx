import { useState, useEffect } from 'react';
import { Button } from "@/components/ui";
import axios from "axios";
import { IoIosSearch } from 'react-icons/io';
import { Input } from 'antd';
import instance from "@/axios/CustomAxios";

type ICustomer = {
    id: number;
    name: string;
    email: string;
    phone: string;
};

type CustomerTableProps = {
    onSelectedCustomersChange: (selectedCustomers: ICustomer[]) => void;
};

const CustomerTable = ({ onSelectedCustomersChange }: CustomerTableProps) => {
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [customersPerPage] = useState(5); // Số khách hàng trên mỗi trang

    // Fetch customers from API
    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const res = await instance.get('/customer');
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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    // Filtered customers
    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

    return (
        <div className="overflow-x-auto">

            {/* Search Input */}
            <div className="mb-4">
                <div style={{ position: 'relative', width: '500px' }}>
                    <IoIosSearch
                        style={{
                            color:'black',
                            position: 'absolute',
                            left: '5px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '20px',
                            pointerEvents: 'none'
                        }}
                    />
                    <Input
                        placeholder="Tìm kiếm theo tên, email, số điện thoại,..."
                        style={{
                            width: '100%',
                            height: '37px',
                            paddingLeft: '30px',
                            boxSizing: 'border-box',
                        }}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading customers...</p>
            ) : (
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-blue-200">
                        <tr className="text-left">
                            <th className="border-b border-gray-300 px-4 py-2">Select</th>
                            <th className="border-b border-gray-300 px-4 py-2">Name</th>
                            <th className="border-b border-gray-300 px-4 py-2">Email</th>
                            <th className="border-b border-gray-300 px-4 py-2">Phone</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-100 transition duration-200">
                                <td className="border-b border-gray-300 px-4 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedCustomerIds.includes(customer.id)}
                                        onChange={() => handleSelectCustomer(customer.id)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                </td>
                                <td className="border-b border-gray-300 px-4 py-2">{customer.name}</td>
                                <td className="border-b border-gray-300 px-4 py-2">{customer.email}</td>
                                <td className="border-b border-gray-300 px-4 py-2">{customer.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-blue-600 text-black rounded-lg px-4 py-2"
                >
                    Previous
                </Button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-blue-600 text-black rounded-lg px-4 py-2"
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default CustomerTable;
