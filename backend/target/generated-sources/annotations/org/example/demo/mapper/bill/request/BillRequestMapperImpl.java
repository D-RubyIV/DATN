package org.example.demo.mapper.bill.request;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.demo.dto.requests.BillRequestDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.entity.bill.properties.History;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-09-12T21:45:14+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Amazon.com Inc.)"
)
@Component
public class BillRequestMapperImpl implements BillRequestMapper {

    @Override
    public Bill toEntity(BillRequestDTO d) {
        if ( d == null ) {
            return null;
        }

        Bill bill = new Bill();

        bill.setCode( d.getCode() );
        bill.setName( d.getName() );
        bill.setAddress( d.getAddress() );
        bill.setPhone( d.getPhone() );
        bill.setDeleted( d.getDeleted() );
        bill.setTotal( d.getTotal() );
        bill.setSubTotal( d.getSubTotal() );
        bill.setOrderDate( d.getOrderDate() );
        List<History> list = d.getHistories();
        if ( list != null ) {
            bill.setHistories( new ArrayList<History>( list ) );
        }

        return bill;
    }

    @Override
    public List<Bill> toListEntity(List<BillRequestDTO> d) {
        if ( d == null ) {
            return null;
        }

        List<Bill> list = new ArrayList<Bill>( d.size() );
        for ( BillRequestDTO billRequestDTO : d ) {
            list.add( toEntity( billRequestDTO ) );
        }

        return list;
    }

    @Override
    public BillRequestDTO toDTO(Bill e) {
        if ( e == null ) {
            return null;
        }

        BillRequestDTO billRequestDTO = new BillRequestDTO();

        billRequestDTO.setCode( e.getCode() );
        billRequestDTO.setName( e.getName() );
        billRequestDTO.setAddress( e.getAddress() );
        billRequestDTO.setPhone( e.getPhone() );
        billRequestDTO.setDeleted( e.getDeleted() );
        billRequestDTO.setTotal( e.getTotal() );
        billRequestDTO.setSubTotal( e.getSubTotal() );
        billRequestDTO.setOrderDate( e.getOrderDate() );
        List<History> list = e.getHistories();
        if ( list != null ) {
            billRequestDTO.setHistories( new ArrayList<History>( list ) );
        }

        return billRequestDTO;
    }

    @Override
    public List<BillRequestDTO> toListDTO(List<Bill> e) {
        if ( e == null ) {
            return null;
        }

        List<BillRequestDTO> list = new ArrayList<BillRequestDTO>( e.size() );
        for ( Bill bill : e ) {
            list.add( toDTO( bill ) );
        }

        return list;
    }
}
