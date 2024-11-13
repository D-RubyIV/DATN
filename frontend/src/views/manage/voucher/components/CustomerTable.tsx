import { useState, useEffect } from 'react';
import { Button } from "@/components/ui";
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
    selectedCustomerIds: number[];
};
const CustomerTable = ({ onSelectedCustomersChange, selectedCustomerIds }: CustomerTableProps) => {
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomerIdsState, setSelectedCustomerIdsState] = useState<number[]>(selectedCustomerIds);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 10;

    // Fetch customers from API
    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const res = await instance.get(`/customer?page=${currentPage}&size=${customersPerPage}`);
                setCustomers(res.data.content);
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [currentPage]);

    // Sync selectedCustomerIdsState with prop (but only when the prop changes)
    useEffect(() => {
        if (JSON.stringify(selectedCustomerIds) !== JSON.stringify(selectedCustomerIdsState)) {
            setSelectedCustomerIdsState(selectedCustomerIds);
        }
    }, [selectedCustomerIds]);

    // Notify parent of selected customers
    useEffect(() => {
        const selectedCustomers = customers.filter(customer => selectedCustomerIdsState.includes(customer.id));
        onSelectedCustomersChange(selectedCustomers);
    }, [selectedCustomerIdsState, customers, onSelectedCustomersChange]);

    // Handle customer selection
    const handleSelectCustomer = (customerId: number) => {
        setSelectedCustomerIdsState((prevSelected) =>
            prevSelected.includes(customerId)
                ? prevSelected.filter((id) => id !== customerId)
                : [...prevSelected, customerId]
        );
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
                            color: 'black',
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
                <p className="text-gray-500 ">Loading customers...</p>
            ) : (
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr className="text-left">
                            <th className="border-b border-gray-300 px-4 py-2">Select</th>
                            <th className="border-b border-gray-300 px-4 py-2">Name</th>
                            <th className="border-b border-gray-300 px-4 py-2">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-100">
                                <td className="border-b border-gray-300 px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedCustomerIdsState.includes(customer.id)}
                                        onChange={() => handleSelectCustomer(customer.id)}
                                    />
                                </td>
                                <td className="border-b border-gray-300 px-4 py-2">{customer.name}</td>
                                <td className="border-b border-gray-300 px-4 py-2">{customer.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CustomerTable; 