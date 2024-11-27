import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesTextureOverview, apiDeleteSalesTexture, apiCreateSalesTexture } from '@/services/ProductSalesService';

const TextureList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesTextureOverview}
                apiDelete={apiDeleteSalesTexture}
                apiAdd={apiCreateSalesTexture}
                lablel='kết cấu'
            />
        </>
    )
}

export default TextureList
