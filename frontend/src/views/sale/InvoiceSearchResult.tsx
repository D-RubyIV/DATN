import React, {Fragment, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import instance from "@/axios/CustomAxios";
import {OrderResponseDTO} from "@/@types/order";

const InvoiceSearchResult = () => {
    const {idOrder} = useParams();
    const [orderResponseDTO, setOrderResponseDTO] = useState<OrderResponseDTO>()

    const getDetailOrder = () => {
        instance.get(`orders/${idOrder}`).then(function (response) {
            console.log(response)
            if(response.status === 200 && response.data){
                setOrderResponseDTO(response.data)
            }
        })
    }

    useEffect(() => {
        console.log("ID ORDER: ", idOrder)
        getDetailOrder()
    }, []);

    return (
        <Fragment>

        </Fragment>
    );
};

export default InvoiceSearchResult;
