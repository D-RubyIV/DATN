import { useRef, useEffect, useState } from 'react';
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
    getBrandData,
    getOriginData,
    getStyleData,
    getCollarData,
    getSleeveData,
    getThicknessData,
    getTextureData,
    getElasticityData,
    getColorData,
    getSizeData,
    getMaterialData,
    setFilterData,
    useAppSelector,
    useAppDispatch,
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
    const attributeData = useAppSelector(state => state.atrributeList.attribute);

    const [isDataInitialized, setIsDataInitialized] = useState(false);
    const [brands, setBrands] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [origins, setOrigins] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [styles, setStyles] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [materials, setMaterials] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [collars, setCollars] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [sleeves, setSleeves] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [textures, setTextures] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [thicknesses, setThicknesses] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [elasticities, setElasticities] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [sizes, setSizes] = useState<{ label: string; value: FormAttribute }[]>([]);
    const [colors, setColors] = useState<{ label: string; value: FormAttribute }[]>([]);

    useEffect(() => {
        fetchAttributeData();
    }, []);
    useEffect(() => {
        if (attributeData && !attributeData.loading && !isDataInitialized) {
            // console.log('Initializing data...');
            initializeData();
        }
    }, [attributeData, isDataInitialized]);



    const fetchData = (data: TableQueries) => {
        const params: FilterQueries = { ...filterData };
        dispatch(getProductDetails({ ...data, filterData: params }));
    };

    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        handleDebounceFn(e.target.value, tableData, fetchData);
    };

    const fetchAttributeData = () => {
        dispatch(getBrandData());
        dispatch(getOriginData());
        dispatch(getStyleData());
        dispatch(getCollarData());
        dispatch(getSleeveData());
        dispatch(getThicknessData());
        dispatch(getTextureData());
        dispatch(getElasticityData());
        dispatch(getColorData());
        dispatch(getSizeData());
        dispatch(getMaterialData());
    };

    const initializeData = () => {
        if (isDataInitialized) return;
        // console.log('Initializing data...');
        const combinedData = mapCombinedData(attributeData);
        console.log(combinedData);
        setBrands(combinedData.brands);
        setOrigins(combinedData.origins);
        setStyles(combinedData.styles);
        setMaterials(combinedData.materials);
        setCollars(combinedData.collars);
        setSleeves(combinedData.sleeves);
        setTextures(combinedData.textures);
        setThicknesses(combinedData.thicknesses);
        setElasticities(combinedData.elasticities);
        setSizes(combinedData.sizes);
        setColors(combinedData.colors);
        setIsDataInitialized(true);
    };



    const mapCombinedData = (data: any) => {
        const mappedData = {
            brands: mapOptions(data.brandData),
            origins: mapOptions(data.originData),
            styles: mapOptions(data.styleData),
            collars: mapOptions(data.collarData),
            sleeves: mapOptions(data.sleeveData),
            thicknesses: mapOptions(data.thicknessData),
            textures: mapOptions(data.textureData),
            elasticities: mapOptions(data.elasticityData),
            colors: mapOptions(data.colorData),
            sizes: mapOptions(data.sizeData),
            materials: mapOptions(data.materialData),
        };
        // console.log('Mapped Data:', mappedData);
        return mappedData;
    };


    const mapOptions = (items: FormAttribute[] | undefined) => {
        return items?.map(item => ({ label: item.name, value: item })) || [];
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
                {renderSelectField('brand', 'Thương hiệu', brands)}
                {renderSelectField('origin', 'Xuất xứ', origins)}
                {renderSelectField('style', 'Kiểu dáng', styles)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {renderSelectField('material', 'Chất liệu', materials)}
                {renderSelectField('collar', 'Kiểu cổ áo', collars)}
                {renderSelectField('sleeve', 'KIểu tay áo', sleeves)}
                {renderSelectField('texture', 'Kết cấu', textures)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {renderSelectField('thickness', 'Độ dày', thicknesses)}
                {renderSelectField('elasticity', 'Độ co giãn', elasticities)}
                {renderSelectField('color', 'Màu sắc', colors)}
                {renderSelectField('size', 'Kích thước', sizes)}
            </div>
        </div>
    );
};

export default ProductDetailTableSearch;
