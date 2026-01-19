import ApiService from './ApiService'
import appConfig from '@/configs/app.config'


//get data
export async function apiGetSalesProducts<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/product/overview`,
        method: 'post',
        data,
    })
}


export async function apiGetSalesSizeOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/size/overview`,
        method: 'post',
        data,
    });
}

export async function apiGetSalesColorOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/color/overview`,
        method: 'post',
        data,
    });
}

export async function apiGetSalesBrandOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/brand/overview`,
        method: 'post',
        data,
    });
}

export async function apiGetSalesCollarOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/collar/overview`,
        method: 'post',
        data,
    });
}

export async function apiGetSalesElasticityOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/elasticity/overview`,
        method: 'post',
        data,
    });
}

export async function apiGetSalesMaterialOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/material/overview`,
        method: 'post',
        data,
    });
}

export async function apiGetSalesOriginOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/origin/overview`,
        method: 'post',
        data,
    });
}

export async function apiGetSalesSleeveOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/sleeve/overview`,
        method: 'post',
        data,
    });
}

export async function apiGetSalesStyleOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/style/overview`,
        method: 'post',
        data,
    });
}

export async function apiGetSalesTextureOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/texture/overview`,
        method: 'post',
        data,
    });
}

export async function apiGetSalesThicknessOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/thickness/overview`,
        method: 'post',
        data,
    });
}




export async function apiGetSalesProductDetails<T, U extends Record<string, unknown>>(
    data: U,
    params: {
        productId: number,
        size: string,
        color: string,
        style: string,
        texture: string,
        origin: string,
        brand: string,
        collar: string,
        sleeve: string,
        material: string,
        thickness: string,
        elasticity: string,
    }

) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/productDetails/details`,
        method: 'post',
        data,
        params
    });
}




export async function apiGetDataProductDetailQuery<T, U extends Record<string, unknown>>(
    params: U

) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/productDetails/getDataAttribute`,
        method: 'get',
        params,
    })
}






export async function apiGetSalesProductDetail<T, U extends Record<string, unknown>>(
    params: U

) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/productDetails/findById`,
        method: 'post',
        params,
    })
}




export async function apiGetSalesProductList<T>() {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/product/product-list`,
        method: 'get',
    });
}



export async function apiGetSalesBrands<T>() {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/brand/brand-list`,
        method: 'get',
    });
}



export async function apiGetSalesOrigins<T>() {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/origin/origin-list`,
        method: 'get',
    });
}

export async function apiGetSalesStyles<T>() {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/style/style-list`,
        method: 'get',
    });
}

export async function apiGetSalesCollars<T>() {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/collar/collar-list`,
        method: 'get',
    });
}

export async function apiGetSalesSleeves<T>() {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/sleeve/sleeve-list`,
        method: 'get',
    });
}

export async function apiGetSalesThickness<T>() {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/thickness/thickness-list`,
        method: 'get',
    });
}

export async function apiGetSalesTextures<T>() {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/texture/texture-list`,
        method: 'get',
    });
}

export async function apiGetSalesElasticitys<T>() {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/elasticity/elasticity-list`,
        method: 'get',
    });
}

export async function apiGetSalesColors<T>() {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/color/color-list`,
        method: 'get',
    });
}

export async function apiGetSalesSizes<T>() {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/size/size-list`,
        method: 'get',
    });
}

export async function apiGetSalesMaterials<T>() {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/material/material-list`,
        method: 'get',
    });
}



//save data
export async function apiCreateSalesProductDetail<T, U extends Record<string, unknown>>(data: U[]) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/productDetails/saveAll`,
        method: 'post',
        data, // Dữ liệu là một mảng
    });
}

export async function apiCreateSalesProduct<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/product/save`,
        method: 'post',
        data,
    });
}
export async function apiCreateSalesBrand<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/brand/save`,
        method: 'post',
        data,
    });
}

export async function apiCreateSalesOrigin<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/origin/save`,
        method: 'post',
        data,
    });
}

// API cho Style
export async function apiCreateSalesStyle<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/style/save`,
        method: 'post',
        data,
    });
}

// API cho Material
export async function apiCreateSalesMaterial<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/material/save`,
        method: 'post',
        data,
    });
}

// API cho Collar
export async function apiCreateSalesCollar<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/collar/save`,
        method: 'post',
        data,
    });
}

// API cho Sleeve
export async function apiCreateSalesSleeve<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/sleeve/save`,
        method: 'post',
        data,
    });
}

// API cho Texture
export async function apiCreateSalesTexture<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/texture/save`,
        method: 'post',
        data,
    });
}

// API cho Thickness
export async function apiCreateSalesThickness<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/thickness/save`,
        method: 'post',
        data,
    });
}

// API cho Elasticity
export async function apiCreateSalesElasticity<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/elasticity/save`,
        method: 'post',
        data,
    });
}




export async function apiCreateSalesColor<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/color/save`,
        method: 'post',
        data,
    });
}

export async function apiCreateSalesSize<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/size/save`,
        method: 'post',
        data,
    });
}



// get byID


export async function apiGetBrandById<T, U extends Record<string, unknown>>(
    params: { id: number }
) {
    // Lấy id từ params
    const { id } = params;

    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/brand/${id}`, // Truyền id trực tiếp vào URL
        method: 'get',
    });
}


export async function apiGetCollarById<T, U extends Record<string, unknown>>(
    params: { id: number }
) {
    const { id } = params;

    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/collar/${id}`,
        method: 'get',
    });
}


export async function apiGetColorById<T, U extends Record<string, unknown>>(
    params: { id: number }
) {
    const { id } = params;

    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/color/${id}`,
        method: 'get',
    });
}

export async function apiGetElasticityById<T, U extends Record<string, unknown>>(
    params: { id: number }
) {
    const { id } = params;

    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/elasticity/${id}`,
        method: 'get',
    });
}


export async function apiGetMaterialById<T, U extends Record<string, unknown>>(
    params: { id: number }
) {
    const { id } = params;

    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/material/${id}`,
        method: 'get',
    });
}

export async function apiGetOriginById<T, U extends Record<string, unknown>>(
    params: { id: number }
) {
    const { id } = params;

    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/origin/${id}`,
        method: 'get',
    });
}



export async function apiGetSizeById<T, U extends Record<string, unknown>>(
    params: { id: number }
) {
    const { id } = params;

    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/size/${id}`,
        method: 'get',
    });
}

export async function apiGetSleeveById<T, U extends Record<string, unknown>>(
    params: { id: number }
) {
    const { id } = params;

    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/sleeve/${id}`,
        method: 'get',
    });
}

export async function apiGetStyleById<T, U extends Record<string, unknown>>(
    params: { id: number }
) {
    const { id } = params;

    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/style/${id}`,
        method: 'get',
    });
}

export async function apiGetTextureById<T, U extends Record<string, unknown>>(
    params: { id: number }
) {
    const { id } = params;

    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/texture/${id}`,
        method: 'get',
    });
}

export async function apiGetThicknessById<T, U extends Record<string, unknown>>(
    params: { id: number }
) {
    const { id } = params;

    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/thickness/${id}`,
        method: 'get',
    });
}



// delete data
export async function apiDeleteSalesProducts<T>(id: string | string[]) {
    // Đảm bảo id là kiểu string trước khi đưa vào URL
    const productId = Array.isArray(id) ? id[0] : id; // Lấy ID đầu tiên nếu là mảng
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/product/delete/${productId}`, // Sử dụng path parameters
        method: 'delete',
    });
}

export async function apiDeleteSalesProductDetail<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/productDetails/${param.id}`, // Thêm phần tham số id vào URL
        method: 'delete',
        param
    });
}


export async function apiDeleteSalesBrand<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/brand/${param.id}`,
        method: 'delete',
        param
    });
}

export async function apiDeleteSalesCollar<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/collar/${param.id}`,
        method: 'delete',
        param
    });
}

export async function apiDeleteSalesColor<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/color/${param.id}`,
        method: 'delete',
        param
    });
}
export async function apiDeleteSalesElasticity<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/elasticity/${param.id}`,
        method: 'delete',
        param
    });
}
export async function apiDeleteSalesMaterial<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/material/${param.id}`,
        method: 'delete',
        param
    });
}
export async function apiDeleteSalesOrigin<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/origin/${param.id}`,
        method: 'delete',
        param
    });
}
export async function apiDeleteSalesSize<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/size/${param.id}`,
        method: 'delete',
        param
    });
}
export async function apiDeleteSalesSleeve<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/sleeve/${param.id}`,
        method: 'delete',
        param
    });
}
export async function apiDeleteSalesStyle<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/style/${param.id}`,
        method: 'delete',
        param
    });
}
export async function apiDeleteSalesTexture<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/texture/${param.id}`,
        method: 'delete',
        param
    });
}
export async function apiDeleteSalesThickness<T, U extends Record<string, unknown>>(
    param: U
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/thickness/${param.id}`,
        method: 'delete',
        param
    });
}

 
//update data

export async function apiPutSalesProductDetail<T, U extends Record<string, unknown>>(
    data: U,
    param: number

) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/productDetails/${param}`,
        method: 'put',
        data,
    });
}


export async function apiPutSalesBrand<T, U extends Record<string, unknown>>(
    data: U,
    param: string
 
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/brand/${param}`,
        method: 'put',
        data,
    });
}
export async function apiPutSalesCollar<T, U extends Record<string, unknown>>(
    data: U,
    param: string

) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/collar/${param}`,
        method: 'put',
        data,
    });
}



export async function apiPutSalesColor<T, U extends Record<string, unknown>>(
    data: U,
    param: string
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/color/${param}`,
        method: 'put',
        data,
    });
}

export async function apiPutSalesElasticity<T, U extends Record<string, unknown>>(
    data: U,
    param: string
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/elasticity/${param}`,
        method: 'put',
        data,
    });
}



export async function apiPutSalesMaterial<T, U extends Record<string, unknown>>(
    data: U,
    param: string
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/material/${param}`,
        method: 'put',
        data,
    });
}

export async function apiPutSalesOrigin<T, U extends Record<string, unknown>>(
    data: U,
    param: string
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/origin/${param}`,
        method: 'put',
        data,
    });
}



export async function apiPutSalesSize<T, U extends Record<string, unknown>>(
    data: U,
    param: string
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/size/${param}`,
        method: 'put',
        data,
    });
}

export async function apiPutSalesSleeve<T, U extends Record<string, unknown>>(
    data: U,
    param: string
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/sleeve/${param}`,
        method: 'put',
        data,
    });
}

export async function apiPutSalesStyle<T, U extends Record<string, unknown>>(
    data: U,
    param: string
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/style/${param}`,
        method: 'put',
        data,
    });
}

export async function apiPutSalesTexture<T, U extends Record<string, unknown>>(
    data: U,
    param: string
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/texture/${param}`,
        method: 'put',
        data,
    });
}

export async function apiPutSalesThickness<T, U extends Record<string, unknown>>(
    data: U,
    param: string
) {
    return ApiService.fetchData<T>({
        url: `${appConfig.apiPrefix}/thickness/${param}`,
        method: 'put',
        data,
    });
}



