
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { Input } from 'antd';
import instance from "@/axios/CustomAxios";

type ICustomer = {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
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
    const [totalPages, setTotalPages] = useState(0);

    const customersPerPage = 5;

    // Fetch customers from API
    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const res = await instance.get(`/customer?page=${currentPage}&size=${customersPerPage}`);
                const { content, totalPages } = res.data;
                setCustomers(
                    content.map((customer: any) => ({
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone,
                    }))
                );
                setTotalPages(totalPages);
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [currentPage]);

    const handleSelectCustomer = useCallback((customerId: number) => {
        setSelectedCustomerIdsState((prevSelected) =>
            prevSelected.includes(customerId)
                ? prevSelected.filter((id) => id !== customerId)
                : [...prevSelected, customerId]
        );
    }, []);

    useEffect(() => {
        setSelectedCustomerIdsState(selectedCustomerIds);
    }, [selectedCustomerIds]);

    useEffect(() => {
        if (selectedCustomerIdsState.length === selectedCustomerIds.length) return; // Prevent unnecessary updates
        const selectedCustomers = customers.filter((customer) =>
            selectedCustomerIdsState.includes(customer.id)
        );
        onSelectedCustomersChange(selectedCustomers);
    }, [selectedCustomerIdsState, customers, onSelectedCustomersChange]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) =>
            (customer.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (customer.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [customers, searchTerm]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

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
                            pointerEvents: 'none',
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
                    <thead className="bg-gray-200">
                        <tr className="text-left">
                            <th className="border-b border-gray-300 px-4 py-2">Select</th>
                            <th className="border-b border-gray-300 px-4 py-2">Name</th>
                            <th className="border-b border-gray-300 px-4 py-2">Email</th>
                            <th className="border-b border-gray-300 px-4 py-2">Phone</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-100 transition duration-200">
                                <td className="border-b border-gray-300 px-4 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedCustomerIdsState.includes(customer.id)}
                                        onChange={() => handleSelectCustomer(customer.id)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                </td>
                                <td className="border-b border-gray-300 px-4 py-2">{customer.name || 'N/A'}</td>
                                <td className="border-b border-gray-300 px-4 py-2">{customer.email || 'N/A'}</td>
                                <td className="border-b border-gray-300 px-4 py-2">{customer.phone || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`cursor-pointer ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600'}`}
                >
                    PREV
                </div>

                <span>{`Page ${currentPage} of ${totalPages}`}</span>

                <div
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`cursor-pointer ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-600'}`}
                >
                    NEXT
                </div>
            </div>
        </div>
    );
};

export default CustomerTable;