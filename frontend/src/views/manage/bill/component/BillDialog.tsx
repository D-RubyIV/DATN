import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import BillTimeLine from './BIllTimeLine';

interface IProps {
    dialogIsOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;  // Sửa kiểu hàm setIsOpen
}

const BillDialog = ({ dialogIsOpen, setIsOpen }: IProps) => {

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Dialog
                isOpen={dialogIsOpen}
                width={1200}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
             className="fixed inset-0 m-auto p-10 -tran"
            >
                <div className="flex flex-col h-full justify-between">
                    <h5 className="mb-4">Dialog Title</h5>

                    <BillTimeLine></BillTimeLine>
                    <p>
                        There are many variations of passages of Lorem Ipsum
                        available, but the majority have suffered alteration in
                        some form, by injected humour, or randomised words which
                        don't look even slightly believable.
                    </p>
                    <div className="text-right mt-6">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="plain"
                            onClick={onDialogClose}
                        >
                            Cancel
                        </Button>
                        <Button variant="solid" onClick={onDialogOk}>
                            Okay
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default BillDialog
