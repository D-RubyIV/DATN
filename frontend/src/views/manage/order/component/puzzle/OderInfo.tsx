import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import { BillResponseDTO } from '../../store'
import { compile } from "@fileforge/react-print";
import { Button } from '@/components/ui';
import { FileforgeClient } from '@fileforge/client';
import { displayDoc, displayLoading } from './util';
import Document from './Document';
import { useState } from 'react';
import CloseButton from '@/components/ui/CloseButton';

const ff = new FileforgeClient({
    apiKey: '029d0f13-d976-43f8-a3ec-16955667b1d2',
});



const OrderInfo = ({ data }: { data: BillResponseDTO }) => {
    const [viewInvoice, setViewInvoice] = useState<boolean>(false)

    const run = async () => {
        displayLoading();

        // This is used to prevent treeshaking during building
        // @ts-ignore
        await import('react-dom/server');

        const html = `<doctype html><html><body>${await compile(
            <Document billDTO={data}></Document>
        )}</body></html>`;

        const { url } = await ff.pdf.generate(html, {
            options: {
                host: true,
            },
        });

        displayDoc(url);
    };

    return (
        <div className=''>
            <Card className="mb-5 h-[160px]">
                <div className='flex gap-3 justify-between'>
                    <h5 className="mb-4">Đơn hàng #{data.code}</h5>
                    <div className=''>
                        <Button className='me-2' onClick={run} id='btnPrint' size='sm'>In hóa đơn</Button>
                        <Button className='' onClick={() => setViewInvoice(true)} id='btnPrint' size='sm'>Xem hóa đơn</Button>
                    </div>
                </div>
                <ul>
                    <hr className="mb-3" />
                    <li className='font-semibold py-1'>Loại: {data.type}</li>
                    <li className='font-semibold py-1'>Trạng thái: {data.status}</li>
                </ul>

            </Card>

            {viewInvoice && (
                <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 bg-white p-5 shadow-2xl rounded-md'>
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
