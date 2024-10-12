
export interface IProvince {
    ProvinceID: string,
    ProvinceName: string,
    value: string,
    label: string,
}

export interface IDistrict {
    DistrictID: string,
    DistrictName: string,
}

export interface IWard {
    WardCode: string,
    WardName: string,
}

export interface IAddress {
    iprovince?: IProvince,
    idistrict?: IDistrict,
    iward?: IWard,
    detail?: string
}