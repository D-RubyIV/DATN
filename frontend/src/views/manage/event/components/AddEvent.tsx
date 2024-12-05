import { FormContainer, FormItem, Input } from "@/components/ui";
import DateTimepicker from "@/components/ui/DatePicker/DateTimepicker";
import Button from '@/components/ui/Button';
import dayjs from "dayjs";
import { Field, Formik, Form, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from 'yup';
import instance from "@/axios/CustomAxios";

type EventDTO = {
    id: string;
    discountCode: string;
    name: string;
    discountPercent: number;
    startDate: string | null;
    endDate: string | null;
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
        startDate: null,
        endDate: null,
        quantityDiscount: 0,
        status: '',
        productDTOS: [initialProductDTOState],
    }

    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductDTO[]>([]); // Ensure product is an array
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
        // VALIDATE NGAY SAU NHO HON NGAY TRUOC QUAN TITY
    });

    useEffect(() => {
        fetchProductDTO(pageIndex, pageSize);
    }, [pageIndex, pageSize]);

    // api Product
    const fetchProductDTO = async (pageIndex: number, pageSize: number) => {
        try {
            const response = await instance.get(`/event/product-list`, {
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

    const handleSubmit = async (values: EventDTO, { resetForm, setSubmitting }: FormikHelpers<EventDTO>) => {
        try {
            const productIds = selectedProducts;

            // Log giá trị startDate và endDate trước khi chuyển đổi
            console.log('Ngày bắt đầu (trước khi chuyển đổi):', values.startDate);
            console.log('Ngày kết thúc (trước khi chuyển đổi):', values.endDate);

            // const startDate = dayjs(values.startDate, "DD-MM-YYYY HH:mm", true);
            // const endDate = dayjs(values.endDate, "DD-MM-YYYY HH:mm", true);

            // if (!startDate.isValid() || !endDate.isValid()) {
            //     toast.error("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ");
            //     setSubmitting(false);
            //     return;
            // }

            // // Chuyển đổi startDate và endDate thành chuỗi đúng định dạng
            // const formattedStartDate = dayjs(startDate).format("DD-MM-YYYYTHH:mm");
            // const formattedEndDate = dayjs(endDate).format("DD-MM-YYYYTHH:mm");

            // console.log('Ngày bắt đầu (sau khi chuyển đổi):', formattedStartDate); // Log ngày bắt đầu sau khi chuyển đổi
            // console.log('Ngày kết thúc (sau khi chuyển đổi):', formattedEndDate); // Log ngày kết thúc sau khi chuyển đổi

            // Tạo payload gửi lên backend
             

            const formattedPayload = {
                name: values.name,
                discountPercent: values.discountPercent,
                startDate: values.startDate,
                endDate: values.endDate,
                productDTOS: productIds.map((id) => ({ id })), // Chỉ gửi ID của các sản phẩm được chọn
            };

            // **Log trước khi gửi dữ liệu lên backend**
            console.log("Dữ liệu đang gửi lên backend: ", formattedPayload);

            // Gửi yêu cầu POST với payload đã format
            const response = await instance.post('/event/save', formattedPayload);

            if (response.status === 200) {
                toast.success('Lưu thành công');
                resetForm();
                navigate('/admin/manage/event');
            }
        } catch (error) {
            console.error("Lỗi khi lưu sự kiện:", error);  // Log toàn bộ lỗi

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
            initialValues={initialEventState}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, resetForm, isSubmitting, values, errors, touched }) => (
                <Form>
                    <div className='w-full bg-white p-6 shadow-md rounded-lg'>
                        <h1 className="text-center font-semibold text-2xl mb-4 uppercase">Thêm đợt giảm giá</h1>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="w-full lg:w-1/3 bg-white p-6 shadow-md rounded-lg">
                                <h4 className="font-medium text-xl mb-4">Thông tin đợt giảm giá</h4>
                                <FormContainer>
                                    <FormItem
                                        asterisk label="Tên đợt giảm giá" invalid={!!errors.name && touched.name} errorMessage={errors.name}
                                    >
                                        <Field type="text" autoComplete="on" name="name" style={{ height: '44px' }}
                                            placeholder="Tên đợt giảm giá..." component={Input} />
                                    </FormItem>

                                    <FormItem
                                        asterisk label="Giá trị giảm(%)" invalid={!!errors.discountPercent && touched.discountPercent} errorMessage={errors.discountPercent}
                                    >
                                        <Field type="number" autoComplete="off" name="discountPercent" style={{ height: '44px' }}
                                            placeholder="Giá trị giảm(%)..." component={Input} />
                                    </FormItem>


                                    <FormItem
                                        asterisk
                                        label="Ngày bắt đầu"
                                        invalid={!!errors.startDate && touched.startDate}
                                        errorMessage={errors.startDate}
                                    >
                                        <Field name="startDate">
                                            {({ field, form }: any) => {
                                                return (
                                                    <DateTimepicker onChange={(el) => {
                                                        console.log(el)
                                                        const date = dayjs(el)
                                                        const formattedDate = date.format('DD-MM-YYYYTHH:mm');
                                                        console.log(formattedDate)
                                                        setFieldValue("startDate", formattedDate);
                                                    }} />
                
                                                );
                                            }}
                                        </Field>
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Ngày kết thúc"
                                        invalid={!!errors.endDate && touched.endDate}
                                        errorMessage={errors.endDate}
                                    >
                                        <Field name="endDate">
                                            {({ field, form }: any) => {
                                                return (
                                                    <DateTimepicker onChange={(el) => {
                                                        console.log(el)
                                                        const date = dayjs(el)
                                                        const formattedDate = date.format('DD-MM-YYYYTHH:mm');
                                                        console.log(formattedDate)
                                                        setFieldValue("endDate", formattedDate);

                                                    }} />
                                                );
                                            }}
                                        </Field>
                                    </FormItem>
                           

                      

{/* 
                                    <FormItem
                                        asterisk
                                        label="Ngày kết thúc"
                                        invalid={!!errors.endDate && touched.endDate}
                                        errorMessage={errors.endDate}
                                    >
                                        <Field name="endDate">
                                            {({ field, form }: any) => {
                                                const formattedValue = field.value
                                                    ? dayjs(field.value, "DD-MM-YYYY HH:mm").isValid()
                                                        ? dayjs(field.value, "DD-MM-YYYY HH:mm").toDate()
                                                        : null
                                                    : null;

                                                return (
                                                    <DateTimepicker
                                                        {...field}
                                                        value={formattedValue}
                                                        onChange={(date: Date | null) => {
                                                            const formattedDate = date ? dayjs(date).format("DD-MM-YYYY HH:mm") : "";
                                                            form.setFieldValue("endDate", formattedDate);
                                                        }}
                                                    />
                                                );
                                            }}
                                        </Field>
                                    </FormItem> */}





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

export default AddEvent;
