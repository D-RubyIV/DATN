import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesThicknessOverview, apiDeleteSalesThickness, apiCreateSalesThickness } from '@/services/ProductSalesService';

const ThicknessList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesThicknessOverview}
                apiDelete={apiDeleteSalesThickness}
                apiAdd={apiCreateSalesThickness}
                lablel='độ dày'
            />
        </>
    )
}

export default ThicknessList
