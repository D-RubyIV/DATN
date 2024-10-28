import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesElasticityOverview, apiDeleteSalesProducts, apiCreateSalesElasticity } from '@/services/ProductSalesService';

const ElasticityList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesElasticityOverview}
                apiDelete={apiDeleteSalesProducts}
                apiAdd={apiCreateSalesElasticity}
                lablel='thương hiệu'
            />
        </>
    )
}

export default ElasticityList
