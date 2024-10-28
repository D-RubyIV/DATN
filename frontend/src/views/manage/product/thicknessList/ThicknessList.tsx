import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesThicknessOverview, apiDeleteSalesProducts, apiCreateSalesThickness } from '@/services/ProductSalesService';

const ThicknessList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesThicknessOverview}
                apiDelete={apiDeleteSalesProducts}
                apiAdd={apiCreateSalesThickness}
                lablel='độ dày'
            />
        </>
    )
}

export default ThicknessList
