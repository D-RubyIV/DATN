import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ProductTable from './components/ProductTable'
import ProductTableTools from './components/ProductTableTools'

injectReducer('salesProductList', reducer)

const ProductList = () => {
    return (
        <div className="bg-white">
            <div className="p-8 shadow-md rounded-md card h-full card-border">
                <h1 className="font-semibold text-xl mb-4 text-transform: uppercase">Quản lý sản phẩm</h1>
                <div className='mb-5 mt-6'>
                    <ProductTableTools />
                </div>
                <ProductTable />
            </div>
        </div>

    )
}

export default ProductList
