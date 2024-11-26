
import { apiGetSalesStyleOverview, apiDeleteSalesProducts, apiCreateSalesStyle } from '@/services/ProductSalesService';
import AttributeForm from '@/views/manage/product/attributeForm'

const StyleList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesStyleOverview}
                apiDelete={apiDeleteSalesProducts}
                apiAdd={apiCreateSalesStyle}
                lablel='kiểu dáng'
            />
        </>
    )
}

export default StyleList
