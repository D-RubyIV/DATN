import instanceGHN from "@/axios/GHNAxios";
import { Button, Input, Select } from "@/components/ui";
import CloseButton from "@/components/ui/CloseButton";
import { set } from "lodash";
import { SetStateAction, useEffect, useState } from "react";

interface IProvince {
    ProvinceID: string,
    ProvinceName: string,
    value: string,
    label: string,
}

interface IDistrict {
    DistrictID: string,
    DistrictName: string,
}

interface IWard {
    WardCode: string,
    WardName: string,
}
interface IAddress {
    iprovince?: IProvince,
    idistrict?: IDistrict,
    iward?: IWard,
    detail?: string
}

const AddressModal = ({ onCloseModal }: { onCloseModal: React.Dispatch<SetStateAction<boolean>> }) => {

    const [IAddress, setIAddress] = useState<IAddress>({})
    const [provinces, setProvinces] = useState<IProvince[]>([])
    const [districts, setDistricts] = useState<IDistrict[]>([])
    const [wards, setWards] = useState<IWard[]>([])

    useEffect(() => {
        console.log("IAddress")
        console.log(IAddress)
    }, [IAddress])



    const handleFindAllProvinces = async () => {
        instanceGHN.get("shiip/public-api/master-data/province").then(function (response) {
            if (response.status === 200 && response?.data?.data) {
                const modifiedProvinces = response.data.data.map((province: IProvince) => ({
                    ProvinceID: province.ProvinceID,
                    ProvinceName: province.ProvinceID,
                    value: province.ProvinceID,  // Thêm thuộc tính `value`
                    label: province.ProvinceName // Thêm thuộc tính `label`
                }));
                setProvinces(modifiedProvinces); // Cập nhật state với mảng đã sửa đổi
                console.log(modifiedProvinces);
            }
        })
    }
    const handleFindAllDistricts = async (idProvince: string) => {
        instanceGHN.get(`shiip/public-api/master-data/district?province_id=${idProvince}`).then(function (response) {
            if (response.status === 200 && response?.data?.data) {
                const modifiedDistricts = response.data.data.map((district: IDistrict) => ({
                    DistrictID: district.DistrictID,
                    DistrictName: district.DistrictName,
                    value: district.DistrictID,  // Thêm thuộc tính `value`
                    label: district.DistrictName // Thêm thuộc tính `label`
                }));
                setDistricts(modifiedDistricts); // Cập nhật state với mảng đã sửa đổi
                console.log(modifiedDistricts);
            }
        })
    }
    const handleFindAllWards = async (idDistrict: string) => {
        instanceGHN.get(`shiip/public-api/master-data/ward?district_id=${idDistrict}`).then(function (response) {
            if (response.status === 200 && response?.data?.data) {
                if (response.status === 200 && response?.data?.data) {
                    const modifiedDistricts = response.data.data.map((ward: IWard) => ({
                        DistrictID: ward.WardCode,
                        DistrictName: ward.WardName,
                        value: ward.WardCode,  // Thêm thuộc tính `value`
                        label: ward.WardName // Thêm thuộc tính `label`
                    }));
                    setWards(modifiedDistricts); // Cập nhật state với mảng đã sửa đổi
                    console.log(modifiedDistricts);
                }
            }
        })
    }

    useEffect(() => {
        handleFindAllProvinces()
    }, [])
    useEffect(() => {
        if (IAddress.iprovince) {
            handleFindAllDistricts(IAddress.iprovince.ProvinceID);
            if (IAddress.idistrict) {
                handleFindAllWards(IAddress.idistrict.DistrictID);
            }
        }
    }, [IAddress])

    return (
        <div className="fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-50">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl md:w-2/5 p-5 rounded-md z-51">
                <div className="flex justify-between py-3 text-[18px] font-semibold">
                    <div>
                        <label>Edit</label>
                    </div>
                    <div>
                        <CloseButton onClick={() => onCloseModal(false)}></CloseButton>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    {/* Select Tỉnh */}
                    <div>
                        <label className="font-semibold text-gray-600">Tỉnh:</label>
                        <Select
                            options={provinces}
                            placeholder="Vui lòng nhập tỉnh"
                            size="sm"
                            onChange={(el) =>
                                setIAddress((prev) => ({ ...prev, iprovince: (el as IProvince) }))
                            }
                        // Dưới đây là đoạn mã đã được chỉnh sửa
                        >
                        </Select>

                    </div>
                    {/* Select Tỉnh */}
                    <div>
                        <label className="font-semibold text-gray-600">Thành phố:</label>
                        <Select
                            options={districts}
                            placeholder="Vui lòng chọn thành phố"
                            size="sm"
                            onChange={(el) =>
                                setIAddress((prev) => ({ ...prev, idistrict: (el as IDistrict) }))
                            }
                        >
                        </Select>
                    </div>
                    {/* Select xã */}
                    <div>
                        <label className="font-semibold text-gray-600">Xã:</label>
                        <Select
                            options={wards}
                            placeholder="Vui lòng chọn thành phố"
                            size="sm"
                            onChange={(el) =>
                                setIAddress((prev) => ({ ...prev, iward: (el as IWard) }))
                            }
                        >
                        </Select>
                    </div>
                    {/* Chi tiết */}
                    <div>
                        <label className="font-semibold text-gray-600">Số nhà:</label>
                        <Input
                            placeholder="Vui lòng nhập số nhà"
                            size="sm"
                            onChange={(el) =>
                                setIAddress((prev) => ({ ...prev, detail: el.target.value }))
                            }
                            textArea
                        >
                        </Input>
                    </div>
                    <div>
                        <Button block variant="twoTone">Xác nhận</Button>
                    </div>
                </div>
            </div >
        </div>
    );
}

export default AddressModal;