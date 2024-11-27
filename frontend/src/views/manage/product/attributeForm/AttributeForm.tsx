import AttributeTable from './components/AttributeTable';
import AttributeTableTools from './components/AttributeTableTools'
import reducer from './store'
import { injectReducer } from '@/store'
injectReducer('salesAttributeList', reducer)

type AttributeFormProps = {
    lablel:string;
    apiFunc: any;
    apiDelete:any;
    apiAdd:any
};

const AttributeForm = ({ apiFunc, lablel, apiDelete, apiAdd }: AttributeFormProps) => {
    return ( 

        <div className="bg-white h-full">
            <div className="p-8 shadow-md rounded-md card h-full card-border">
                <h1 className="font-semibold text-xl mb-4 text-transform: uppercase">Quản lý {lablel}</h1>
                <div className='mb-5 mt-6'>
                    <AttributeTableTools apiFunc={apiFunc} lablel={lablel} apiAdd={apiAdd}/>
                </div>
                <AttributeTable apiFunc={apiFunc} apiDelete={apiDelete} lablel={lablel} />
            </div>
        </div>
    );
};

export default AttributeForm;
 