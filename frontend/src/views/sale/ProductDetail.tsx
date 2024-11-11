import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import instance from "@/axios/CustomAxios";
import {HiMinusCircle, HiPlusCircle} from "react-icons/hi";
import {useSaleContext} from "@/views/sale/SaleContext";
import {Color, Product, ProductDetailResponseDTO, Size} from "@/views/sale/index";
import {useToastContext} from "@/context/ToastContext";


const ProductDetail = () => {
    const {id} = useParams();
    const {myCartId} = useSaleContext();
    const [product, setProduct] = useState<Product>();
    const [listProductDetail, setListProductDetail] = useState<ProductDetailResponseDTO[]>([]);
    const [listColorValid, setListColorValid] = useState<string[]>([]);
    const [listColor, setListColor] = useState<Color[]>([]);
    const [listSizeValid, setListSizeValid] = useState<string[]>([]);
    const [listSize, setListSize] = useState<Size[]>([]);
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [selectedProductDetail, setSelectedProductDetail] = useState<ProductDetailResponseDTO | null>(null);

    const {openNotification} = useToastContext();
    const [quantity, setQuantity] = useState<number>(1)

    // Lấy dữ liệu ban đầu của sản phẩm và chi tiết sản phẩm
    useEffect(() => {
        if (id) {
            instance.get(`/productDetails/product-detail-of-product/${id}`).then(response => {
                if (response?.data) {
                    setListProductDetail(response.data);
                }
            });

            instance.get(`/product/${id}`).then(response => {
                if (response?.data) {
                    setProduct(response.data);
                }
            });
        }
    }, [id]);
    useEffect(() => {
    }, [listProductDetail]);

    // Cập nhật danh sách màu và kích thước từ dữ liệu chi tiết sản phẩm
    useEffect(() => {
        if (listProductDetail.length > 0) {
            // Lọc bỏ các `color` trùng dựa trên `color.code`
            const uniqueColors = listProductDetail.reduce((acc, item) => {
                if (!acc.some((color) => color.code === item.color.code)) {
                    acc.push(item.color);
                }
                return acc;
            }, [] as typeof listProductDetail[0]["color"][]);

            // Lọc bỏ các `size` trùng dựa trên `size.id`
            const uniqueSizes = listProductDetail.reduce((acc, item) => {
                if (!acc.some((size) => size.id === item.size.id)) {
                    acc.push(item.size);
                }
                return acc;
            }, [] as typeof listProductDetail[0]["size"][]);

            // Cập nhật state
            setListColor(uniqueColors);
            setListSize(uniqueSizes);
        }
    }, [listProductDetail]);


    // Hàm xử lý khi chọn màu
    const handleColorSelect = (color: Color) => {
        setSelectedColor(color);
        setSelectedSize(null); // Reset size khi chọn màu mới

        // Lọc lại danh sách kích thước dựa trên màu đã chọn
        const filteredSizes = listProductDetail
            .filter((item) => item.color.id === color.id)
            .map((item) => item.size.code);
        setListSizeValid([...new Set(filteredSizes)]);
    };

    // Hàm xử lý khi chọn kích thước
    const handleSizeSelect = (size: Size) => {
        setSelectedSize(size);

        // Lọc lại danh sách màu sắc dựa trên kích thước đã chọn
        if (selectedColor) {
            const productDetail = listProductDetail.find(
                (item) => item.color.id === selectedColor.id && item.size.id === size.id
            );
            setSelectedProductDetail(productDetail ?? null);
            console.log(productDetail)
        } else {
            const filteredColors = listProductDetail
                .filter((item) => item.size.id === size.id)
                .map((item) => item.color.code);
            setListColorValid([...new Set(filteredColors)]);
        }
    };

    // Lấy thông tin chi tiết sản phẩm dựa trên màu và kích thước đã chọn
    useEffect(() => {
        if (selectedColor && selectedSize) {
            const productDetail = listProductDetail.find(
                (item) => item.color.id === selectedColor.id && item.size.id === selectedSize.id
            );
            setSelectedProductDetail(productDetail ?? null);
        }
    }, [selectedColor, selectedSize, listProductDetail]);

    const handleAddToCart = () => {
        const dataRequest = {
            "cartId": myCartId,
            "productDetailId": selectedProductDetail?.id,
            "quantity": quantity
        }
        instance.post("/cart-details/create", dataRequest).then(function (response) {
            console.log(response);
            if (response.status === 200) {
                openNotification("Thêm vào giỏ hàng thành công")
            }
        })
    }

    return (
        <div>
            <div className="flex justify-center gap-10 2xl:p-20">
                <div className="col-span-6">
                    <img
                        width={400}
                        src={
                            selectedProductDetail?.images?.[0]?.url ||
                            "https://product.hstatic.net/200000690725/product/fwcl002_54051885890_o_bfeab2ca9ca7439bb557e70b1ede9c20_master.jpg"
                        }
                        alt="Product Image"
                    />
                </div>
                <div className="col-span-6">
                    <div>
                        <p className="font-semibold text-xl text-black">Áo {product?.name}</p>
                    </div>
                    <div className={'flex flex-col'}>
                        <p>Mã sản phẩm <span
                            className={'text-black'}>{(selectedProductDetail as ProductDetailResponseDTO)?.code}</span>
                        </p>
                        <div className={'flex gap-2'}>
                            <p>Thương hiệu: <span
                                className={'text-black'}>{(selectedProductDetail as ProductDetailResponseDTO)?.brand?.name}</span>
                            </p>
                            <p>Tình trạng: <span
                                className={'text-black'}>{(selectedProductDetail as ProductDetailResponseDTO)?.quantity > 0 ? "Còn hàng" : "Hết hàng"}</span>
                            </p>
                        </div>
                        <p>Chất liệu <span
                            className={'text-black'}>{(selectedProductDetail as ProductDetailResponseDTO)?.material?.name}</span>
                        </p>
                    </div>
                    <div className={'py-1 text-xl'}>
                        <p>Giá: <span
                            className={'text-xl text-red-500'}>{(selectedProductDetail as ProductDetailResponseDTO)?.price ?? "Đang cập nhật"}</span>
                        </p>
                    </div>
                    <div className={'py-2'}>
                        <div className={'font-semibold text-black pb-1'}>Màu sắc</div>
                        <div className="flex gap-3">
                            {listColor.map((item, index) => (
                                <button
                                    key={index}
                                    className={`p-1 text-[12px] min-w-20 rounded border hover:bg-gray-100 disabled:bg-gray-100 ${
                                        selectedColor?.id === item.id ? "border-black" : ""
                                    }`}
                                    disabled={!listColorValid.includes(item.code) && listColorValid.length > 0}
                                    onClick={() => handleColorSelect(item)}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={'py-2'}>
                        <div className={'font-semibold text-black pb-1'}>Size</div>
                        <div className="flex gap-3">
                            {listSize.map((item, index) => (
                                <button
                                    key={index}
                                    className={`p-1 text-[12px] min-w-20 rounded border hover:bg-gray-100 disabled:bg-gray-100 ${
                                        selectedSize?.id === item.id ? "border-black" : ""
                                    }`}
                                    disabled={!listSizeValid.includes(item.code) && listSizeValid.length > 0}
                                    onClick={() => handleSizeSelect(item)}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={'py-2'}>
                        <div className={'font-semibold text-black pb-1'}>Số lượng</div>
                        <div className="flex gap-1 items-center justify-start">
                            {
                                (<button className="pe-2 text-xl"><HiPlusCircle/></button>)
                            }

                            <label>{quantity}</label>
                            {
                                (<button className="pl-2 text-xl"><HiMinusCircle/></button>)
                            }
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className={'px-4 font-semibold text-red-500 py-2 border rounded border-red-500'}
                            onClick={() => handleAddToCart()}>
                            Thêm vào giỏ hàng
                        </button>
                        <button
                            className={'px-4 font-semibold bg-red-500 text-white py-2 border rounded border-red-500'}>Mua
                            ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
