import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesColorOverview, apiDeleteSalesColor, apiCreateSalesBrand, apiGetColorById, apiPutSalesColor } from '@/services/ProductSalesService';

const ColorList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesColorOverview}
                apiDelete={apiDeleteSalesColor}
                apiAdd={apiCreateSalesBrand}
                apiGetByID={apiGetColorById}
                apiUpdate={apiPutSalesColor}
                lablel='màu sắc'
            />
        </> 
    )
}

export default ColorList
