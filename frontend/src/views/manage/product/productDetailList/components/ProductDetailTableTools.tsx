import Button from '@/components/ui/Button'
import { HiDownload, HiUpload } from 'react-icons/hi'
import { FaFileDownload, FaFileUpload } from "react-icons/fa";

import ProductDetailTableSearch from './ProductDetailTableSearch'
import { Link } from 'react-router-dom'

const ProductDetailTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-grow mb-4 lg:mb-0">
            <ProductDetailTableSearch />
            </div>
            <div className="flex-shrink-0">

            <Link
                download
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                to="/data/product-list.csv"
                target="_blank"
                >
                    <Button block size="sm" icon={<FaFileDownload />}>
                    Xuất Excel
                </Button>
            </Link>
            <Link
                download
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                to="/data/product-list.csv"
                target="_blank"
                >
                    <Button block size="sm" icon={<FaFileUpload />}>
                    Tải Lên Tệp Excel
                </Button>
            </Link>
            {/* <Link
                className="block lg:inline-block md:mb-0 mb-4"
                to="/manage/product/product-new"
                >
                <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                Thêm Sản Phẩm
                </Button>
            </Link> */}
            </div>
        </div>
    )
}

export default ProductDetailTableTools
