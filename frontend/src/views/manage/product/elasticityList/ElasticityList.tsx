import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesElasticityOverview, apiDeleteSalesElasticity, apiCreateSalesElasticity } from '@/services/ProductSalesService';

const ElasticityList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesElasticityOverview}
                apiDelete={apiDeleteSalesElasticity}
                apiAdd={apiCreateSalesElasticity}
                lablel='độ co giãn'
            />
        </>
    )
}

export default ElasticityList
