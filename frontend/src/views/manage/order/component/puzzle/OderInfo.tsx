import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import { BillResponseDTO } from '../../store'



const OrderInfo = ({ data }: {data: BillResponseDTO}) => {
    return (
        <Card className="mb-4">
            <h5 className="mb-4">Order #{data.code}</h5>
            <ul>
                <hr className="mb-3" />
                <li className='font-semibold py-1'>Type: {data.type}</li>
                <li className='font-semibold py-1'>Status: {data.status}</li>
            </ul>
        </Card>
    )
}

export default OrderInfo
