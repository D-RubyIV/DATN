package org.example.demo.mapper.bill.response;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.demo.dto.response.bill.BillResponseDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.entity.bill.properties.History;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-09-13T17:39:38+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Amazon.com Inc.)"
)
@Component
public class BillResponseMapperImpl implements BillResponseMapper {

    @Override
    public Bill toEntity(BillResponseDTO d) {
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
    public List<Bill> toListEntity(List<BillResponseDTO> d) {
        if ( d == null ) {
            return null;
        }

        List<Bill> list = new ArrayList<Bill>( d.size() );
        for ( BillResponseDTO billResponseDTO : d ) {
            list.add( toEntity( billResponseDTO ) );
        }

        return list;
    }

    @Override
    public BillResponseDTO toDTO(Bill e) {
        if ( e == null ) {
            return null;
        }

        BillResponseDTO billResponseDTO = new BillResponseDTO();

        billResponseDTO.setCode( e.getCode() );
        billResponseDTO.setName( e.getName() );
        billResponseDTO.setAddress( e.getAddress() );
        billResponseDTO.setPhone( e.getPhone() );
        billResponseDTO.setDeleted( e.getDeleted() );
        billResponseDTO.setTotal( e.getTotal() );
        billResponseDTO.setSubTotal( e.getSubTotal() );
        billResponseDTO.setOrderDate( e.getOrderDate() );
        List<History> list = e.getHistories();
        if ( list != null ) {
            billResponseDTO.setHistories( new ArrayList<History>( list ) );
        }

        return billResponseDTO;
    }

    @Override
    public List<BillResponseDTO> toListDTO(List<Bill> e) {
        if ( e == null ) {
            return null;
        }

        List<BillResponseDTO> list = new ArrayList<BillResponseDTO>( e.size() );
        for ( Bill bill : e ) {
            list.add( toDTO( bill ) );
        }

        return list;
    }
}
