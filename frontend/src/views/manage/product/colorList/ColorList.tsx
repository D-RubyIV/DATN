import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesColorOverview, apiDeleteSalesCollar, apiCreateSalesBrand } from '@/services/ProductSalesService';

const ColorList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesColorOverview}
                apiDelete={apiDeleteSalesCollar}
                apiAdd={apiCreateSalesBrand}
                lablel='màu sắc'
            />
        </>
    )
}

export default ColorList
