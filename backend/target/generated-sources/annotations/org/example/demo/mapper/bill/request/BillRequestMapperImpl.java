package org.example.demo.mapper.bill.request;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.demo.dto.bill.request.BillRequestDTO;
import org.example.demo.entity.bill.core.Bill;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-09-30T10:35:01+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.40.0.v20240919-1711, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class BillRequestMapperImpl implements BillRequestMapper {

    @Override
    public Bill toEntity(BillRequestDTO d) {
        if ( d == null ) {
            return null;
        }

        Bill bill = new Bill();

        bill.setAddress( d.getAddress() );
        bill.setCode( d.getCode() );
        bill.setCustomer( d.getCustomer() );
        bill.setDeleted( d.getDeleted() );
        bill.setPhone( d.getPhone() );
        bill.setStatus( d.getStatus() );
        bill.setSubTotal( d.getSubTotal() );
        bill.setTotal( d.getTotal() );
        bill.setVoucher( d.getVoucher() );

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

        billRequestDTO.setAddress( e.getAddress() );
        billRequestDTO.setCode( e.getCode() );
        billRequestDTO.setCustomer( e.getCustomer() );
        billRequestDTO.setDeleted( e.getDeleted() );
        billRequestDTO.setPhone( e.getPhone() );
        billRequestDTO.setStatus( e.getStatus() );
        billRequestDTO.setSubTotal( e.getSubTotal() );
        billRequestDTO.setTotal( e.getTotal() );
        billRequestDTO.setVoucher( e.getVoucher() );

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
