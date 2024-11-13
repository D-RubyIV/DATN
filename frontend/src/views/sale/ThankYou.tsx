import React from 'react';

const ThankYouMessage =  () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6 border border-black">
            <h1 className="text-3xl font-bold mb-4">Cảm ơn bạn đã đặt hàng!</h1>
            <p className="text-lg mb-4">
                Đơn hàng của bạn đã được ghi nhận thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận và giao hàng.
            </p>
            <p className="text-base italic mt-6">Trân trọng,<br />Đội ngũ cửa hàng</p>
        </div>
    );
};

export default ThankYouMessage;
