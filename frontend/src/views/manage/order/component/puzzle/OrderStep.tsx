

import { useState } from 'react'
import Steps from '@/components/ui/Steps'
import { Button } from '@/components/ui'



const OrderStep = () => {
    const [step, setStep] = useState(0)

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

    return (
        <div>
            <Steps current={step} >
                <Steps.Item title="PENDING" />
                <Steps.Item title="TOSHIP" />
                <Steps.Item title="TORECEIVE" />
                <Steps.Item title="RETURNED" />
            </Steps>
            {/* <div className="mt-6 h-40 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-center">
                <h6>Step {`${step + 1}`} content</h6>
            </div> */}
            <div className="mt-4 text-right">
                <Button
                    className="mx-2"
                    disabled={step === 0}
                    onClick={onPrevious}
                >
                    Previous
                </Button>
                <Button disabled={step === 8} variant="solid" onClick={onNext}>
                    {step === 8 ? 'Completed' : 'Next'}
                </Button>
            </div>
        </div>
    )
}
export default OrderStep

