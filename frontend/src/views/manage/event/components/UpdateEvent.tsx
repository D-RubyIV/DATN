import { FormContainer, FormItem, Input } from "@/components/ui";
import DateTimepicker from "@/components/ui/DatePicker/DateTimepicker";
import Button from '@/components/ui/Button';
import axios from "axios";
import dayjs from "dayjs";
import { Field, Formik, Form, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const UpdateEvent = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [updateEvent, setUpdateEvent] = useState<EventDTO | null>(null);
    const [product, setProduct] = useState<ProductDTO[]>([]);
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    // Validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Tên đợt giảm giá là bắt buộc'),
        discountPercent: Yup.number().required('Giá trị giảm là bắt buộc').min(0).max(100),
        startDate: Yup.string().required('Ngày bắt đầu là bắt buộc'),
        endDate: Yup.string().required('Ngày kết thúc là bắt buộc'),
    });

    useEffect(() => {
        // lấy dữ liệu event theo id
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/event/detail/${id}`);
                setUpdateEvent(response.data);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        fetchEventDetails();
        fetchProductDTO(pageIndex, pageSize);
    }, [id, pageIndex, pageSize]);

    useEffect(() => {
        if (updateEvent) {
            setSelectedProducts(updateEvent.productDTOS.map((product: ProductDTO) => product.id));
        }
    }, [updateEvent]);

    // Lấy danh sách sản phẩm
    const fetchProductDTO = async (pageIndex: number, pageSize: number) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/event/product-list`, {
                params: { page: pageIndex, size: pageSize }
            });
            setProduct(response.data.content || []);
            setTotal(response.data.totalElements);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // api updateEvent
    const handleSubmit = async (values: EventDTO, { resetForm, setSubmitting }: FormikHelpers<EventDTO>) => {
        try {
            console.log("Received form values:", values);

            // Lấy giá trị startDate và endDate ban đầu từ API
            const initialStartDate = updateEvent?.startDate || "";
            const initialEndDate = updateEvent?.endDate || "";
            console.log("Initial startDate from API:", initialStartDate);
            console.log("Initial endDate from API:", initialEndDate);

            // Kiểm tra xem startDate và endDate có thay đổi hay không
            const isStartDateChanged = values.startDate !== initialStartDate;
            const isEndDateChanged = values.endDate !== initialEndDate;
            console.log("Is startDate changed:", isStartDateChanged);
            console.log("Is endDate changed:", isEndDateChanged);

            // Chuyển đổi giá trị ngày trong form
            const startDate = isStartDateChanged
                ? dayjs(values.startDate, "DD-MM-YYYY'T'HH:mm", true)
                : dayjs(initialStartDate, "DD-MM-YYYYTHH:mm", true);
            const endDate = isEndDateChanged
                ? dayjs(values.endDate, "DD-MM-YYYY'T'HH:mm", true)
                : dayjs(initialEndDate, "DD-MM-YYYYTHH:mm", true);

            console.log("Parsed startDate:", startDate.toString());
            console.log("Parsed endDate:", endDate.toString());

            // Kiểm tra tính hợp lệ của ngày nếu chúng thay đổi
            if ((isStartDateChanged && !startDate.isValid()) || (isEndDateChanged && !endDate.isValid())) {
                console.error("Invalid date detected. Start or end date is not valid.");
                toast.error("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ");
                setSubmitting(false);
                return;
            }

            // Chuẩn bị payload với giá trị ngày chính xác
            const formattedPayload = {
                ...values,
                startDate: startDate.format("DD-MM-YYYYTHH:mm"), // Sử dụng giá trị mới hoặc cũ
                endDate: endDate.format("DD-MM-YYYYTHH:mm"), // Sử dụng giá trị mới hoặc cũ
                productDTOS: selectedProducts.map((id) => ({ id })),
            };

            console.log("Formatted payload:", formattedPayload);

            // Gửi yêu cầu PUT để cập nhật sự kiện
            const response = await axios.put(`http://localhost:8080/api/v1/event/update/${id}`, formattedPayload);

            if (response.status === 200) {
                console.log("Update response:", response);
                toast.success("Cập nhật thành công");
                resetForm();
                navigate("/admin/manage/event");
            }
        } catch (error) {
            console.error("Error while updating the event:", error);
            toast.error("Cập nhật sự kiện thất bại");
        } finally {
            setSubmitting(false);
        }
    };


    const handleProductSelect = (selectedRowKeys: string[]) => {
        setSelectedProducts(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys: selectedProducts,
        onChange: handleProductSelect,
    };

    return (
        <Formik
            initialValues={updateEvent || {
                id: '',
                discountCode: '',
                name: '',
                discountPercent: 0,
                startDate: '',
                endDate: '',
                quantityDiscount: 0,
                status: '',
                productDTOS: []
            }}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
        >
            {({ touched, errors, isSubmitting }) => (
                <Form>
                    <div className='w-full bg-white p-6 shadow-md rounded-lg'>
                        <h1 className="text-center font-semibold text-2xl mb-4 uppercase">Cập nhật đợt giảm giá</h1>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="w-full lg:w-1/3 bg-white p-6 shadow-md rounded-lg">
                                <FormContainer>
                                    <FormItem asterisk label="Tên đợt giảm giá" invalid={!!errors.name && touched.name} errorMessage={errors.name}>
                                        <Field type="text" name="name" placeholder="Tên đợt giảm giá..." component={Input} />
                                    </FormItem>
                                    <FormItem asterisk label="Giá trị giảm(%)" invalid={!!errors.discountPercent && touched.discountPercent} errorMessage={errors.discountPercent}>
                                        <Field type="number" name="discountPercent" placeholder="Giá trị giảm(%)..." component={Input} />
                                    </FormItem>
                                    <FormItem asterisk label="Ngày bắt đầu" invalid={!!errors.startDate && touched.startDate} errorMessage={errors.startDate}>
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
                                    <FormItem asterisk label="Ngày kết thúc" invalid={!!errors.endDate && touched.endDate} errorMessage={errors.endDate}>
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
                                        <Button variant="solid" type="submit" style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }} disabled={isSubmitting}>
                                            Cập nhật
                                        </Button>
                                    </FormItem>
                                </FormContainer>
                            </div>
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

export default UpdateEvent;