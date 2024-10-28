import ApiService from './ApiService'


//get data
export async function apiGetSalesProducts<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/product/overview',
        method: 'post',
        data,
    })
}


export async function apiGetSalesSizeOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/size/overview',
        method: 'post',
        data,
    });
}

export async function apiGetSalesColorOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/color/overview',
        method: 'post',
        data,
    });
}

export async function apiGetSalesBrandOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/brand/overview',
        method: 'post',
        data,
    });
}

export async function apiGetSalesCollarOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/collar/overview',
        method: 'post',
        data,
    });
}

export async function apiGetSalesElasticityOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/elasticity/overview',
        method: 'post',
        data,
    });
}

export async function apiGetSalesMaterialOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/material/overview',
        method: 'post',
        data,
    });
}

export async function apiGetSalesOriginOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/origin/overview',
        method: 'post',
        data,
    });
}

export async function apiGetSalesSleeveOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/sleeve/overview',
        method: 'post',
        data,
    });
}

export async function apiGetSalesStyleOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/style/overview',
        method: 'post',
        data,
    });
}

export async function apiGetSalesTextureOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/texture/overview',
        method: 'post',
        data,
    });
}

export async function apiGetSalesThicknessOverview<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/thickness/overview',
        method: 'post',
        data,
    });
}




export async function apiGetSalesProductDetails<T, U extends Record<string, unknown>>(
    data: U,
    params: U

) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/productDetails/details',
        method: 'post',
        data,
        params
    });
}


export async function apiGetSalesProductList<T>() {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/product/product-list',
        method: 'get',
    });
}



export async function apiGetSalesBrands<T>() {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/brand/brand-list',
        method: 'get',
    });
}



export async function apiGetSalesOrigins<T>() {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/origin/origin-list',
        method: 'get',
    });
}

export async function apiGetSalesStyles<T>() {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/style/style-list',
        method: 'get',
    });
}

export async function apiGetSalesCollars<T>() {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/collar/collar-list',
        method: 'get',
    });
}

export async function apiGetSalesSleeves<T>() {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/sleeve/sleeve-list',
        method: 'get',
    });
}

export async function apiGetSalesThickness<T>() {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/thickness/thickness-list',
        method: 'get',
    });
}

export async function apiGetSalesTextures<T>() {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/texture/texture-list',
        method: 'get',
    });
}

export async function apiGetSalesElasticitys<T>() {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/elasticity/elasticity-list',
        method: 'get',
    });
}

export async function apiGetSalesColors<T>() {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/color/color-list',
        method: 'get',
    });
}

export async function apiGetSalesSizes<T>() {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/size/size-list',
        method: 'get',
    });
}

export async function apiGetSalesMaterials<T>() {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/material/material-list',
        method: 'get',
    });
}



//save data
export async function apiCreateSalesProductDetail<T, U extends Record<string, unknown>>(data: U[]) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/productDetails/saveAll',
        method: 'post',
        data, // Dữ liệu là một mảng
    });
}

export async function apiCreateSalesProduct<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/product/save',
        method: 'post',
        data,
    });
}
export async function apiCreateSalesBrand<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/brand/save',
        method: 'post',
        data,
    });
}

export async function apiCreateSalesOrigin<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/origin/save',
        method: 'post',
        data,
    });
}

// API cho Style
export async function apiCreateSalesStyle<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/style/save',
        method: 'post',
        data,
    });
}

// API cho Material
export async function apiCreateSalesMaterial<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/material/save',
        method: 'post',
        data,
    });
}

// API cho Collar
export async function apiCreateSalesCollar<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/collar/save',
        method: 'post',
        data,
    });
}

// API cho Sleeve
export async function apiCreateSalesSleeve<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/sleeve/save',
        method: 'post',
        data,
    });
}

// API cho Texture
export async function apiCreateSalesTexture<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/texture/save',
        method: 'post',
        data,
    });
}

// API cho Thickness
export async function apiCreateSalesThickness<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/thickness/save',
        method: 'post',
        data,
    });
}

// API cho Elasticity
export async function apiCreateSalesElasticity<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/elasticity/save',
        method: 'post',
        data,
    });
}




export async function apiCreateSalesColor<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/color/save',
        method: 'post',
        data,
    });
}

export async function apiCreateSalesSize<T, U extends Record<string, unknown>>(data: U): Promise<{ data: T }> {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/size/save',
        method: 'post',
        data,
    });
}

// delete data
export async function apiDeleteSalesProducts<T>(id: string | string[]) {
    // Đảm bảo id là kiểu string trước khi đưa vào URL
    const productId = Array.isArray(id) ? id[0] : id; // Lấy ID đầu tiên nếu là mảng
    return ApiService.fetchData<T>({
        url: `http://localhost:8080/api/v1/product/delete/${productId}`, // Sử dụng path parameters
        method: 'delete',
    });
}


