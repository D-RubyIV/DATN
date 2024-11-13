import React, {Fragment} from 'react';
import {Input} from 'antd'; // Giả sử bạn đang dùng Ant Design cho Input
import {HiSearch} from 'react-icons/hi';
import {Button} from "@/components/ui";

const CheckOrderView = () => {
    return (
        <Fragment>
            {/* Căn giữa cả chiều dọc và chiều ngang */}
            <div className="flex justify-center items-center h-full flex-col gap-5">
                <h3>Tra cứu đơn hàng của bạn tại đây</h3>
                <div className="w-full max-w-md"> {/* Giới hạn chiều rộng của ô input */}
                    <Input
                        size={'large'}
                        suffix={
                            <Button variant={'plain'}>
                                <HiSearch/>
                            </Button>
                        }
                        placeholder="Nhập mã đơn hàng của bạn"
                        className="w-full"
                    />
                </div>
            </div>
        </Fragment>
    );
};

export default CheckOrderView;
