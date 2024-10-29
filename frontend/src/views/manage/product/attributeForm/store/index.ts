import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, SalesAttributeListState } from './AttributeFormSlice'
import attributeAddReducer, { SLICE_NAME_ADD_ATTRIBUTE as attributeSliceName, AddAttributeState } from './addAttribute';
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    attributeAdd: attributeAddReducer,
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: SalesAttributeListState
        }
        [attributeSliceName]: {
            attributeAdd: AddAttributeState
        }
    }
> = useSelector
export * from './addAttribute';
export * from './AttributeFormSlice'
export { useAppDispatch } from '@/store'
export default reducer
 