
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import instance from "@/axios/CustomAxios";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { useSaleContext } from "@/views/sale/SaleContext";
import { Color, Product, ProductDetailResponseDTO, Size } from "@/views/sale/index";
import { useToastContext } from "@/context/ToastContext";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductInfo from "../client/Cart/ProductInfo";


const ProductDetail = () => {
    const { id } = useParams();
    const { myCartId } = useSaleContext();
    const [product, setProduct] = useState<Product>();
    const [listProductDetail, setListProductDetail] = useState<ProductDetailResponseDTO[]>([]);
    const [listColorValid, setListColorValid] = useState<string[]>([]);
    const [listColor, setListColor] = useState<Color[]>([]);
    const [listSizeValid, setListSizeValid] = useState<string[]>([]);
    const [listSize, setListSize] = useState<Size[]>([]);
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [selectedProductDetail, setSelectedProductDetail] = useState<ProductDetailResponseDTO | null>(null);

    const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { openNotification } = useToastContext();
    const [quantity, setQuantity] = useState<number>(1)

    // Lấy dữ liệu ban đầu của sản phẩm và chi tiết sản phẩm
    useEffect(() => {
        if (id) {
            instance.get(`/productDetails/product-detail-of-product/${id}`).then(response => {
                if (response?.data) {
                    setListProductDetail(response.data);
                    setPriceRange(calculatePriceRange(response.data));
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
    // useEffect(() => {
    //     if (listProductDetail.length > 0) {
    //         // Lọc bỏ các `color` trùng dựa trên `color.code`
    //         const uniqueColors = listProductDetail.reduce((acc, item) => {
    //             if (!acc.some((color) => color.code === item.color.code)) {
    //                 acc.push(item.color);
    //             }
    //             return acc;
    //         }, [] as typeof listProductDetail[0]["color"][]);

    //         // Lọc bỏ các `size` trùng dựa trên `size.id`
    //         const uniqueSizes = listProductDetail.reduce((acc, item) => {
    //             if (!acc.some((size) => size.id === item.size.id)) {
    //                 acc.push(item.size);
    //             }
    //             return acc;
    //         }, [] as typeof listProductDetail[0]["size"][]);

    //         // Cập nhật state
    //         setListColor(uniqueColors);
    //         setListSize(uniqueSizes);
    //     }
    // }, [listProductDetail]);


    useEffect(() => {
        if (listProductDetail.length > 0) {
            // Lọc màu sắc và kích thước duy nhất
            const uniqueColors = listProductDetail.reduce((acc, item) => {
                if (!acc.some((color) => color.code === item.color.code)) {
                    acc.push(item.color);
                }
                return acc;
            }, [] as typeof listProductDetail[0]["color"][]);
    
            const uniqueSizes = listProductDetail.reduce((acc, item) => {
                if (!acc.some((size) => size.id === item.size.id)) {
                    acc.push(item.size);
                }
                return acc;
            }, [] as typeof listProductDetail[0]["size"][]);
    
            setListColor(uniqueColors);
            setListSize(uniqueSizes);
    
            // Chọn màu và kích thước mặc định nếu có
            if (uniqueColors.length > 0) {
                setSelectedColor(uniqueColors[0]);  // Chọn màu đầu tiên
            }
            if (uniqueSizes.length > 0) {
                setSelectedSize(uniqueSizes[0]);  // Chọn kích thước đầu tiên
            }
        }
    }, [listProductDetail]);
    
    useEffect(() => {
        // Cập nhật chi tiết sản phẩm khi màu và kích thước đã chọn
        if (selectedColor && selectedSize) {
            const productDetail = listProductDetail.find(
                (item) => item.color.id === selectedColor.id && item.size.id === selectedSize.id
            );
            setSelectedProductDetail(productDetail ?? null);
        }
    }, [selectedColor, selectedSize, listProductDetail]);

    // ảnh 
    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
    };

    const defaultImage = "https://product.hstatic.net/200000690725/product/fwcl002_54051885890_o_bfeab2ca9ca7439bb557e70b1ede9c20_master.jpg";
    // ảnh

    // Giá
    const calculatePriceRange = (details: ProductDetailResponseDTO[]) => {
        if (details.length === 0) return null;

        const prices = details.map(detail => detail.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // giá

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
                    <div className="mb-4">
                        <img
                            className="w-[400px] h-[500px] object-cover rounded-lg"
                            src={selectedProductDetail?.images?.[currentImageIndex]?.url || defaultImage}
                            alt="Product Image"
                        />
                    </div>

                    {selectedProductDetail?.images && selectedProductDetail.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {selectedProductDetail.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-24 h-24 object-cover rounded-md cursor-pointer ${currentImageIndex === index ? "border-2 border-black" : ""}`}
                                    onClick={() => handleImageClick(index)}
                                />
                            ))}
                        </div>
                    )}
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
                    <div className="py-1 text-xl">
                        <p>Giá: {
                            selectedProductDetail ? (
                                <span className="text-xl text-red-500">
                                    {formatPrice(selectedProductDetail.price)}
                                </span>
                            ) : priceRange ? (
                                <span className="text-xl text-red-500">
                                    {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                                </span>
                            ) : (
                                <span>Đang cập nhật</span>
                            )
                        }</p>
                    </div>
                    <div className={'py-2'}>
                        <div className={'font-semibold text-black pb-1'}>Màu sắc</div>
                        <div className="flex gap-3">
                            {listColor.map((item, index) => (
                                <button
                                    key={index}
                                    className={`p-1 text-[12px] min-w-20 rounded border hover:bg-gray-100 disabled:bg-gray-100 ${selectedColor?.id === item.id ? "border-black" : ""
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
                                    className={`p-1 text-[12px] min-w-20 rounded border hover:bg-gray-100 disabled:bg-gray-100 ${selectedSize?.id === item.id ? "border-black" : ""
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
                                (<button className="pe-2 text-xl"><HiPlusCircle /></button>)
                            }

                            <label>{quantity}</label>
                            {
                                (<button className="pl-2 text-xl"><HiMinusCircle /></button>)
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
                            className={'px-4 font-semibold bg-red-500 text-white py-2 border rounded border-red-500'}>
                            Mua ngay
                        </button>
                    </div>

                    <div>
                        <div className="mt-10 flex flex-wrap items-center justify-between space-x-2">
                            <div className="flex items-start space-x-1 w-1/4">
                                <img
                                    className="w-6 h-6 lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc1_img.png?v=550"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc1_img.png?v=550"
                                    alt="Miễn phí giao hàng cho đơn hàng từ 500K"
                                />
                                <div className="text-gray-800 text-sm flex-1">
                                    Miễn phí giao hàng cho đơn hàng từ 500K
                                </div>
                            </div>

                            <div className="flex items-start space-x-1 w-1/4">
                                <img
                                    className="w-6 h-6 lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc2_img.png?v=550"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc2_img.png?v=550"
                                    alt="Hàng phân phối chính hãng 100%"
                                />
                                <div className="text-gray-800 text-sm flex-1">
                                    Hàng phân phối chính hãng 100%
                                </div>
                            </div>

                            <div className="flex items-start space-x-1 w-1/4">
                                <img
                                    className="w-6 h-6 lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc3_img.png?v=550"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc3_img.png?v=550"
                                    alt="TỔNG ĐÀI 24/7 :  0964942121"
                                />
                                <div className="text-gray-800 text-sm flex-1">
                                    TỔNG ĐÀI 24/7 : 0964942121
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between space-x-2">
                            <div className="flex items-start space-x-1 w-1/4">
                                <img
                                    className="w-6 h-6 lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc1_img.png?v=550"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc1_img.png?v=550"
                                    alt="ĐỔI SẢN PHẨM DỄ DÀNG (Trong vòng 7 ngày khi còn nguyên tem mác)"
                                />
                                <div className="text-gray-800 text-sm flex-1">
                                    ĐỔI SẢN PHẨM DỄ DÀNG (Trong vòng 7 ngày khi còn nguyên tem mác)
                                </div>
                            </div>

                            <div className="flex items-start space-x-1 w-1/4">
                                <img
                                    className="w-6 h-6 lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc2_img.png?v=550"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc2_img.png?v=550"
                                    alt="Kiểm tra, thanh toán khi nhận hàng COD"
                                />
                                <div className="text-gray-800 text-sm flex-2 max-w-full">
                                    Kiểm tra, thanh toán khi nhận hàng COD
                                </div>
                            </div>

                            <div className="flex items-start space-x-1 w-1/4">
                                <img
                                    className="w-6 h-6 lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc3_img.png?v=550"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc3_img.png?v=550"
                                    alt="Hỗ trợ bảo hành, đổi sản phẩm tại tất cả store TORANO"
                                />
                                <div className="text-gray-800 text-sm flex-1 max-w-full">
                                    Hỗ trợ bảo hành, đổi sản phẩm tại tất cả store TORANO
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            <div className="flex items-center ">
                <ProductInfo />
            </div>
        </div>
    );
};

export default ProductDetail;
