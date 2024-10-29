import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesColorOverview, apiDeleteSalesProducts, apiCreateSalesBrand } from '@/services/ProductSalesService';

const ColorList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesColorOverview}
                apiDelete={apiDeleteSalesProducts}
                apiAdd={apiCreateSalesBrand}
                lablel='màu sắc'
            />
        </>
    )
}

export default ColorList
