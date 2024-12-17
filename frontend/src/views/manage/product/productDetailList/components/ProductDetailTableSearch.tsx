import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HiOutlineSearch } from 'react-icons/hi';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { FormItem } from '@/components/ui/Form';
import {
    FormAttribute,
    FilterQueries,
    getProductDetails,
    setFilterData,
    useAppSelector,
    useAppDispatch,
    getDataProductDetailQuery
} from '../store';
import type { TableQueries } from '@/@types/common';
import type { ChangeEvent } from 'react';

const handleDebounceFn = debounce((val: string, tableData: any, fetchData: any) => {
    const newTableData = cloneDeep(tableData);
    newTableData.query = val;
    newTableData.pageIndex = 1;
    fetchData(newTableData);
}, 500);

const ProductDetailTableSearch = () => {
    const dispatch = useAppDispatch();
    const searchInput = useRef(null);
    const tableData = useAppSelector(state => state.salesProductDetailList.data.tableData);
    const filterData = useAppSelector(state => state.salesProductDetailList.data.filterData);
    const attributeData = useAppSelector(state => state.datas.DataProductDetailQuery);

    const [isDataInitialized, setIsDataInitialized] = useState(false);
    const [brand, setBrands] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [origin, setOrigins] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [style, setStyles] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [material, setMaterials] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [collar, setCollars] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [sleeve, setSleeves] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [texture, setTextures] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [thicknesse, setThicknesses] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [elasticitie, setElasticities] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [size, setSizes] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [color, setColors] = useState<{ label: string; value: FormAttribute }[]>([]);
    
    
    // const { id } = useParams();
    // const dispatchID = useDispatch();

    // useEffect(() => {
    //     // Using an empty string as a fallback for undefined
    //     dispatch(getDataProductDetailQuery({ productId: id || '' }));
    // }, [id, dispatchID]);
    useEffect(() => {
        if (attributeData && !attributeData.loading && !isDataInitialized) {
            // console.log('Initializing data...');
            initializeData();
        }
    }, [attributeData, isDataInitialized]);



    const fetchData = (data: TableQueries) => {
        const params: FilterQueries = { ...filterData };
        dispatch(getProductDetails({ ...data, filterData: params }));
        dispatch(getProductDetails({ ...data}));
    };

    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        handleDebounceFn(e.target.value, tableData, fetchData);
    };

  

    const initializeData = () => {
        if (isDataInitialized || attributeData.loading) return;  // Đảm bảo không khởi tạo lại nếu đã làm xong

        // Kiểm tra xem dữ liệu có sẵn chưa
        if (attributeData.attributeFormData.length > 0) {
            const combinedData = mapCombinedData(attributeData.attributeFormData);
            setBrands(combinedData.brand);
            setOrigins(combinedData.origin);
            setStyles(combinedData.style);
            setMaterials(combinedData.material);
            setCollars(combinedData.collar);
            setSleeves(combinedData.sleeve);
            setTextures(combinedData.texture);
            setThicknesses(combinedData.thickness);
            setElasticities(combinedData.elasticity);
            setSizes(combinedData.size);
            setColors(combinedData.color);
            setIsDataInitialized(true);
        }
    };

    // Hàm map lại các thuộc tính trong attributeFormData thành options cho Select
    const mapCombinedData = (data: any[]) => {
        const mappedData = {
            brand: mapOptions(data.map(item => item.brand)),
            origin: mapOptions(data.map(item => item.origin)),
            style: mapOptions(data.map(item => item.style)),
            collar: mapOptions(data.map(item => item.collar)),
            sleeve: mapOptions(data.map(item => item.sleeve)),
            thickness: mapOptions(data.map(item => item.thickness)),
            texture: mapOptions(data.map(item => item.texture)),
            elasticity: mapOptions(data.map(item => item.elasticity)),
            color: mapOptions(data.map(item => item.color)),
            size: mapOptions(data.map(item => item.size)),
            material: mapOptions(data.map(item => item.material)),
        };

        return mappedData;
    };


    const mapOptions = (items: any[]) => {
        // Sử dụng filter và map để loại bỏ các phần tử trùng lặp theo thuộc tính 'name' hoặc 'id'
        const uniqueItems = items?.filter((item, index, self) => {
            return self.findIndex(i => i.name === item.name) === index; // Loại bỏ trùng lặp dựa trên 'name'
        }) || [];

        return uniqueItems.map(item => ({
            label: item.name, // Hiển thị tên
            value: item,      // Lưu lại đối tượng nguyên bản nếu cần
        }));
    };


    const handleSelectChange = (selectedValue: string | undefined | '', key: keyof FilterQueries) => {
        const updatedFilterData = { ...filterData, [key]: selectedValue || '' };
        dispatch(setFilterData(updatedFilterData));
        fetchData({ ...tableData, pageIndex: 1 });
    };

    const renderSelectField = (name: keyof FilterQueries, label: string, options: { label: string; value: FormAttribute }[]) => (
        <FormItem label={label}>
            <Select
                isClearable
                options={options}
                size={'sm'}
                onChange={(newOption) => handleSelectChange(newOption?.value?.name, name)}
                placeholder={`Chọn ${label.toLowerCase()}...`}
            />
        </FormItem>
    );

    return (
        <div>
            {/* Tìm kiếm và các trường lọc */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="col-span-1">
                    <FormItem label="Tìm kiếm">
                        <Input
                            ref={searchInput}
                            className="max-w-md md:w-65 md:mb-0 mb-4"
                            size="sm"
                            placeholder="Tìm kiếm theo mã, tên...."
                            prefix={<HiOutlineSearch className="text-lg" />}
                            onChange={onEdit}
                        />
                    </FormItem>
                </div>
                {renderSelectField('brand', 'Thương hiệu', brand)}
                {renderSelectField('origin', 'Xuất xứ', origin)}
                {renderSelectField('style', 'Kiểu dáng', style)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {renderSelectField('material', 'Chất liệu', material)}
                {renderSelectField('collar', 'Kiểu cổ áo', collar)}
                {renderSelectField('sleeve', 'KIểu tay áo', sleeve)}
                {renderSelectField('texture', 'Kết cấu', texture)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {renderSelectField('thickness', 'Độ dày', thicknesse)}
                {renderSelectField('elasticity', 'Độ co giãn', elasticitie)}
                {renderSelectField('color', 'Màu sắc', color)}
                {renderSelectField('size', 'Kích thước', size)}
            </div>
        </div>
    );
};

export default ProductDetailTableSearch;
