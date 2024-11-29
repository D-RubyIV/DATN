import { Fragment } from 'react'
import Button from '@/components/ui/Button'

const TypeOrderFormat = ({status}: {status: string}) => {
    return (
        <Fragment>
            <Button
                size="xs"
                variant="plain"
            >

                    <span
                        className={`flex items-center font-bold ${status=== 'INSTORE' ? 'text-green-600' : 'text-red-600'}`}>
                        <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${status === 'INSTORE' ? 'bg-green-600' : 'bg-red-600'}`}
                        ></span>
                        <span>
                            <p>
                                {status === 'INSTORE'
                                    ? 'Tại của hàng'
                                    : status === 'ONLINE'
                                        ? 'Giao hàng'
                                        : 'Không xác định'}
                            </p>
                        </span>
                    </span>
            </Button>
        </Fragment>
    )
}
export default TypeOrderFormat;