import { useMemo, useEffect, useState, useCallback } from 'react';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import type { CellContext } from '@tanstack/react-table';
import AdaptableCard from '@/components/shared/AdaptableCard';
import { MdDelete } from 'react-icons/md';
import type { DetailedProduct } from '../store';
import { useAppDispatch } from '@/store';
import { removeCombination, updateCombination } from '../store';
import ProductImages from './ProductImages'
interface TableMeta {
    updateData: (productCode: string, columnId: keyof DetailedProduct, value: unknown) => void;
}

interface DetailedProductListProps {
    productCombinations: DetailedProduct[];
    errors: Record<string, any>;
    touched: Record<string, any>;
}

const { Tr, Th, Td, THead, TBody } = Table;

const formatPrice = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const EditableCell = ({
    getValue,
    productCode,
    column,
    table,
    invalid,
    errorMessage,
}: CellContext<DetailedProduct, unknown> & {
    productCode: string;
    invalid: boolean;
    errorMessage?: string;
}) => {
    const initialValue = getValue() as string | number;
    const [value, setValue] = useState<string | number>(initialValue);

    const onBlur = () => {
        const meta = table.options.meta as TableMeta | undefined;
        if (meta) {
            const updatedValue = typeof value === 'number' ? value : value.trim();
            if (updatedValue !== '' && updatedValue !== undefined) {
                console.log(`Updating ${column.id} to ${updatedValue} for product ${productCode}`);
                meta.updateData(productCode, column.accessorKey as keyof DetailedProduct, updatedValue);
            } else {
                console.warn(`Invalid value for ${column.id} for product ${productCode}:`, updatedValue);
            }
        }
    };

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <div>
            <Input
                className={`border-transparent bg-transparent hover:border-gray-300 focus:bg-white ${invalid ? 'border-red-500' : ''}`}
                size="sm"
                value={typeof value === 'number' ? formatPrice(value) : value}
                onChange={e => setValue(typeof value === 'number' ? Number(e.target.value.replace(/\./g, '')) : e.target.value)}
                onBlur={onBlur}
                aria-label={`Edit ${column.id}`}
            />
            {invalid && errorMessage && (
                <span className="text-red-500 text-xs">{errorMessage}</span>
            )}
        </div>
    );
};

const DetailedProductList: React.FC<DetailedProductListProps> = ({ productCombinations, errors, touched }) => {
    const dispatch = useAppDispatch();

    const columns = useMemo(() => [
        { header: 'Tên', accessorKey: 'name' },
        { header: 'Kích thước', accessorKey: 'size.name' },
        { header: 'Giá', accessorKey: 'price', cell: EditableCell },
        { header: 'Số lượng', accessorKey: 'quantity', cell: EditableCell },
    ], []);

    const updateData = useCallback((productCode: string, columnId: keyof DetailedProduct, value: unknown) => {
        const productToUpdate = productCombinations.find(product => product.code === productCode);

        if (productToUpdate) {
            const updatedProduct = {
                ...productToUpdate,
                [columnId]: value
            } as DetailedProduct;

            console.log('Updating Product:', updatedProduct);

            if (typeof updatedProduct.price === 'number' && updatedProduct.price >= 0 &&
                typeof updatedProduct.quantity === 'number' && updatedProduct.quantity >= 0) {
                dispatch(updateCombination(updatedProduct));
            } else {
                console.error('Invalid update: Price or Quantity is invalid:', updatedProduct);
            }
        }
    }, [dispatch, productCombinations]);

    const table = useReactTable<DetailedProduct>({
        data: productCombinations,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData,
        } as TableMeta,
    });

    const handleDelete = (code: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            dispatch(removeCombination(code));
        }
    };

    const groupedProducts = useMemo(() => {
        return productCombinations.reduce((groups, product) => {
            const colorName = product.color?.name || 'Unknown';
            if (!groups[colorName]) {
                groups[colorName] = [];
            }
            groups[colorName].push(product);
            return groups;
        }, {} as Record<string, DetailedProduct[]>);
    }, [productCombinations]);

    return (
        <>
            {Object.entries(groupedProducts).map(([color, products]) => (
                <AdaptableCard key={color}>
                    <h2 className="font-bold text-xl">Sản Phẩm Chi Tiết Màu {color}</h2>
                    <Table>
                        <THead>
                            <Tr>
                                <Th>#</Th>
                                {columns.map(column => (
                                    <Th key={column.accessorKey}>{column.header}</Th>
                                ))}
                                <Th></Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {products.map((product, index) => (
                                <Tr key={product.code}>
                                    <Td>{index + 1}</Td>
                                    {columns.map(column => (
                                        <Td key={`${product.code}-${column.accessorKey}`}>
                                            {column.accessorKey === 'price' || column.accessorKey === 'quantity' ? (
                                                <EditableCell
                                                    getValue={() => product[column.accessorKey]}
                                                    productCode={product.code}
                                                    column={column}
                                                    table={table}
                                                    invalid={Boolean(errors[column.accessorKey] && touched[column.accessorKey])}
                                                    errorMessage={errors[column.accessorKey] as string}
                                                />
                                            ) : (
                                                <span>{column.accessorKey === 'size.name' ? product.size.name : product[column.accessorKey]}</span>
                                            )}
                                        </Td>
                                    ))}
                                    <Td>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(product.code)}
                                            className="text-red-400 hover:text-red-600"
                                            aria-label={`Xóa sản phẩm với mã ${product.code}`}
                                        >
                                            <MdDelete size={23} />
                                        </button>
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                    <div className="lg:col-span-1">
                        {/* <ProductImages  /> */}
                    </div>
                </AdaptableCard>
            ))}
        </>
    );
};

export default DetailedProductList;
