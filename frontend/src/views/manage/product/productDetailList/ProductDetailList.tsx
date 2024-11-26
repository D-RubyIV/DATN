import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ProductDetailTable from './components/ProductDetailTable'
import ProductTableTools from './components/ProductDetailTableTools'

injectReducer('salesProductDetailList', reducer)

const ProductDetailList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            {/* <div className="lg:flex items-center justify-between mb-4"> */}
            
                <h3 className="mb-4 lg:mb-0">SẢN PHẨM CHI TIẾT</h3>
            <div className='mb-5 mt-5'>
                <ProductTableTools />
            </div>
            {/* </div> */}
            <ProductDetailTable />
        </AdaptableCard>
    )
}

export default ProductDetailList
