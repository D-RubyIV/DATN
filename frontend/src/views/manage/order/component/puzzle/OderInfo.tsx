import Card from '@/components/ui/Card'
import { OrderResponseDTO } from '@/@types/order'
import { Button } from '@/components/ui';
import { FileforgeClient } from '@fileforge/client';
import Document from './Document';
import { useState } from 'react';
import CloseButton from '@/components/ui/CloseButton';
import instance from '@/axios/CustomAxios'
import StatusOrderFormat from '@/views/util/StatusOrderFormat'
import TypeOrderFormat from '@/views/util/TypeOrderFormat'
import IsPaymentFormat from '@/views/util/IsPaymentFormat'

const ff = new FileforgeClient({
    apiKey: '029d0f13-d976-43f8-a3ec-16955667b1d2',
});



const OrderInfo = ({ data }: { data: OrderResponseDTO }) => {
    const [viewInvoice, setViewInvoice] = useState<boolean>(false)

    const run = async () => {
        try {
            const response = await instance.get(`orders/exportPdf/${data.id}`, {
                responseType: 'blob', // Đảm bảo nhận phản hồi dưới dạng blob (file)
            });

            // Tạo URL từ Blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

            // Tạo iframe ẩn để in
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;

            // Đợi khi iframe tải xong và in
            iframe.onload = () => {
                if(iframe.contentWindow){
                    iframe.contentWindow.print();

                }
            };

            // Thêm iframe vào body
            document.body.appendChild(iframe);

            // Dọn dẹp tài nguyên sau khi in xong
            iframe.addEventListener('load', () => {
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    window.URL.revokeObjectURL(url);
                }, 600000); // Để đảm bảo quá trình in hoàn tất trước khi xóa iframe
            });
        } catch (error) {
            console.error("Failed to print PDF", error);
        }
    };


    return (
        <div className=''>
            <Card className="mb-5 h-[200px]">
                <div className='flex gap-3 justify-between'>
                    <h5 className="mb-4">Đơn hàng #{data.code}</h5>
                    <div className=''>
                        <Button className='me-2' id='btnPrint' size='sm' onClick={() => run()}>In hóa đơn</Button>
                        {/*<Button className='' onClick={() => setViewInvoice(true)} id='btnPrint' size='sm'>Xem hóa đơn</Button>*/}
                    </div>
                </div>
                <ul>
                    <hr className="mb-3" />
                    <div className="font-semibold py-1 flex justify-items-start items-center">
                        <span>Loại đơn: </span>
                        <span>{<TypeOrderFormat status={data.type} />}</span>
                    </div>
                    <div className="font-semibold py-1 flex justify-items-start items-center">
                        <span>Trạng thái: </span>
                        <span>{<StatusOrderFormat status={data.status} />}</span>
                    </div>
                    <div className="font-semibold py-1 flex justify-items-start items-center">
                        <span>Thanh toán: </span>
                        <span>{<IsPaymentFormat status={data.isPayment} />}</span>
                    </div>
                </ul>

            </Card>

            {viewInvoice && (
                <div
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 bg-white p-5 shadow-2xl rounded-md">
                    <div className='flex justify-end'>
                        <CloseButton onClick={() => setViewInvoice(false)}></CloseButton>
                    </div>
                    <div>
                        <Document billDTO={data}></Document>
                    </div>
                </div>
            )}

        </div>
    )
}

export default OrderInfo
