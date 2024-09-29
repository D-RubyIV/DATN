import { Fragment, useEffect, useState, useRef } from 'react'
import Steps from '@/components/ui/Steps'
import { Button, Input, Radio } from '@/components/ui'
import { BillResponseDTO, EBillStatus } from '../../store'
import { HiPlusCircle } from 'react-icons/hi'
import Axios from 'axios'



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
        {
            "status": "DELIVERED",
            "messages": [
                "Xác nhận đơn hàng đã được giao thành công",
            ]
        },
        {
            "status": "CANCELED",
            "messages": [
                "Xác nhận đơn hàng đã bị hủy"
            ]
        },
        {
            "status": "RETURNED",
            "messages": [
                "Xác nhận đơn hàng đã trả lại"
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
        Axios.put(`http://localhost:8080/api/v1/orders/status/change/${selectObject.id}`, data).then(function (response) {
            fetchData()
        })
    }

    const ActionButton = () => {
        if (currentStatus === "PENDING") {
            return (
                <div>
                    <Button block variant="solid" size="sm" className='bg-indigo-500 !w-auto' icon={<HiPlusCircle />} onClick={() => submitChangeStatus('TORECEIVE')}> Confirm</Button>
                    <Button block variant="default" size="sm" className='bg-indigo-500 !w-32' icon={<HiPlusCircle />}>Cancelled</Button>
                </div>
            )
        }
        else if (currentStatus === "TORECEIVE") {
            return (
                <div>
                    <Button block variant="solid" size="sm" className='bg-indigo-500 !w-auto' icon={<HiPlusCircle />} onClick={() => submitChangeStatus('TOSHIP')}> Confirm</Button>
                    <Button block variant="default" size="sm" className='bg-indigo-500 !w-32' icon={<HiPlusCircle />}>Cancelled</Button>
                </div>
            )
        }
        else if (currentStatus === "TOSHIP") {
            return (
                <div>
                    <Button block variant="solid" size="sm" className='bg-indigo-500 !w-auto' icon={<HiPlusCircle />} onClick={() => submitChangeStatus('DELIVERED')}> Confirm</Button>
                    <Button block variant="default" size="sm" className='bg-indigo-500 !w-32' icon={<HiPlusCircle />}>Cancelled</Button>
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
                                        <Radio value={item} key={index} onClick={() => onClickSelectSuggest(item)}>{item}</Radio>
                                    ))}
                                    <Radio value={""} onClick={() => onClickSelectSuggest("")}>Khác</Radio>
                                </Radio.Group>
                            ) : (
                                <div>Không có câu trả lời gợi ý nào</div>
                            )}
                        </div>
                    </div>
                    <div className='col-span-4'>
                        <Input
                            placeholder="Invalid text area"
                            name="note"
                            width={600}
                            className='!w-full'
                            value={note}
                            onChange={handleInputChange}
                            textArea
                            ref={textareaRef} // Thêm ref vào đây để điều khiển textarea
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
        <div className='bg-white p-5 card card-border'>
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
