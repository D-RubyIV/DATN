import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesTextureOverview, apiDeleteSalesProducts, apiCreateSalesTexture } from '@/services/ProductSalesService';

const TextureList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesTextureOverview}
                apiDelete={apiDeleteSalesProducts}
                apiAdd={apiCreateSalesTexture}
                lablel='kết cấu'
            />
        </>
    )
}

export default TextureList
