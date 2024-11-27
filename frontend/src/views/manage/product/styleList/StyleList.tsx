import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesStyleOverview, apiDeleteSalesStyle, apiCreateSalesStyle } from '@/services/ProductSalesService';

const StyleList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesStyleOverview}
                apiDelete={apiDeleteSalesStyle}
                apiAdd={apiCreateSalesStyle}
                lablel='kiểu dáng'
            />
        </>
    )
}

export default StyleList
