import {Fragment, useEffect, useState} from "react";
import instance from "@/axios/CustomAxios";
import {Button} from "@/components/ui";
import {Link, useNavigate} from "react-router-dom";


type Product = {
    productId: number;
    productCode: string;
    productName: string;
    countColor: number;
    countSize: number;
    originPrice: number;
    discountPrice: number;
    discountPercent: number;
    discountAmount: number;
    image: string[];
    mass: number;
};
type CommonObject = {
    name: string,
    code: string
}
type Param = {
    sizeCodes: string[],
    colorCodes: string[]
}
const ProductList = () => {

    const [listProduct, setListProduct] = useState<Product[]>([])
    const [listColor, setSetListColor] = useState<CommonObject[]>([])
    const [listSize, setSetListSize] = useState<CommonObject[]>([])
    const [listSizeSelected, setListSizeSelected] = useState<CommonObject[]>([])
    const [listColorSelected, setListColorSelected] = useState<CommonObject[]>([])

    const [param, setParam] = useState<Param>({
        sizeCodes: [],
        colorCodes: []
    })

    const initDataProduct = async () => {
        const response = await instance.get(`/productDetails/abc?colorCodes=${param.colorCodes}&sizeCodes=${param.sizeCodes}`);

        setListProduct(response?.data?.content)
    }
    const initListColor = async () => {
        const response = await instance.get("/color/color-list")
        if (response.data.data && Array.isArray(response.data.data)) {
            setSetListColor(response.data.data)
        }

    }
    const initListSize = async () => {
        const response = await instance.get("/size/size-list")
        if (response.data.data && Array.isArray(response.data.data)) {
            setSetListSize(response.data.data)
        }
    }
    useEffect(() => {
        initDataProduct()
        initListColor();
        initListSize();
    }, [param]);

    const handleSelectColor = (color: CommonObject) => {
        console.log(color)
        if (!listColorSelected.find(s => s.code === color.code)) {
            // Nếu màu chưa được chọn, thêm vào danh sách
            setListColorSelected((prev) => [...prev, color]);
        } else {
            // Nếu màu đã được chọn, loại bỏ khỏi danh sách
            setListColorSelected(listColorSelected.filter(s => s.code !== color.code));
        }
    }
    const handleSelectSize = (size: CommonObject) => {
        console.log(size)
        if(!listSizeSelected.find(s => s.code === size.code)){
            setListSizeSelected((prev) => [...prev, size]);
        }else{
            setListSizeSelected(listSizeSelected.filter( s => s.code !== size.code))
        }

    }
    useEffect(() => {
        setParam((prevParam) => ({
            ...prevParam,
            colorCodes: listColorSelected.map(item => item.code)
        }));
        setParam((prevParam) => ({
            ...prevParam,
            sizeCodes: listSizeSelected.map(item => item.code)
        }));
        console.log(listSizeSelected)
        console.log(listColorSelected)
    }, [listSizeSelected, listColorSelected]);

    return (
        <Fragment>
            <div className={'grid grid-cols-12 2xl:px-32 md:px-8 py-16 gap-10'}>
                <div className={'col-span-3'}>
                    <div className={'py-5'}>
                        <h3>Bộ lọc</h3>
                    </div>
                    <div className={'pb-4'}>
                        <div className={'text-gray-800 py-2 font-semibold text-[16px]'}>
                            <p>Màu sắc</p>
                        </div>
                        <div className={'grid 2xl:grid-cols-6 md:grid-cols-4 xl:grid-cols-5 gap-3'}>
                            {
                                listColor.map((item, index) => (
                                    <button key={index}
                                            className={`hover:bg-gray-200 p-2 aspect-square w-[50px] text-center rounded border  ${listColorSelected.find(s => s.code === item.code) ? "border-black border" : "border-gray-300"}`}
                                            onClick={() => handleSelectColor(item)}>
                                        <p>{item.name}</p>
                                    </button>
                                ))
                            }
                        </div>
                    </div>

                    <div className={'py-4'}>
                        <div className={'text-gray-800 py-2 font-semibold text-[16px]'}>
                            <p>Size</p>
                        </div>
                        <div className={'grid 2xl:grid-cols-6 md:grid-cols-4 xl:grid-cols-5 gap-3'}>
                            {
                                listSize.map((item, index) => (
                                    <div key={index} className={'py-2'}>
                                        <button key={index}
                                                className={`hover:bg-gray-200 p-2 aspect-square w-[50px] text-center rounded border ${listSizeSelected.find(s => s.code === item.code) ? "border-black border" : "border-gray-300"}`}
                                                onClick={() => handleSelectSize(item)}>
                                            <p>{item.name}</p>
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={'col-span-9'}>
                    <div className={'py-5'}>
                        <h3>Sản phẩm nổi bật</h3>
                    </div>
                    <div
                        className={"grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-x-5 gap-y-10"}>
                        {
                            listProduct.map((product, index) => (
                                <Fragment key={index}>
                                    <div className={'bg-white p-2 rounded shadow flex justify-center flex-col'}>
                                        <div>
                                            {
                                                product.image.length > 0 ?
                                                    (
                                                        <img
                                                            src={product.image[0]}
                                                            alt={""}
                                                        />
                                                    ) :
                                                    (
                                                        <img
                                                            src={"https://product.hstatic.net/200000690725/product/54099335584_5b22d198e9_c_5111716a79a24f28a4fb706cfa1dceee_master.jpg"}
                                                            alt={""}
                                                        />
                                                    )

                                            }

                                        </div>
                                        <div className={'flex justify-between text-red-500 text-[12.5px]'}>
                                            <p>+ {product.countColor} màu sắc</p>
                                            <p>+ {product.countSize} kích thước</p>
                                        </div>
                                        <div className={'font-semibold text-[16px] py-1 text-black'}>
                                            <p>{product.productName}</p>
                                        </div>
                                        <div className={'font-semibold text-[14px] text-black py-2'}>
                                            <p>{Math.round(product.originPrice).toLocaleString('vi') + "₫"}</p>
                                        </div>
                                        <div>
                                            <Link to={`/products/${product.productId}`}>
                                                <Button className={'w-full'}>Thêm vào giỏ hàng</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Fragment>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default ProductList

// https://bizweb.dktcdn.net/100/415/697/products/img-1345-1.jpg?v=1723274197627
// https://bizweb.dktcdn.net/100/415/697/products/img-1345-1.jpv=1723274197627