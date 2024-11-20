import { Fragment, useEffect, useState, useRef } from 'react'
import Steps from '@/components/ui/Steps'
import { Button, Dialog, Input, Radio } from '@/components/ui'
import { OrderResponseDTO, EOrderStatus } from '@/@types/order'
import { HiPlusCircle } from 'react-icons/hi'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'


type ExampleAnswers = {
    status: EOrderStatus;
    messages: string[];
}


type HistoryDTO = {
    note: string
}


const OrderStep = ({ selectObject, fetchData }: { selectObject: OrderResponseDTO, fetchData: () => Promise<void> }) => {

    const { openNotification } = useToastContext()

    const validationSchema = Yup.object({
        note: Yup.string().required('Vui lòng nhập nội dung').min(5, 'Nội dung phải có ít nhất 5 ký tự'),
    })
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue: setNoteValue,
    } = useForm<HistoryDTO>({
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })
    useEffect(() => {
        setNoteValue('note',"")
    }, [])

    const textareaRef = useRef<HTMLTextAreaElement>(null); // Khai báo ref độc lập

    const focusTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.focus(); // Gọi focus trên DOM node
        }
    };

    const [currentStatus, setCurrentStatus] = useState<EOrderStatus>(selectObject.status)

    const exampleAnswers: ExampleAnswers[] = [
        {
            'status': 'PENDING',
            'messages': [
                'Xác nhận đơn hàng'
            ]
        },
        {
            'status': 'TOSHIP',
            'messages': [
                'Xác nhận đơn hàng đang được vận chuyển'
            ]
        },
        {
            'status': 'TORECEIVE',
            'messages': [
                'Xác nhận hoàn thành đơn hàng'
            ]
        }
    ]

    const [dialogIsOpenCancelOnlineOrder, setIsOpenCancelOnlineOrder] = useState(false)

    const onDialogClose = () => {
        setIsOpenCancelOnlineOrder(false)
    }

    const onDialogOk = () => {
        setIsOpenCancelOnlineOrder(false)
    }


    useEffect(() => {
        setCurrentStatus(selectObject.status)
        console.log('Current status: ', selectObject.status)
    }, [selectObject])


    const onClickSelectSuggest = (value: string) => {
        console.log(value)
        setNoteValue('note', value)
    }

    const onChangeNote = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoteValue('note', e.target.value) // Cập nhật giá trị trong form
    }
    const submitChangeStatus = (status: EOrderStatus) => {
        const data = {
            'status': status,
            'note': getValues('note')
        }
        instance.put(`/orders/status/change/${selectObject.id}`, data).then(function() {
            fetchData()
            setNoteValue('note','')
        }).catch(function(error) {
            console.log('-----')
            console.log(error.response)
            if (error?.response?.data?.error) {
                openNotification(error?.response?.data?.error, "Thông báo", "warning", 5000)
            }
        })
    }

    const ActionButton = () => {
        if (currentStatus === 'PENDING') {
            return (
                <div className="flex gap-2">
                    <Button block variant="solid" size="sm" className="bg-indigo-500 !w-auto" icon={<HiPlusCircle />}
                            onClick={handleSubmit(() => submitChangeStatus('TOSHIP'))}>Xác nhận vận chuyển</Button>
                    {
                        selectObject.payment === "TRANSFER" && selectObject.type === "ONLINE" ?
                            (
                                <Button block variant="default" size="sm" className="bg-indigo-500" icon={<HiPlusCircle />}
                                        onClick={handleSubmit(() => setIsOpenCancelOnlineOrder(true))}>Hủy đơn đã thanh toán</Button>
                            )
                            :(
                                <Button block variant="default" size="sm" className="bg-indigo-500 !w-32" icon={<HiPlusCircle />}
                                        onClick={handleSubmit(() => submitChangeStatus('CANCELED'))}>Hủy đơn hàng</Button>
                            )
                    }

                </div>
            )
        } else if (currentStatus === 'TOSHIP') {
            return (
                <div className="flex gap-2">
                    <Button block variant="solid" size="sm" className="bg-indigo-500 !w-auto" icon={<HiPlusCircle />}
                            onClick={handleSubmit(() => submitChangeStatus('TORECEIVE'))}>Xác nhận </Button>
                    <Button block variant="default" size="sm" className="bg-indigo-500 !w-auto" icon={<HiPlusCircle />}
                            onClick={handleSubmit(() => submitChangeStatus('PENDING'))}>Quay lại chờ xác nhận</Button>
                </div>
            )
        } else if (currentStatus === 'TORECEIVE') {
            return (
                <div className="flex gap-2">
                    <Button block variant="solid" size="sm" className="bg-indigo-500 !w-auto" icon={<HiPlusCircle />}
                            onClick={handleSubmit(() => submitChangeStatus('DELIVERED'))}>Xác nhận hoàn thành</Button>
                </div>
            )
        } else if (currentStatus === 'DELIVERED') {
            return (
                <div className="flex gap-2">
                    {/* <Button block variant="solid" size="sm" className='bg-indigo-500 !w-auto' icon={<HiPlusCircle />} onClick={() => submitChangeStatus('DELIVERED')}> Confirm</Button>
                    <Button block variant="default" size="sm" className='bg-indigo-500 !w-32' icon={<HiPlusCircle />}>Cancelled</Button> */}
                </div>
            )
        }
    }

    const ChangeForPending = () => {
        const answers = exampleAnswers.find(s => s.status === selectObject.status)?.messages

        return (
            <div>
                <div className="mb-4">
                    <div className="">
                        <div className="mt-4">
                            {answers && answers.length > 0 ? (
                                <Radio.Group vertical value={getValues('note')}>
                                    {answers.map((item, index) => (
                                        <Radio value={item} key={index} onClick={() => onClickSelectSuggest(item)}>
                                            {item}
                                        </Radio>
                                    ))}
                                    <Radio value={''} onClick={() => onClickSelectSuggest('')}>Khác</Radio>
                                </Radio.Group>
                            ) : (
                                <div>
                                    {currentStatus && (
                                        <Fragment>
                                            <div className="text-[15px] font-semibold text-center py-5">
                                                {currentStatus === 'DELIVERED'
                                                    ? 'Đơn hàng được giao thành công'
                                                    : currentStatus === 'RETURNED'
                                                        ? 'Trạng thái đơn hàng chưa cập nhật'
                                                        : currentStatus === 'CANCELED'
                                                            ? 'Trạng thái đơn hàng bị hủy'
                                                            : null}
                                            </div>
                                        </Fragment>
                                    )}
                                </div>
                            )}
                        </div>


                    </div>
                    <div className="col-span-4"
                         hidden={currentStatus === 'DELIVERED' || currentStatus === 'CANCELED' || currentStatus === 'RETURNED'}>
                        <Input
                            placeholder="Nhập nội dung"
                            {...register('note')}
                            textArea
                            width={600}
                            className="!w-full !min-h-12"
                            rows={2}
                            onFocus={focusTextarea} // Đảm bảo focus khi cần
                            onChange={onChangeNote} // Đảm bảo cập nhật giá trị trong form khi nhập
                        />
                        {errors.note && (
                            <p className="text-red-500 text-sm mt-2">{errors.note.message}</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-5 justify-end">
                    {
                        ActionButton()
                    }
                </div>
            </div>
        )
    }


    return (
        <div className="bg-white p-5 card card-border min-h-[320px] h-auto">
           <div className={'max-w-full py-5 overflow-auto'}>
               {
                   selectObject.historyResponseDTOS.length > 0 ? (
                       <Steps current={selectObject.historyResponseDTOS.length}>
                           {
                               selectObject.historyResponseDTOS.map((item, index) => (
                                   <Steps.Item key={index} title={item.status} className={'pr-10'}/>
                               ))
                           }
                       </Steps>
                   ) : (
                       <Steps current={0}>
                           <Steps.Item title={currentStatus} />
                       </Steps>
                   )
               }
           </div>
            <div className="dark:bg-gray-700 rounded">
                <ChangeForPending />
            </div>
            <Dialog
                isOpen={dialogIsOpenCancelOnlineOrder}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">Nhập mã giao dịch</h5>
                <div>
                    <Input placeholder={'Vui lòng nhập mã giao dịch'}></Input>
                </div>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={ onDialogClose}
                    >
                        Hủy
                    </Button>
                    <Button variant="solid" onClick={() => onDialogOk}>
                        Xác nhận
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}


export default OrderStep
