import { Fragment, useEffect, useState, useRef } from 'react'
import Steps from '@/components/ui/Steps'
import { Button, Input, Radio } from '@/components/ui'
import { BillResponseDTO, EBillStatus } from '../../store'
import { HiPlusCircle } from 'react-icons/hi'
import Axios from 'axios'
import instance from '@/axios/CustomAxios'



type ExampleAnswers = {
    status: EBillStatus;
    messages: string[];
}


const OrderStep = ({ selectObject, fetchData }: { selectObject: BillResponseDTO, fetchData: () => {} }) => {
    const [step, setStep] = useState(0)
    const [invalid, setInvalid] = useState(false)
    const [value, setValue] = useState('')
    const [currentStatus, setCurrentStatus] = useState<EBillStatus>(selectObject.status)
    const [note, setNote] = useState<string>("")
    const textareaRef = useRef<any>(null);  // useRef for textarea


    const handleInputChange = (el: any) => {
        setNote(el.target.value);
    };


    const exampleAnswers: ExampleAnswers[] = [
        {
            "status": "PENDING",
            "messages": [
                "Xác nhận đơn hàng",
            ]
        },
        {
            "status": "TOSHIP",
            "messages": [
                "Xác nhận đơn hàng đang chờ vận chuyển"
            ]
        },
        {
            "status": "TORECEIVE",
            "messages": [
                "Xác nhận đơn hàng đang được vận chuyển",
            ]
        },
    ]

    const onChange = (nextStep: number) => {
        if (nextStep < 0) {
            setStep(0)
        } else if (nextStep > 8) {
            setStep(8)
        } else {
            setStep(nextStep)
        }
    }
    const onNext = () => onChange(step + 1)
    const onPrevious = () => onChange(step - 1)


    useEffect(() => {
        setCurrentStatus(selectObject.status)
        console.log("Current status: ", selectObject.status)
    }, [selectObject])


    const onClickSelectSuggest = (value: string) => {
        setValue(value);
        setNote(value)
    }


    const submitChangeStatus = (status: EBillStatus) => {
        const data = {
            "status": status,
            "note": note
        }
        instance.put(`/orders/status/change/${selectObject.id}`, data).then(function (response) {
            fetchData()
            setNote("")
        })
    }

    const ActionButton = () => {
        if (currentStatus === "PENDING") {
            return (
                <div className='flex gap-2'>
                    <Button block variant="solid" size="sm" className='bg-indigo-500 !w-auto' icon={<HiPlusCircle />} onClick={() => submitChangeStatus('TOSHIP')}>Xác nhận</Button>
                    <Button block variant="default" size="sm" className='bg-indigo-500 !w-32' icon={<HiPlusCircle />} onClick={() => submitChangeStatus('CANCELED')}>Hủy</Button>
                </div>
            )
        }
        else if (currentStatus === "TOSHIP") {
            return (
                <div className='flex gap-2'>
                    <Button block variant="solid" size="sm" className='bg-indigo-500 !w-auto' icon={<HiPlusCircle />} onClick={() => submitChangeStatus('TORECEIVE')}>Xác nhận</Button>
                    <Button block variant="default" size="sm" className='bg-indigo-500 !w-32' icon={<HiPlusCircle />} onClick={() => submitChangeStatus('PENDING')}>Quay lại</Button>
                </div>
            )
        }
        else if (currentStatus === "TORECEIVE") {
            return (
                <div className='flex gap-2'>
                    <Button block variant="solid" size="sm" className='bg-indigo-500 !w-auto' icon={<HiPlusCircle />} onClick={() => submitChangeStatus('DELIVERED')}>Xác nhận</Button>
                </div>
            )
        }
        else if (currentStatus === "DELIVERED") {
            return (
                <div className='flex gap-2'>
                    {/* <Button block variant="solid" size="sm" className='bg-indigo-500 !w-auto' icon={<HiPlusCircle />} onClick={() => submitChangeStatus('DELIVERED')}> Confirm</Button>
                    <Button block variant="default" size="sm" className='bg-indigo-500 !w-32' icon={<HiPlusCircle />}>Cancelled</Button> */}
                </div>
            )
        }
    };

    const ChangeForPending = () => {
        const answers = exampleAnswers.find(s => s.status === selectObject.status)?.messages;

        const textareaRef = useRef<any>(null);

        // Hàm xử lý khi có thay đổi trong input
        const handleInputChange = (el: any) => {
            setNote(el.target.value);
        };

        // Hàm để focus vào cuối dòng trong textarea
        useEffect(() => {
            if (textareaRef.current) {
                const length = note.length; // Lấy độ dài nội dung trong textarea
                textareaRef.current.focus(); // Focus lại textarea
                textareaRef.current.setSelectionRange(length, length); // Đặt con trỏ ở cuối dòng
            }
        }, [note]); // Mỗi khi giá trị `note` thay đổi

        return (
            <div>
                <div className="mb-4">
                    <div className=''>
                        <div className="mt-4">
                            {answers && answers.length > 0 ? (
                                <Radio.Group vertical value={value} onChange={onChange}>
                                    {answers.map((item, index) => (
                                        <Radio value={item} key={index} onClick={() => onClickSelectSuggest(item)}>
                                            {item}
                                        </Radio>
                                    ))}
                                    <Radio value={""} onClick={() => onClickSelectSuggest("")}>Khác</Radio>
                                </Radio.Group>
                            ) : (
                                <div>
                                    {currentStatus && (
                                        <Fragment>
                                            <div className='text-[15px] font-semibold text-center py-5'>
                                                {currentStatus === "DELIVERED"
                                                    ? "Đơn hàng được giao thành công"
                                                    : currentStatus === "RETURNED"
                                                        ? "Trạng thái đơn hàng chưa cập nhật"
                                                        : currentStatus === "CANCELED"
                                                            ? "Trạng thái đơn hàng bị hủy"
                                                            : null}
                                            </div>
                                        </Fragment>
                                    )}
                                </div>
                            )}
                        </div>


                    </div>
                    <div className='col-span-4' hidden={currentStatus === "DELIVERED" || currentStatus === "CANCELED" || currentStatus === "RETURNED"}>
                        <Input
                            placeholder="Nhập nội dung"
                            name="note"
                            width={600}
                            className='!w-full !min-h-12'
                            value={note}
                            onChange={handleInputChange}
                            textArea
                            ref={textareaRef} // Thêm ref vào đây để điều khiển textarea
                            rows={2}
                        />
                    </div>
                </div>
                <div className='flex gap-5 justify-end'>
                    {
                        ActionButton()
                    }
                </div>
            </div>
        );
    };


    return (
        <div className='bg-white p-5 card card-border h-[280px]'>
            {
                selectObject.historyResponseDTOS.length > 0 ? (
                    <Steps current={step} >
                        {
                            selectObject.historyResponseDTOS.map((item, index) => (
                                <Steps.Item key={index} title={item.status} />
                            ))
                        }
                    </Steps>
                ) : (
                    <Steps current={0} >
                        <Steps.Item title={currentStatus} />
                    </Steps>
                )
            }

            <div className=" bg-gray-50 dark:bg-gray-700 rounded">
                <ChangeForPending />
            </div>

        </div>
    )
}






export default OrderStep
