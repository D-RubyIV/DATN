package org.example.demo.mapper.bill.response;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.demo.dto.bill.response.BillResponseDTO;
import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.entity.voucher.Voucher;
import org.example.demo.mapper.customer.response.CustomerResponseMapper;
import org.example.demo.mapper.history.response.HistoryResponseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-09-09T01:19:46+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class BillResponseMapperImpl implements BillResponseMapper {

    @Autowired
    private HistoryResponseMapper historyResponseMapper;
    @Autowired
    private CustomerResponseMapper customerResponseMapper;

    @Override
    public Bill toEntity(BillResponseDTO d) {
        if ( d == null ) {
            return null;
        }

        Bill bill = new Bill();

        bill.setId( d.getId() );
        bill.setCode( d.getCode() );
        bill.setAddress( d.getAddress() );
        bill.setPhone( d.getPhone() );
        bill.setDeleted( d.getDeleted() );
        bill.setTotal( d.getTotal() );
        bill.setSubTotal( d.getSubTotal() );
        bill.setStatus( d.getStatus() );

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

        billResponseDTO.setCustomerResponseDTO( customerResponseMapper.toDTO( e.getCustomer() ) );
        billResponseDTO.setVoucherResponseDTO( voucherToVoucherResponseDTO( e.getVoucher() ) );
        billResponseDTO.setHistoryResponseDTOS( historyResponseMapper.toListDTO( e.getHistories() ) );
        billResponseDTO.setId( e.getId() );
        billResponseDTO.setCode( e.getCode() );
        billResponseDTO.setAddress( e.getAddress() );
        billResponseDTO.setPhone( e.getPhone() );
        billResponseDTO.setDeleted( e.getDeleted() );
        billResponseDTO.setStatus( e.getStatus() );
        billResponseDTO.setTotal( e.getTotal() );
        billResponseDTO.setSubTotal( e.getSubTotal() );

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

    protected VoucherResponseDTO voucherToVoucherResponseDTO(Voucher voucher) {
        if ( voucher == null ) {
            return null;
        }

        VoucherResponseDTO voucherResponseDTO = new VoucherResponseDTO();

        voucherResponseDTO.setCode( voucher.getCode() );
        voucherResponseDTO.setName( voucher.getName() );
        voucherResponseDTO.setQuantity( voucher.getQuantity() );
        voucherResponseDTO.setMinAmount( voucher.getMinAmount() );
        voucherResponseDTO.setMaxPercent( voucher.getMaxPercent() );
        voucherResponseDTO.setTypeTicket( voucher.getTypeTicket() );
        voucherResponseDTO.setStartDate( voucher.getStartDate() );
        voucherResponseDTO.setEndDate( voucher.getEndDate() );
        voucherResponseDTO.setDeleted( voucher.getDeleted() );

        return voucherResponseDTO;
    }
}
