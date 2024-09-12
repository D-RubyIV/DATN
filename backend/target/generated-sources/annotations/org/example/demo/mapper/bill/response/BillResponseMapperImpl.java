package org.example.demo.mapper.bill.response;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.demo.dto.bill.response.BillOverviewResponseDTO;
import org.example.demo.dto.bill.response.BillResponseDTO;
import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.mapper.customer.response.CustomerResponseMapper;
import org.example.demo.mapper.history.response.HistoryResponseMapper;
import org.example.demo.mapper.staff.response.StaffResponseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-09-13T00:07:20+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class BillResponseMapperImpl implements BillResponseMapper {

    @Autowired
    private HistoryResponseMapper historyResponseMapper;
    @Autowired
    private CustomerResponseMapper customerResponseMapper;
    @Autowired
    private StaffResponseMapper staffResponseMapper;

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
        bill.setType( d.getType() );
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

        billResponseDTO.setStaffResponseDTO( staffResponseMapper.toDTO( e.getStaff() ) );
        billResponseDTO.setCustomerResponseDTO( customerResponseMapper.toDTO( e.getCustomer() ) );
        billResponseDTO.setVoucherResponseDTO( voucherToVoucherResponseDTO( e.getVoucher() ) );
        billResponseDTO.setHistoryResponseDTOS( historyResponseMapper.toListDTO( e.getHistories() ) );
        billResponseDTO.setId( e.getId() );
        billResponseDTO.setCode( e.getCode() );
        billResponseDTO.setAddress( e.getAddress() );
        billResponseDTO.setPhone( e.getPhone() );
        billResponseDTO.setDeleted( e.getDeleted() );
        billResponseDTO.setStatus( e.getStatus() );
        billResponseDTO.setType( e.getType() );
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

    @Override
    public BillOverviewResponseDTO toOverViewDTO(Bill e) {
        if ( e == null ) {
            return null;
        }

        BillOverviewResponseDTO billOverviewResponseDTO = new BillOverviewResponseDTO();

        billOverviewResponseDTO.setCustomerName( eCustomerName( e ) );
        billOverviewResponseDTO.setStaffName( eStaffName( e ) );
        billOverviewResponseDTO.setId( e.getId() );
        billOverviewResponseDTO.setCode( e.getCode() );
        billOverviewResponseDTO.setAddress( e.getAddress() );
        billOverviewResponseDTO.setPhone( e.getPhone() );
        billOverviewResponseDTO.setDeleted( e.getDeleted() );
        billOverviewResponseDTO.setStatus( e.getStatus() );
        billOverviewResponseDTO.setType( e.getType() );
        billOverviewResponseDTO.setTotal( e.getTotal() );
        billOverviewResponseDTO.setSubTotal( e.getSubTotal() );

        return billOverviewResponseDTO;
    }

    @Override
    public List<BillOverviewResponseDTO> toListOverViewDTO(List<Bill> e) {
        if ( e == null ) {
            return null;
        }

        List<BillOverviewResponseDTO> list = new ArrayList<BillOverviewResponseDTO>( e.size() );
        for ( Bill bill : e ) {
            list.add( toOverViewDTO( bill ) );
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
        if ( voucher.getTypeTicket() != null ) {
            voucherResponseDTO.setTypeTicket( voucher.getTypeTicket().name() );
        }
        voucherResponseDTO.setStartDate( voucher.getStartDate() );
        voucherResponseDTO.setEndDate( voucher.getEndDate() );
        voucherResponseDTO.setDeleted( voucher.getDeleted() );

        return voucherResponseDTO;
    }

    private String eCustomerName(Bill bill) {
        if ( bill == null ) {
            return null;
        }
        Customer customer = bill.getCustomer();
        if ( customer == null ) {
            return null;
        }
        String name = customer.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private String eStaffName(Bill bill) {
        if ( bill == null ) {
            return null;
        }
        Staff staff = bill.getStaff();
        if ( staff == null ) {
            return null;
        }
        String name = staff.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
