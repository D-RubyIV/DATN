import React, { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import instance from '@/axios/CustomAxios'
import { useLoadingContext } from '@/context/LoadingContext'
import { OrderResponseDTO } from '@/@types/order'
import { useToastContext } from '@/context/ToastContext'

type IProps = {
    isScanning: boolean;
    selectOrder: OrderResponseDTO,
    fetchData: () => Promise<void>,
    setIsScanning: React.Dispatch<React.SetStateAction<boolean>>;
};

const QrCodeScanner: React.FC<IProps> = ({ isScanning, selectOrder, fetchData, setIsScanning }) => {
    const [scanResult, setScanResult] = useState<string | null>(null)
    const qrRegionId = 'qr-reader'

    const { sleep } = useLoadingContext()
    const { openNotification } = useToastContext()

    useEffect(() => {
        console.log('scanResult: ', scanResult)
    }, [scanResult])

    const findProductDetailByCode = async (code: string | null) => {
        if (code != null) {
            const response = await instance.get(`/productDetails/find-by-code/${code}`)
            console.log(response)
            return response
        }

    }

    const addOrderDetail = async (productDetailId: number) => {
        const data = {
            'orderId': selectOrder.id,
            'productDetailId': productDetailId,
            'quantity': 1
        }
        const response = await instance.post('/order-details', data)
        await fetchData()
        await sleep(500)
        document.body.style.overflow = 'auto'
        return response
    }

    useEffect(() => {
        let html5QrCodeScanner: Html5QrcodeScanner | null = null

        if (isScanning && document.getElementById(qrRegionId)) {
            html5QrCodeScanner = new Html5QrcodeScanner(
                qrRegionId,
                {
                    fps: 10,
                    qrbox: { width: 900, height: 900 },
                    useBarCodeDetectorIfSupported: true,
                    showZoomSliderIfSupported: true,
                    defaultZoomValueIfSupported: 5
                },
                false
            )

            html5QrCodeScanner.render(
                (decodedText) => {
                    setScanResult(decodedText)
                    console.log(`Mã QR đã quét: ${decodedText}`)
                    console.log('scanResult: ', decodedText)
                    findProductDetailByCode(decodedText).then(function(response) {
                        console.log(response)
                        if (response?.data?.id) {
                            console.log('id product detail: ', response?.data?.id)
                            addOrderDetail(response?.data?.id).then(function(response) {
                                if (response.status === 200) {
                                    openNotification('Thêm thành công')
                                }
                            })
                        }
                    })
                    setIsScanning(false)
                },
                (error) => {
                    console.warn(`Quét thất bại: ${error}`)
                }
            )
        }

        return () => {
            if (html5QrCodeScanner) {
                html5QrCodeScanner.clear()
            }
        }
    }, [isScanning])

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            {isScanning && (
                <div
                    className="scan-modal"
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '500px',
                        height: '500px',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                        zIndex: 1000
                    }}
                >
                    <div id={qrRegionId} style={{ width: '100%', height: '100%' }}></div>
                    <button
                        onClick={() => setIsScanning(false)}
                        style={{ marginTop: '20px', padding: '10px 20px' }}
                    >
                        Dừng Quét
                    </button>
                </div>
            )}
        </div>
    )
}

export default QrCodeScanner