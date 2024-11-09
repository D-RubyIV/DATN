import { FormContainer, FormItem, Input } from "@/components/ui";
import DateTimepicker from "@/components/ui/DatePicker/DateTimepicker";
import Button from '@/components/ui/Button';
import axios from "axios";
import dayjs from "dayjs";
import { Field, Formik, Form, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { Table as AntTable } from 'antd';

type EventDTO = {
    id: string;
    discountCode: string;
    name: string;
    discountPercent: number;
    startDate: string;
    endDate: string;
    quantityDiscount: number;
    status: string;
    productDTOS: ProductDTO[];
}

type ProductDTO = {
    id: string;
    code: string;
    name: string;
}

const AddEvent = () => {
    const initialProductDTOState: ProductDTO = {
        id: '',
        code: '',
        name: '',
    }

    const initialEventState: EventDTO = {
        id: '',
        discountCode: '',
        name: '',
        discountPercent: 0,
        startDate: '',
        endDate: '',
        quantityDiscount: 0,
        status: '',
        productDTOS: [initialProductDTOState],
    }

    const navigate = useNavigate();
    const [newEvent, setNewEvent] = useState<EventDTO>(initialEventState);
    const [product, setProduct] = useState<ProductDTO[]>([]); // Ensure product is an array
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    // Validation schema
    const validationSchema = Yup.object({});

    useEffect(() => {
        fetchProductDTO(pageIndex, pageSize);
    }, [pageIndex, pageSize]);

    // api Product
    const fetchProductDTO = async (pageIndex: number, pageSize: number) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/event/product-list`, {
                params: {
                    page: pageIndex,
                    size: pageSize
                }
            });
            // Ensure product is an array
            if (Array.isArray(response.data.content)) {
                setProduct(response.data.content);
                setTotal(response.data.totalElements);
            } else {
                setProduct([]); // Set empty array if not an array
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // API saveEvent
    const handleSubmit = async (values: EventDTO, { resetForm, setSubmitting }: FormikHelpers<EventDTO>) => {
        try {

            const productIds = selectedProducts;

            // Kiểm tra xem startDate và endDate có hợp lệ không
            const startDate = dayjs(values.startDate, "DD-MM-YYYY'T'HH:mm", true);
            const endDate = dayjs(values.endDate, "DD-MM-YYYY'T'HH:mm", true);

            if (!startDate.isValid() || !endDate.isValid()) {
                toast.error("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ");
                setSubmitting(false);
                return;
            }

            // Chuyển đổi startDate và endDate thành chuỗi đúng định dạng
            const formattedStartDate = startDate.format("DD-MM-YYYYTHH:mm");
            const formattedEndDate = endDate.format("DD-MM-YYYYTHH:mm");


            // Tạo payload gửi lên backend
            const formattedPayload = {
                name: values.name,
                discountPercent: values.discountPercent,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                productDTOS: productIds.map(id => ({ id })), // Chỉ gửi ID của các sản phẩm được chọn
            };

            console.log("Dữ liệu đã format: ", formattedPayload); // Log lại dữ liệu sau khi format

            // Gửi yêu cầu POST với payload đã format
            const response = await axios.post('http://localhost:8080/api/v1/event/save', formattedPayload);

            if (response.status === 200) {
                toast.success('Lưu thành công');
                resetForm();
                navigate('/admin/manage/event');
            }
        } catch (error) {
            console.error("Lỗi khi lưu sự kiện:", error);  // Log toàn bộ lỗi

            // Nếu có thông tin lỗi từ backend (ví dụ response từ server), in thêm chi tiết
            if (error.response) {
                console.error("Lỗi từ server:", error.response);
                console.error("Lỗi từ server:", error.response.data);
                toast.error(`Lỗi khi lưu sự kiện: ${error.response.data.error || error.response.data.message || error.response.data}`);
            } else {
                toast.error('Lỗi khi kết nối với server');
            }
        } finally {
            setSubmitting(false); // Kết thúc trạng thái submitting
        }
    };


    // Handle product selection
    const handleProductSelect = (selectedRowKeys: string[]) => {
        setSelectedProducts(selectedRowKeys);
    };

    // Handle product table row selection
    const rowSelection = {
        selectedRowKeys: selectedProducts,
        onChange: handleProductSelect,
        getCheckboxProps: (record: ProductDTO) => ({
            disabled: false, // Example: you can disable rows based on a condition
        }),
    };

    return (
        <Formik
            initialValues={initialEventState}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
        >
            {({ touched, errors, resetForm, isSubmitting }) => (
                <Form>
                    <div className='w-full bg-white p-6 shadow-md rounded-lg'>
                        <h1 className="text-center font-semibold text-2xl mb-4 uppercase">Thêm đợt giảm giá</h1>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="w-full lg:w-1/3 bg-white p-6 shadow-md rounded-lg">
                                <h4 className="font-medium text-xl mb-4">Thông tin đợt giảm giá</h4>
                                <FormContainer>
                                    <FormItem
                                        asterisk
                                        label="Tên đợt giảm giá"
                                        invalid={errors.name && touched.name}
                                        errorMessage={errors.name}
                                    >
                                        <Field type="text" autoComplete="on" name="name" style={{ height: '44px' }}
                                            placeholder="Tên khách hàng..." component={Input} />
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Giá trị giảm(%)"
                                        invalid={errors.discountPercent && touched.discountPercent}
                                        errorMessage={errors.discountPercent}
                                    >
                                        <Field type="number" autoComplete="off" name="discountPercent" style={{ height: '44px' }}
                                            placeholder="Giá trị giảm(%)..." component={Input} />
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Ngày bắt đầu"
                                        invalid={errors.startDate && touched.startDate}
                                        errorMessage={errors.startDate}
                                    >
                                        <Field name="startDate">
                                            {({ field, form }: any) => (
                                                <DateTimepicker
                                                    {...field}
                                                    value={field.value ? dayjs(field.value, "DD-MM-YYYY'T'HH:mm").toDate() : null}
                                                    onChange={(date: Date | null) => {
                                                        const formattedDate = date ? dayjs(date).format("DD-MM-YYYY'T'HH:mm") : "";
                                                        form.setFieldValue("startDate", formattedDate);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Ngày kết thúc"
                                        invalid={errors.endDate && touched.endDate}
                                        errorMessage={errors.endDate}
                                    >
                                        <Field name="endDate">
                                            {({ field, form }: any) => (
                                                <DateTimepicker
                                                    {...field}
                                                    value={field.value ? dayjs(field.value, "DD-MM-YYYY'T'HH:mm").toDate() : null}
                                                    onChange={(date: Date | null) => {
                                                        const formattedDate = date ? dayjs(date).format("DD-MM-YYYY'T'HH:mm") : "";
                                                        form.setFieldValue("endDate", formattedDate);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>


                                    <FormItem>
                                        <Button className="ltr:mr-2 rtl:ml-2"
                                            type="submit"
                                            style={{ backgroundColor: '#fff', height: '40px' }}
                                            disabled={isSubmitting} onClick={() => resetForm()}>
                                            Tải lại
                                        </Button>
                                        <Button variant="solid"
                                            type="submit"
                                            style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }}
                                            disabled={isSubmitting}>
                                            Thêm mới
                                        </Button>
                                    </FormItem>
                                </FormContainer>
                            </div>

                            {/* Product List Table */}
                            <div className="w-full lg:w-2/3 bg-white p-6 shadow-md rounded-lg">
                                <h4 className="font-medium text-xl">Danh sách sản phẩm</h4>
                                <AntTable
                                    rowSelection={rowSelection}
                                    columns={[
                                        { title: "Mã sản phẩm", dataIndex: "code", key: "code" },
                                        { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
                                    ]}
                                    dataSource={product}
                                    rowKey="id"
                                    pagination={{ total, pageSize, current: pageIndex, onChange: (page) => setPageIndex(page) }}
                                />
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddEvent;
