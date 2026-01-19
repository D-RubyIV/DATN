import TableBasic from "./ui/TableBasic";
import FormComponent from "./ui/FormComponent";
import Details from "./ui/Details";
import React, { useState } from 'react';
import { Button } from "@/components/ui";
import appConfig from '@/configs/app.config';

const ProductManage = () => {
    return (
        <div>
            <FormComponent
                label="SẢN PHẨM"
                childrenArticle={<TableBasic
                    label={[
                        { header: 'Mã', accessorKey: 'code' },
                        { header: 'Tên', accessorKey: 'name' },
                    ]}
                    url={`${appConfig.apiPrefix}/product/overview`}
                    onRowClick={(id) => {
                        console.log('Row clicked with ID:', id);
                    }}
                />}
                childrenNav={
                // <Button >add</Button>
                
                <Details
                    label="SẢN PHẨM"
                    links={[
                        {
                            name: "THÊM SẢN PHẨM",
                            url: "/admin/manage/product/product-new"
                        },
                        {
                            name: "test",
                            url: "/admin/manage/product-list"
                        },
                        {
                            name: "test2",
                            url: "/admin/manage/product/ProductDetail-list/:id"
                        },
                    ]}

                />
            }
            />
        </div>
    );
}
// nham file hsy 

export default ProductManage;