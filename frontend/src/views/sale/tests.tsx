import { Fragment } from 'react';
import { Input, Select, Card, Radio } from 'your-component-library'; // Thay thế bằng thư viện thực tế của bạn

const ShippingInfoForm: React.FC = () => {
    return (
        <Fragment>
            <div className="py-4 text-black font-semibold text-2xl">
                <p>Thông tin giao hàng</p>
            </div>
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-hm text-black text-lg font-semibold">Họ và tên</label>
                        <Input
                            className="border-2 rounded-md border-black p-2 w-full"
                            placeholder="Họ và tên"
                            {...registerFormRecipient('recipientName')}
                            onChange={(el) => {
                                setValuesFormRecipient('recipientName', el.target.value);
                            }}
                        />
                        {errorsFormRecipient.recipientName && (
                            <p className="text-red-500 text-sm mt-1">{errorsFormRecipient.recipientName.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="font-hm text-black text-lg font-semibold">Số điện thoại</label>
                        <Input
                            className="border-2 rounded-md border-black p-2 w-full"
                            placeholder="Số điện thoại"
                            {...registerFormRecipient('phone')}
                            onChange={(el) => {
                                setValuesFormRecipient('phone', el.target.value);
                            }}
                        />
                        {errorsFormRecipient.phone && (
                            <p className="text-red-500 text-sm mt-1">{errorsFormRecipient.phone.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="font-hm text-black text-lg font-semibold">Tỉnh thành</label>
                        <Select
                            className="border-2 rounded-md border-black p-2 w-full"
                            options={provinces}
                            placeholder="Tỉnh/thành"
                            {...registerFormRecipient('provinceId')}
                            onChange={(el) => {
                                setIAddress((prev) => ({ ...prev, iprovince: el }));
                                setValuesFormRecipient('provinceId', el.ProvinceID);
                            }}
                            value={provinces.find(s => s.ProvinceID.toString() === getValuesFormRecipient('provinceId')?.toString()) ?? null}
                        />
                        {errorsFormRecipient.provinceId && (
                            <p className="text-red-500 text-sm mt-1">{errorsFormRecipient.provinceId.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="font-hm text-black text-lg font-semibold">Quận/huyện</label>
                        <Select
                            className="border-2 rounded-md border-black p-2 w-full"
                            options={districts}
                            placeholder="Quận/huyện"
                            {...registerFormRecipient('districtId')}
                            onChange={(el) => {
                                setIAddress((prev) => ({ ...prev, idistrict: el }));
                                setValuesFormRecipient('districtId', el.DistrictID);
                            }}
                            value={districts.find(s => s.DistrictID.toString() === getValuesFormRecipient('districtId')?.toString()) ?? null}
                        />
                        {errorsFormRecipient.districtId && (
                            <p className="text-red-500 text-sm mt-1">{errorsFormRecipient.districtId.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="font-hm text-black text-lg font-semibold">Xã/phường</label>
                        <Select
                            className="border-2 rounded-md border-black p-2 w-full"
                            options={wards}
                            placeholder="Xã/phường"
                            {...registerFormRecipient('wardId')}
                            onChange={(el) => {
                                setIAddress((prev) => ({ ...prev, iward: el }));
                                setValuesFormRecipient('wardId', el.WardCode);
                            }}
                            value={wards.find(s => s.WardCode.toString() === getValuesFormRecipient('wardId')?.toString()) ?? null}
                        />
                        {errorsFormRecipient.wardId && (
                            <p className="text-red-500 text-sm mt-1">{errorsFormRecipient.wardId.message}</p>
                        )}
                    </div>
                </div>
                <div>
                    <label className="font-hm text-black text-lg font-semibold">Địa chỉ</label>
                    <Input
                        className="border-2 rounded-md border-black p-2 w-full"
                        placeholder="Địa chỉ"
                        {...registerFormRecipient('address')}
                        onChange={(el) => {
                            setValuesFormRecipient('address', el.target.value);
                        }}
                    />
                    {errorsFormRecipient.address && (
                        <p className="text-red-500 text-sm mt-1">{errorsFormRecipient.address.message}</p>
                    )}
                </div>

                <div>
                    <div className="py-4 text-black font-semibold text-lg">
                        <p>Phương thức vận chuyển</p>
                    </div>
                    <Card className="border-2 rounded-md border-black p-4">
                        <Radio checked>Vận chuyển</Radio>
                    </Card>
                </div>
                <div>
                    <div className="py-4 text-black font-semibold text-lg">
                        Phương thức thanh toán
                    </div>
                    <Card className="border-2 rounded-md border-black p-4">
                        <Radio.Group
                            vertical
                            className="gap-2"
                            value={paymentMethod}
                            onChange={onChangeMethod}
                        >
                            <Radio value={EPaymentMethod.TRANSFER}>Thanh toán ngân hàng</Radio>
                            <Radio value={EPaymentMethod.CASH}>Thanh toán khi nhận hàng</Radio>
                        </Radio.Group>
                    </Card>
                </div>
                {/*<button className="bg-black w-full py-2 font-thin rounded-md text-white">Xác nhận thông tin</button>*/}
            </div>
        </Fragment>
    );
};

export default ShippingInfoForm;

import { Fragment } from 'react';
import { Input, Select, Card, Radio } from 'your-component-library'; // Thay thế bằng thư viện thực tế của bạn

const ShippingInfoForm: React.FC = () => {
    return (
        <Fragment>
            <div className="py-4 text-black font-semibold text-2xl">
                <p>Thông tin giao hàng</p>
            </div>
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-hm text-black text-lg font-semibold">Họ và tên</label>
                        <Input
                            className="border-2 rounded-md border-black p-2 w-full"
                            placeholder="Họ và tên"
                            {...registerFormRecipient('recipientName')}
                            onChange={(el) => {
                                setValuesFormRecipient('recipientName', el.target.value);
                            }}
                        />
                        {errorsFormRecipient.recipientName && (
                            <p className="text-red-500 text-sm mt-1">{errorsFormRecipient.recipientName.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="font-hm text-black text-lg font-semibold">Số điện thoại</label>
                        <Input
                            className="border-2 rounded-md border-black p-2 w-full"
                            placeholder="Số điện thoại"
                            {...registerFormRecipient('phone')}
                            onChange={(el) => {
                                setValuesFormRecipient('phone', el.target.value);
                            }}
                        />
                        {errorsFormRecipient.phone && (
                            <p className="text-red-500 text-sm mt-1">{errorsFormRecipient.phone.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="font-hm text-black text-lg font-semibold">Tỉnh thành</label>
                        <Select
                            className="border-2 rounded-md border-black p-2 w-full"
                            options={provinces}
                            placeholder="Tỉnh/thành"
                            {...registerFormRecipient('provinceId')}
                            onChange={(el) => {
                                setIAddress((prev) => ({ ...prev, iprovince: el }));
                                setValuesFormRecipient('provinceId', el.ProvinceID);
                            }}
                            value={provinces.find(s => s.ProvinceID.toString() === getValuesFormRecipient('provinceId')?.toString()) ?? null}
                        />
                        {errorsFormRecipient.provinceId && (
                            <p className="text-red-500 text-sm mt-1">{errorsFormRecipient.provinceId.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="font-hm text-black text-lg font-semibold">Quận/huyện</label>
                        <Select
                            className="border-2 rounded-md border-black p-2 w-full"
                            options={districts}
                            placeholder="Quận/huyện"
                            {...registerFormRecipient('districtId')}
                            onChange={(el) => {
                                setIAddress((prev) => ({ ...prev, idistrict: el }));
                                setValuesFormRecipient('districtId', el.DistrictID);
                            }}
                            value={districts.find(s => s.DistrictID.toString() === getValuesFormRecipient('districtId')?.toString()) ?? null}
                        />
                        {errorsFormRecipient.districtId && (
                            <p className="text-red-500 text-sm mt-1">{errorsFormRecipient.districtId.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="font-hm text-black text-lg font-semibold">Xã/phường</label>
                        <Select
                            className="border-2 rounded-md border-black p-2 w-full"
                            options={wards}
                            placeholder="Xã/phường"
                            {...registerFormRecipient('wardId')}
                            onChange={(el) => {
                                setIAddress((prev) => ({ ...prev, iward: el }));
                                setValuesFormRecipient('wardId', el.WardCode);
                            }}
                            value={wards.find(s => s.WardCode.toString() === getValuesFormRecipient('wardId')?.toString()) ?? null}
                        />
                        {errorsFormRecipient.wardId && (
                            <p className="text-red-500 text-sm mt-1">{errorsFormRecipient.wardId.message}</p>
                        )}
                    </div>
                </div>
                <div>
                    <label className="font-hm text-black text-lg font-semibold">Địa chỉ</label>
                    <Input
                        className="border-2 rounded-md border-black p-2 w-full"
                        placeholder="Địa chỉ"
                        {...registerFormRecipient('address')}
                        onChange={(el) => {
                            setValuesFormRecipient('address', el.target.value);
                        }}
                    />
                    {errorsFormRecipient.address && (
                        <p className="text-red-500 text-sm mt-1">{errorsFormRecipient.address.message}</p>
                    )}
                </div>

                <div>
                    <div className="py-4 text-black font-semibold text-lg">
                        <p>Phương thức vận chuyển</p>
                    </div>
                    <Card className="border-2 rounded-md border-black p-4">
                        <Radio checked>Vận chuyển</Radio>
                    </Card>
                </div>
                <div>
                    <div className="py-4 text-black font-semibold text-lg">
                        Phương thức thanh toán
                    </div>
                    <Card className="border-2 rounded-md border-black p-4">
                        <Radio.Group
                            vertical
                            className="gap-2"
                            value={paymentMethod}
                            onChange={onChangeMethod}
                        >
                            <Radio value={EPaymentMethod.TRANSFER}>Thanh toán ngân hàng</Radio>
                            <Radio value={EPaymentMethod.CASH}>Thanh toán khi nhận hàng</Radio>
                        </Radio.Group>
                    </Card>
                </div>
                {/*<button className="bg-black w-full py-2 font-thin rounded-md text-white">Xác nhận thông tin</button>*/}
            </div>
        </Fragment>
    );
};

export default ShippingInfoForm;