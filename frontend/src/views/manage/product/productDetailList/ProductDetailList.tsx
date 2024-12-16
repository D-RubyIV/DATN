import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ProductDetailTable from './components/ProductDetailTable'
import ProductTableTools from './components/ProductDetailTableTools'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import {
    initialQuery,
    setFilterData,
    useAppSelector,
    useAppDispatch,
} from './store';

injectReducer('salesProductDetailList', reducer)
injectReducer('productDetailUpdate', reducer)
injectReducer('atrributeList', reducer);

const ProductDetailList = () => {
    const dispatch = useAppDispatch();
  

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <h3 className="mb-4 lg:mb-0">SẢN PHẨM CHI TIẾT</h3>
            <div className='mb-5 mt-5'>
                <ProductTableTools />

            </div>
            <ProductDetailTable />
        </AdaptableCard>
    )
}

export default ProductDetailList
