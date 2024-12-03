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

    
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Tên đợt giảm giá là bắt buộc')
            .min(3, 'Tên phải có ít nhất 3 ký tự'),
        discountPercent: Yup.number()
            .required('Giá trị giảm là bắt buộc')
            .min(0, 'Giá trị giảm phải lớn hơn hoặc bằng 0')
            .max(100, 'Giá trị giảm không được vượt quá 100'),
        startDate: Yup.date()
            .required('Ngày bắt đầu là bắt buộc')
            .typeError('Ngày bắt đầu không hợp lệ'),
        endDate: Yup.date()
            .required('Ngày kết thúc là bắt buộc')
            .typeError('Ngày kết thúc không hợp lệ')
            .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
    });
    

    useEffect(() => {
        // lấy dữ liệu event theo id
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/event/detail/${id}`);
                setUpdateEvent(response.data);
                console.log('Dữ liệu tải lên: ', response.data)
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
            console.log("startDate ban đầu từ API:", initialStartDate);
            console.log("endDate ban đầu từ API:", initialEndDate);

            // Kiểm tra xem startDate và endDate có thay đổi hay không
            const isStartDateChanged = values.startDate !== initialStartDate;
            const isEndDateChanged = values.endDate !== initialEndDate;
            console.log("Is startDate changed:", isStartDateChanged);
            console.log("Is endDate changed:", isEndDateChanged);

            // Chuyển đổi giá trị ngày trong form với định dạng chính xác
            const startDate = isStartDateChanged
                ? dayjs(values.startDate, "DD-MM-YYYYTHH:mm", true)  // Sử dụng đúng định dạng với 'T'
                : dayjs(initialStartDate, "DD-MM-YYYYTHH:mm", true); // Sử dụng định dạng 'T' ở đây

            const endDate = isEndDateChanged
                ? dayjs(values.endDate, "DD-MM-YYYYTHH:mm", true)  // Sử dụng đúng định dạng với 'T'
                : dayjs(initialEndDate, "DD-MM-YYYYTHH:mm", true); // Sử dụng định dạng 'T' ở đây

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
                productDTOS: selectedProducts.map((id) => ({ id })), // Danh sách sản phẩm
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

    // Thay đổi handleSelectProduct để chỉ lưu ID
    const handleSelectProduct = (product: ProductDTO, isSelected: boolean) => {
        setSelectedProducts((prev) =>
            isSelected
                ? [...prev, product.id] // Chỉ lưu id
                : prev.filter((id) => id !== product.id) // Loại bỏ id nếu không được chọn
        );
    };


    // Kiểm tra sản phẩm đã được chọn chưa:
    const isSelected = (id: string) => selectedProducts.includes(id);

    const handlePreviousPage = () => {
        if (pageIndex > 1) {
            setPageIndex((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (pageIndex < Math.ceil(total / pageSize)) {
            setPageIndex((prev) => prev + 1);
        }
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
                                            {({ field, form }: any) => {
                                                // Kiểm tra và chuyển đổi ngày từ chuỗi với dayjs
                                                const parsedStartDate = field.value ? dayjs(field.value, "DD-MM-YYYYTHH:mm", true) : null;

                                                return (
                                                    <DateTimepicker
                                                        {...field}
                                                        value={parsedStartDate && parsedStartDate.isValid() ? parsedStartDate.toDate() : null}  // Chuyển đổi từ dayjs thành Date nếu hợp lệ
                                                        onChange={(date: Date | null) => {
                                                            const formattedDate = date ? dayjs(date).format("DD-MM-YYYYTHH:mm") : "";
                                                            form.setFieldValue("startDate", formattedDate); // Lưu giá trị định dạng lại
                                                        }}
                                                    />
                                                );
                                            }}
                                        </Field>
                                    </FormItem>

                                    <FormItem asterisk label="Ngày kết thúc" invalid={!!errors.endDate && touched.endDate} errorMessage={errors.endDate}>
                                        <Field name="endDate">
                                            {({ field, form }: any) => {
                                                // Kiểm tra và chuyển đổi ngày từ chuỗi với dayjs
                                                const parsedEndDate = field.value ? dayjs(field.value, "DD-MM-YYYYTHH:mm", true) : null;

                                                return (
                                                    <DateTimepicker
                                                        {...field}
                                                        value={parsedEndDate && parsedEndDate.isValid() ? parsedEndDate.toDate() : null}  // Chuyển đổi từ dayjs thành Date nếu hợp lệ
                                                        onChange={(date: Date | null) => {
                                                            const formattedDate = date ? dayjs(date).format("DD-MM-YYYYTHH:mm") : "";
                                                            form.setFieldValue("endDate", formattedDate); // Lưu giá trị định dạng lại
                                                        }}
                                                    />
                                                );
                                            }}
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
                                <h4 className="font-medium text-xl mb-4">Danh sách sản phẩm</h4>
                                <table className="table-auto w-full border border-collapse border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2">Chọn</th>
                                            <th className="border px-4 py-2">Mã sản phẩm</th>
                                            <th className="border px-4 py-2">Tên sản phẩm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {product.map((product) => (
                                            <tr key={product.id}>
                                                <td className="border px-4 py-2 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected(product.id)}
                                                        onChange={(e) =>
                                                            handleSelectProduct(product, e.target.checked)
                                                        }
                                                    />
                                                </td>
                                                <td className="border px-4 py-2">{product.code}</td>
                                                <td className="border px-4 py-2">{product.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex items-center justify-between mt-4">
                                    <Button
                                        type="button"
                                        disabled={pageIndex === 1}
                                        onClick={handlePreviousPage}
                                    >
                                        Trang trước
                                    </Button>
                                    <span>
                                        Trang {pageIndex} / {Math.ceil(total / pageSize)}
                                    </span>
                                    <Button
                                        type="button"
                                        disabled={pageIndex >= Math.ceil(total / pageSize)}
                                        onClick={handleNextPage}
                                    >
                                        Trang sau
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default UpdateEvent;
