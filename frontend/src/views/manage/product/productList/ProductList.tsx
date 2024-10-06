import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ProductTable from './components/ProductTable'
import ProductTableTools from './components/ProductTableTools'

injectReducer('salesProductList', reducer)

const ProductList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
                <h3 className="mb-4 lg:mb-0">SẢN PHẨM</h3>
            {/* <div className="lg:flex items-center justify-between mb-4"> */}
            <div className='mb-5 mt-5'>
                <ProductTableTools />
            </div>
            <ProductTable />
        </AdaptableCard>
    )
}

export default ProductList
