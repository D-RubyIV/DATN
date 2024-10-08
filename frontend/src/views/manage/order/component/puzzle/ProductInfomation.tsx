import { ProductDetailOverviewPhah04 } from "../../store";

const ProductInfomation = ({ seletedProductDetail }: { seletedProductDetail: ProductDetailOverviewPhah04 }) => {
    return (
        <div className="grid grid-cols-2">
            <div>
                <div className="font-semibold text-xl py-2">
                    <div>
                        <span>Tên: </span>
                        <span className='text-black'>
                            {seletedProductDetail?.name}
                        </span>
                    </div>
                </div>
                <div className='flex gap-5'>
                    <div>
                        <img className='rounded-md object-cover h-[260px] w-[200px]' src='https://www.bunyanbug.com/images/gone-fishing/fly%20fishing-1.png' alt='' />
                    </div>
                    <div className='text-[16px] py-2 inline-flex flex-col justify-between'>
                        <li>
                            <span>Mã: </span>
                            <span className='font-semibold'>{seletedProductDetail?.code}</span>
                        </li>
                        <li>
                            <span>Kích thước: </span>
                            <span className='font-semibold'>{seletedProductDetail?.sizeName}</span>
                        </li>
                        <li>
                            <span>Màu sắc: </span>
                            <span className='font-semibold'>{seletedProductDetail?.colorName}</span>
                        </li>
                        <li>
                            <span>Sản phẩm: </span>
                            <span className='font-semibold'>{seletedProductDetail?.productName}</span>
                        </li>
                        <li>
                            <span>Họa tiết: </span>
                            <span className='font-semibold'>{seletedProductDetail?.textureName}</span>
                        </li>
                        <li>
                            <span>Xuất xứ: </span>
                            <span className='font-semibold'>{seletedProductDetail?.originName}</span>
                        </li>
                        <li>
                            <span>Thương hiệu: </span>
                            <span className='font-semibold'>{seletedProductDetail?.brandName}</span>
                        </li>
                        <li>
                            <span>Cổ áo: </span>
                            <span className='font-semibold'>{seletedProductDetail?.collarName}</span>
                        </li>
                        <li>
                            <span>Tay áo: </span>
                            <span className='font-semibold'>{seletedProductDetail?.sleeveName}</span>
                        </li>
                        <li>
                            <span>Chất liệu: </span>
                            <span className='font-semibold'>{seletedProductDetail?.materialName}</span>
                        </li>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-2 mt-10'>
                <li>
                    <span>Giá: </span>
                    <span className='font-semibold text-black'>
                        {seletedProductDetail?.price.toLocaleString('vi') + "₫"}
                    </span>
                </li>
                <li>
                    <span>Kho: </span>
                    <span className='font-semibold text-black'>
                        {seletedProductDetail?.quantity}
                    </span>
                </li>
            </div>
        </div>
    );
}

export default ProductInfomation;