import {Fragment, useEffect, useState} from "react";
import instance from "@/axios/CustomAxios";
import {Button} from "@/components/ui";


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


const ProductList = () => {

    const [listProduct, setListProduct] = useState<Product[]>([])
    const initDataProduct = async () => {
        const response = await instance.get("/productDetails/abc")
        setListProduct(response?.data?.content)
    }
    useEffect(() => {
        initDataProduct()
    }, []);

    return (
        <Fragment>
            <div className={'grid grid-cols-12 px-20'}>
                <div className={'col-span-3'}>
                    <div>

                    </div>
                </div>
                <div className={'flex justify-center col-span-9'}>
                    <div className={"grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 gap-x-5 gap-y-10"}>
                        {
                            listProduct.map((product, index) => (
                                <Fragment key={index}>
                                    <div className={'bg-white p-2 rounded shadow'}>
                                        <div>
                                            <img
                                                src={"https://product.hstatic.net/200000690725/product/54099335584_5b22d198e9_c_5111716a79a24f28a4fb706cfa1dceee_master.jpg"}
                                                alt={""}
                                                width={200}
                                                height={300}
                                            />
                                        </div>
                                        <div className={'flex justify-between text-red-500 text-[12.5px]'}>
                                            <p>+ {product.countColor} màu sắc</p>
                                            <p>+ {product.countSize} kích thước</p>
                                        </div>
                                        <div className={'font-semibold text-[14px]'}>
                                            <p>{product.productName}</p>
                                        </div>
                                        <div className={'font-semibold text-[14px]'}>
                                            <p>{product.originPrice}</p>
                                        </div>
                                        <div>
                                            <Button>Thêm vào giỏ hàng</Button>
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