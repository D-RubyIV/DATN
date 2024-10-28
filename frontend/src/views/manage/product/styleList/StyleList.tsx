import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesStyleOverview, apiDeleteSalesProducts, apiCreateSalesStyle } from '@/services/ProductSalesService';

const StyleList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesStyleOverview}
                apiDelete={apiDeleteSalesProducts}
                apiAdd={apiCreateSalesStyle}
                lablel='thương hiệu'
            />
        </>
    )
}

export default StyleList
