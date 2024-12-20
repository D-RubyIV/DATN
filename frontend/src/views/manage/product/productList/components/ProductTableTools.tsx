import Button from '@/components/ui/Button'
import {  HiPlusCircle } from 'react-icons/hi'
import { FaFileDownload } from "react-icons/fa";
import ProductTableSearch from './ProductTableSearch'
import { Link } from 'react-router-dom'

const ProductTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-grow mb-4 lg:mb-0">
                <ProductTableSearch />
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
                    className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                    to="/admin/manage/product/product-new"
                    // to="/admin/manage/product/brand-list"

                    
                >
                    <Button
                        size='sm'
                        block
                        variant="solid"
                        style={{ backgroundColor: 'rgb(79, 70, 229)' }}
                        className='flex items-center justify-center gap-2 button-bg-important'
                        icon={<HiPlusCircle />} 
                    >
                        Thêm Sản Phẩm
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default ProductTableTools
