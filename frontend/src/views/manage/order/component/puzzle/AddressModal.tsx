import { IAddress, IDistrict, IProvince, IWard } from "@/@types/address";
import instanceGHN from "@/axios/GHNAxios";
import { Button, Input, Select } from "@/components/ui";
import CloseButton from "@/components/ui/CloseButton";
import { fetchFindAllDistricts, fetchFindAllProvinces, fetchFindAllWards } from "@/services/AddressService";
import { set } from "lodash";
import { SetStateAction, useEffect, useState } from "react";


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
        const modifiedProvinces: IProvince[] = await fetchFindAllProvinces();
        setProvinces(modifiedProvinces); // Cập nhật state với mảng đã sửa đổi
        console.log(modifiedProvinces);
    }
    const handleFindAllDistricts = async (idProvince: string) => {
        const modifiedDistricts: IDistrict[] = await fetchFindAllDistricts(idProvince);
        setDistricts(modifiedDistricts);
    }
    const handleFindAllWards = async (idDistrict: string) => {
        const modifiedDistricts: IWard[] = await fetchFindAllWards(idDistrict);
        setWards(modifiedDistricts);
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