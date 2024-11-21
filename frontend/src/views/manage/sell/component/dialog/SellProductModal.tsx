import { useState, useEffect, useRef, ChangeEvent, SetStateAction, Dispatch } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable'
import { HiPlusCircle } from 'react-icons/hi'
import CloseButton from '@/components/ui/CloseButton'
import type { MouseEvent } from 'react'
import { useToastContext } from '@/context/ToastContext'
import instance from '@/axios/CustomAxios'
import ProductInformation from '@/views/manage/order/component/puzzle/ProductInfomation'
import { OrderResponseDTO, ProductDetailOverviewPhah04 } from '@/@types/order'
import { useLoadingContext } from '@/context/LoadingContext'
import { Avatar } from '@/components/ui'
import { FiPackage } from 'react-icons/fi'

const SellProductModal = ({ setIsOpenProductModal, selectOrder, fetchData }: {
    setIsOpenProductModal: Dispatch<SetStateAction<boolean>>,
    selectOrder: OrderResponseDTO,
    fetchData: () => Promise<void>
}) => {
    const inputRef = useRef(null)
    const quantityRef = useRef(null)
    const [data, setData] = useState([])
    const { sleep, isLoadingComponent, setIsLoadingComponent } = useLoadingContext()
    const [isOpenPlacement, setIsOpenPlacement] = useState(false)
    const [selectedProductDetail, setSelectedProductDetail] = useState<ProductDetailOverviewPhah04>({
        id: 0,
        code: '',
        name: '',
        deleted: false,
        quantity: 1,
        price: 0,
        sizeName: '',
        colorName: '',
        productName: '',
        textureName: '',
        originName: '',
        brandName: '',
        collarName: '',
        sleeveName: '',
        materialName: '',
        thicknessName: '',
        elasticityName: '',
        images: [],
        averageDiscountPercentEvent: 0,
        eventResponseDTOS: []
    })

    const [orderDetailRequest, setOrderDetailRequest] = useState<{
        quantity?: number;
        orderId: number;
        productDetailId?: number;
    }>({
        orderId: selectOrder.id,
        quantity: 1
    })
    const [tableData, setTableData] = useState<{
        pageIndex: number
        pageSize: number
        sort: {
            order: '' | 'asc' | 'desc'
            key: string | number;
        };
        query: string
        total: number
    }>({
        total: 0,
        pageIndex: 1,
        pageSize: 5,
        query: '',
        sort: {
            order: '',
            key: ''
        }
    })
    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
    }
    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({
            ...prevData,
            pageSize: pageSize, // Cập nhật pageSize mới
            pageIndex: 1 // Đặt pageIndex về 1
        }))
    }
    const handleSort = ({ order, key }: OnSortParam) => {
        console.log({ order, key })
        setTableData((prevData) => ({
            ...prevData,
            sort: {
                order,
                key: (key as string).replace('___', '.')
            }
        }))
    }

    const hasSaleEvent = (item: ProductDetailOverviewPhah04) => {
        return item.eventResponseDTOS.length > 0

    }
    const getFinalPrice = (item: ProductDetailOverviewPhah04) => {
        const { price } = item
        const discountPercent = item.eventResponseDTOS.length > 0
            ? item.nowAverageDiscountPercentEvent
            : 0

        return Math.round(price * (1 - discountPercent / 100))
    }
    const columns: ColumnDef<ProductDetailOverviewPhah04>[] = [
        {
            header: '#',
            cell: (props) => (
                props.row.index + 1
            )
        },
        {
            header: 'Ảnh',
            cell: (props) => {
                return Array.isArray(props.row.original.images) && props.row.original.images.length > 0 ? (
                    <div className={'relative'}>
                        <Avatar className={'relative'} size={90} src={props.row.original.images[0].url}
                                shape={'round'} />
                        {
                            props.row.original.eventResponseDTOS.length > 0 && (
                                <div
                                    className={'absolute top-0 -right-4 p-1 bg-red-600 z-50 border-black border text-[10px] text-white mim-w-[45px] text-center font-semibold'}>
                                    <p>-{props.row.original.nowAverageDiscountPercentEvent} %</p>
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <div className={'relative'}>
                        <Avatar size={90} icon={<FiPackage />} />
                        {
                            props.row.original.eventResponseDTOS.length > 0 && (
                                <div
                                    className={'absolute top-0 -right-4 p-1 bg-red-600 z-50 border-black border text-[10px] text-white mim-w-[45px] text-center font-semibold'}>
                                    <p>-{props.row.original.nowAverageDiscountPercentEvent} %</p>
                                </div>
                            )
                        }
                    </div>
                )
            }
        },
        {
            header: 'Tên',
            accessorKey: 'name'
        },
        {
            header: 'Mã',
            accessorKey: 'code'
        },
        {
            header: 'Kích thước',
            accessorKey: 'size___name',
            cell: (props) => (
                props.row.original.sizeName
            )
        },
        {
            header: 'Màu sắc',
            accessorKey: 'color___name',
            cell: (props) => (
                props.row.original.colorName
            )
        },
        {
            header: 'Chất liệu',
            accessorKey: 'material___name',
            cell: (props) => (
                props.row.original.materialName
            )
        },
        {
            header: 'Thương hiệu',
            accessorKey: 'brand___name',
            cell: (props) => (
                props.row.original.brandName
            )
        },
        {
            header: 'Giá',
            accessorKey: 'price',
            cell: (props) => (
                <div className={'text-red-600'}>
                    {
                        hasSaleEvent(props.row.original) ? (
                            <div className={'flex gap-3'}>
                                <p className={'line-through'}>{Math.round(props.row.original.price).toLocaleString('vi') + 'đ'}</p>
                                <p>{Math.round(getFinalPrice(props.row.original)).toLocaleString('vi') + 'đ'}</p>
                            </div>
                        ) : (
                            <div>
                                <p className={'line-through'}>{Math.round(props.row.original.price).toLocaleString('vi') + 'đ'}</p>
                            </div>
                        )
                    }
                </div>
            )
        },
        {
            header: 'Số lương',
            accessorKey: 'quantity',
            cell: (props) => (
                props.row.original.quantity
            )
        },
        {
            header: 'Hành động',
            id: 'action',
            cell: (props) => (
                <Button size="xs" onClick={() => setSelectProductDetailAndOpenDrawer(props.row.original, true)}>
                    Chọn
                </Button>

            )
        }
    ]
    const [queryParam, setQueryParam] = useState<{
        size: number | undefined,

    }>({
        size: undefined
    })

    // FUCTION
    const { openNotification } = useToastContext()

    const setSelectProductDetailAndOpenDrawer = (productDetail: ProductDetailOverviewPhah04, isOpen: boolean) => {
        setIsOpenPlacement(true)
        setSelectedProductDetail(productDetail)
        setOrderDetailRequest((pre) => ({ ...pre, productDetailId: productDetail.id, quantity: 1 }))
    }

    const fetchDataProduct = async () => {
        setIsLoadingComponent(true)
        const response = await instance.post('/v2/product', tableData,
            {
                params: queryParam
            }
        )
        setData(response.data.content)
        setTableData((prevData) => ({
            ...prevData,
            ...{ total: response.data.totalElements }
        }))
        await fetchData()
        setIsLoadingComponent(false)
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }
    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        console.log(val)
        if ((val.length > 1 || val.length === 0)) {
            setTableData((prevData) => ({
                ...prevData,
                ...{ query: val, pageIndex: 1 }
            }))
        }
    }

    const addOrderDetail = async () => {
        await instance.post('/order-details', orderDetailRequest)
        await fetchData()
        setIsOpenPlacement(false)
        setIsOpenProductModal(false)
        await sleep(500)
        openNotification('Thêm thành công!')
        document.body.style.overflow = 'auto'
    }


    const onDrawerClose = (e: MouseEvent) => {
        console.log('onDrawerClose', e)
        setIsOpenPlacement(false)
    }

    // HOOK
    useEffect(() => {
        fetchDataProduct()
    }, [
        tableData.pageIndex,
        tableData.sort,
        tableData.pageSize,
        tableData.query,
        queryParam
    ])

    return (
        <div className="fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-40">
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 2xl:w-4/5 xl:w-4/5 w-4/5 max-h-4/5 overflow-auto bg-gray-100 z-20 shadow-md rounded-md">
                <div className="flex-wrap inline-flex xl:flex items-center gap-2 !w-[500px]">
                    <div
                        title="Thêm sản phẩm"
                        className={`${!isOpenPlacement ? 'hidden' : ''} w-3/5 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl p-5 z-50`}
                    >
                        <div className="flex justify-between py-2 text-xl">
                            <div className="font-semibold text-black">
                                <label>Thêm mới</label>
                            </div>
                            <div>
                                <CloseButton onClick={onDrawerClose}></CloseButton>
                            </div>
                        </div>
                        <hr></hr>
                        <div>
                            {selectedProductDetail &&
                                <ProductInformation seletedProductDetail={selectedProductDetail}></ProductInformation>}
                            <div className="py-5">
                                <label>Vui lòng nhập số lượng</label>
                                <Input
                                    ref={quantityRef}
                                    size="sm"
                                    type="number"
                                    min={1}
                                    max={selectedProductDetail?.quantity}
                                    value={orderDetailRequest.quantity}
                                    onChange={(el) => setOrderDetailRequest({
                                        ...orderDetailRequest,
                                        quantity: Number(el.target.value)
                                    })}
                                />
                                <Button block variant="solid" size="sm" className="bg-indigo-500 w-full mt-5"
                                        icon={<HiPlusCircle />} onClick={() => addOrderDetail()}>
                                    Thêm sản phẩm
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-white !h-4/5 rounded-md">
                    <div className="flex justify-between pb-3">
                        <div>
                            <p className="font-semibold text-xl">Danh sách sản phẩm chi tiết</p>
                        </div>
                        <div>
                            <CloseButton className="text-2xl py-1" onClick={() => {
                                setIsOpenProductModal(false)
                                document.body.style.overflow = 'auto'
                            }}></CloseButton>

                        </div>
                    </div>
                    <div>
                        <div>
                            <Input
                                ref={inputRef}
                                placeholder="Search..."
                                size="sm"
                                className="lg:w-full"
                                onChange={() => handleChange}
                            />
                        </div>
                        <DataTable
                            columns={columns}
                            data={data}
                            loading={isLoadingComponent}
                            pagingData={tableData}
                            onPaginationChange={handlePaginationChange}
                            onSelectChange={handleSelectChange}
                            onSort={handleSort}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SellProductModal