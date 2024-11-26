import { Fragment, type MouseEvent, useEffect, useMemo, useState } from 'react'
import instance from '@/axios/CustomAxios'
import DataTable, { type OnSortParam, ColumnDef } from '../../../../components/shared/DataTable'
import * as Yup from 'yup'
import { Attribute } from '@/views/manage/product/attributeForm/store'
import { Button, Dialog, Input, Select } from '@/components/ui'
import { HiEye, HiPlusCircle } from 'react-icons/hi'
import debounce from 'lodash/debounce'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { DeleteForever } from '@mui/icons-material'
import { useToastContext } from '@/context/ToastContext'
import Badge from '@/components/ui/Badge'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FaFileDownload } from 'react-icons/fa'

type PaginationRequest = {
    pageIndex: number;
    pageSize: number;
    sort: {
        order: string;
        key: string;
    };
    query: string;
    deleted: boolean | undefined
};

type Property = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
};

type MODE = 'CREATE' | 'VIEW' | 'UPDATE'

const options = [
    { value: 'true', label: 'Đang hoạt động' },
    { value: 'false', label: 'Ngừng hoạt động' }
]

const getDeletedStatus = (deleted: boolean) => {
    if (deleted) {
        return {
            label: 'Dừng hoạt động',
            dotClass: 'bg-red-500',
            textClass: 'text-red-500'
        }
    } else {
        return {
            label: 'Đang hoạt động',
            dotClass: 'bg-emerald-500',
            textClass: 'text-emerald-500'
        }
    }
}

const View = ({ endpoint, nameProperty }: { endpoint: string, nameProperty: string }) => {
    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Tên là bắt buộc')
            .min(2, 'Tên phải có ít nhất 2 ký tự')
            .max(50, 'Tên không được vượt quá 50 ký tự'),
        code: Yup.string()
            .required('Mã là bắt buộc')
            .min(5, 'Mã phải có ít nhất 5 ký tự')
            .max(8, 'Mã không được vượt quá 8 ký tự')
    })
    const [selectedMode, setSelectedMode] = useState<MODE>('VIEW')
    const [listProperty, setListProperty] = useState<Property[]>([])
    const [totalElements, setTotalElements] = useState<number>(0)
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [selectedPropertyId, setSelectedPropertyId] = useState<number>()

    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState<boolean>(false)
    const onDialogConfirmClose = () => {
        setIsOpenConfirmDialog(false)
    }
    const { openNotification } = useToastContext()
    const onDialogConfirmOk = async () => {
        instance.delete(
            `${endpoint}/delete/${selectedPropertyId}`
        ).then(function(response) {
            console.log(response)
            if (response.status === 204) {
                fetchData()
                openNotification('Xóa thành công')
            }
        }).catch(function(error) {
            console.log(error)
        })
        setIsOpenConfirmDialog(false)
    }

    const [initValueForm, setInitValueForm] = useState({
        name: '',
        code: ''
    })

    const onClickCreateAction = () => {
        setSelectedMode('CREATE')
        setIsOpen(true)
    }

    const [defaultPagination, setDefaultPagination] = useState<PaginationRequest>({
        pageIndex: 1,
        pageSize: 10,
        sort: {
            order: '',
            key: ''
        },
        query: '',
        deleted: undefined
    })


    const onSubmit = async (values: { name: string, code: string }) => {
        console.log('Form Submitted', values)
        if (selectedMode === 'CREATE') {
            await handleAddProperty(values)
        }
        setIsOpen(false)
    }

    const openDialog = (mode: MODE) => {
        setSelectedMode(mode)
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const handleDelete = async (row: Attribute) => {
        setSelectedPropertyId(row.id)
        setIsOpenConfirmDialog(true)
    }

    const handleAddProperty = async (values: { name: string, code: string }) => {
        console.log(values)
        const data = {
            name: values.name,
            code: values.code
        }
        instance.post(
            `${endpoint}/save`,
            data
        ).then(function(response) {
            console.log(response)
            if (response.status === 200 && response?.data?.content) {
                fetchData()
            }
        }).catch(function(error) {
            console.log(error)
        })
    }

    const fetchData = async () => {
        instance.post(
            `${endpoint}/overview`,
            defaultPagination
        ).then(function(response) {
            console.log(response)
            if (response.status === 200 && response?.data?.content) {
                if (response?.data?.totalElements) {
                    setTotalElements(response.data.totalElements)
                }
                setListProperty(response?.data?.content)
            }
        }).catch(function(error) {
            console.log(error)
        })
    }
    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        setDefaultPagination((prev) => ({
            ...prev,
            query: val,
            pageIndex: 1
        }))
    }

    const onChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        debounceFn(value)
    }
    const onPaginationChange = (page: number) => {
        setDefaultPagination((prev) => ({
            ...prev,
            pageIndex: page
        }))
    }

    const onSelectChange = (size: number) => {
        setDefaultPagination((pre) => ({
            ...pre, pageSize: size
        }))
    }

    const onSort = (sort: OnSortParam) => {
        console.log(sort)
    }

    const handleSelect = (row: Attribute) => {
        const name = row.name
        const code = row.code
        setInitValueForm({
            name: name,
            code: code
        })
        openDialog('VIEW')
    }


    const columns: ColumnDef<Attribute>[] = useMemo(
        () => [
            {
                header: '#',
                id: 'index',
                cell: (props) => {
                    const { pageIndex, pageSize } = props.table.getState().pagination // Lấy thông tin phân trang
                    const index = (pageIndex) * pageSize + (props.row.index + 1) // Tính số thứ tự
                    return <span>{index}</span> // Hiển thị số thứ tự
                }
            },
            {
                header: 'Mã',
                accessorKey: 'code',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.code}</span>
                }
            },
            {
                header: 'Tên',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.name}</span>
                }
            },
            {
                header: 'Ngày tạo',
                accessorKey: 'createdDate',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{format(row.createdDate, 'HH:mm dd-MM-yyyy')}</span>
                }
            },
            {
                header: 'Trạng thái',
                accessorKey: 'deleted',
                cell: (props) => {
                    const row = props.row.original
                    const status = getDeletedStatus(row.deleted)
                    return (
                        <div className="flex items-center gap-2">
                            <Badge className={status.dotClass} />
                            <span
                                className={`capitalize font-semibold ${status.textClass}`}>{row.deleted ? 'Ngừng hoạt động' : 'Đang hoạt động'}</span>
                        </div>
                    )
                }
            },
            {
                header: 'Hành động',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className={'flex gap-2'}>
                            <Button
                                icon={<HiEye />}
                                variant={'plain'}
                                onClick={() => handleSelect(row)}
                            />
                            <Button
                                variant={'plain'}
                                icon={<DeleteForever />}
                                onClick={() => handleDelete(row)}
                            />
                        </div>
                    )
                }
            }
        ],
        []
    )

    useEffect(() => {
        fetchData()
    }, [defaultPagination.pageSize, defaultPagination.pageIndex, defaultPagination.sort, defaultPagination.query])

    return (
        <Fragment>
            <div className={'p-5 rounded-md card h-full card-border'}>
                <div className="lg:flex items-center justify-between mb-4">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li>
                                <div className="flex items-center">
                                    <Link to="/" className="text-gray-700 hover:text-blue-600">
                                        Trang Chủ
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-2">/</span>
                                    <Link to="/manage" className="text-gray-700 hover:text-blue-600">
                                        Quản Lý
                                    </Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="mx-2">/</span>
                                    <span className="text-gray-500">{nameProperty}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
                <div>
                    <h1 className="font-semibold text-xl text-black mb-4 text-transform: uppercase">Quản
                        lý {nameProperty}</h1>
                </div>
                <div className={'grid grid-cols-12 pb-4'}>
                    <div className={'col-span-6 grid grid-cols-3 gap-2'}>
                        <Input
                            className={'col-span-2'}
                            placeholder={'Tìm kiếm theo tên và mã'}
                            onChange={onChangeQuery}
                        ></Input>
                        <Select
                            placeholder="Trạng thái"
                            options={options}
                        />
                    </div>
                    <div className={'flex justify-end gap-2 col-span-6'}>
                        <div>
                            <Button icon={<FaFileDownload/>}>
                                Xuất excel
                            </Button>
                        </div>
                        <div>
                            <Button
                                className={'!bg-indigo-600 text-white'}
                                icon={<HiPlusCircle />}
                                onClick={onClickCreateAction}
                            >
                                Thêm mới
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <DataTable
                        columns={columns}
                        data={listProperty}
                        skeletonAvatarColumns={[0]}
                        skeletonAvatarProps={{ className: 'rounded-md' }}
                        pagingData={{
                            total: totalElements,
                            pageIndex: defaultPagination.pageIndex as number,
                            pageSize: defaultPagination.pageSize as number
                        }}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                        onSort={onSort}
                    />
                </div>
            </div>
            {/*// DIALOG*/}
            <div>
                <Dialog
                    isOpen={dialogIsOpen}
                    onClose={(el: MouseEvent<HTMLSpanElement>) => onDialogClose(el)}
                    onRequestClose={(el: MouseEvent<HTMLSpanElement>) => onDialogClose(el)}
                >
                    <h5 className="mb-4">Dialog Title</h5>

                    <Formik
                        initialValues={initValueForm}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="mb-4">
                                    <label className="text-black block mb-2">Mã</label>
                                    <Field
                                        disabled={selectedMode === 'VIEW'}
                                        name="code"
                                        as={Input}
                                        placeholder="Nhập mã"
                                    />
                                    <ErrorMessage
                                        name="code"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="text-black block mb-2">Tên</label>
                                    <Field
                                        disabled={selectedMode === 'VIEW'}
                                        name="name"
                                        as={Input}
                                        placeholder="Nhập tên"
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                                <div className="text-right mt-6">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        variant="plain"
                                        type={'button'}
                                        onClick={(el: MouseEvent<HTMLSpanElement>) => onDialogClose(el)}
                                    >
                                        Hủy
                                    </Button>
                                    <Button variant="solid" type="submit" disabled={isSubmitting}>
                                        Xác nhận
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>


                </Dialog>
            </div>
            {/*    COFIRM DIALOG*/}
            <Dialog
                isOpen={isOpenConfirmDialog}
                onClose={() => onDialogConfirmClose()}
                onRequestClose={() => onDialogConfirmClose()}
            >
                <h5 className="mb-4">Xóa</h5>
                <p>
                    Xác nhận xóa thuộc tính này
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={() => onDialogConfirmClose()}
                    >
                        Hủy
                    </Button>
                    <Button variant="solid" className={'bg-red-500'}
                            onClick={() => onDialogConfirmOk()}>
                        Xác nhận
                    </Button>
                </div>
            </Dialog>

        </Fragment>
    )
}


export default View