

import { useState } from 'react'
import Steps from '@/components/ui/Steps'



const OrderStep = () => {
    return (
        <div className="mb-6">
            <Steps vertical current={1}>
                <Steps.Item title="Login" description="Login to your account" />
                <Steps.Item
                    title="Place Order"
                    description="Start placing an order"
                />
                <Steps.Item
                    title="In Review"
                    description="We will review the order"
                />
                <Steps.Item title="Approved" description="Order approved" />
            </Steps>
        </div>
    )
}
export default OrderStep

