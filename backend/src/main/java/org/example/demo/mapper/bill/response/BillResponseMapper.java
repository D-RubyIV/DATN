package org.example.demo.mapper.bill.response;

import org.example.demo.dto.bill.response.BillResponseDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.mapper.customer.response.CustomerResponseMapper;
import org.example.demo.mapper.history.response.HistoryResponseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {HistoryResponseMapper.class, CustomerResponseMapper.class})
public interface BillResponseMapper{
    Bill toEntity(BillResponseDTO d);
    List<Bill> toListEntity(List<BillResponseDTO> d);


    @Mapping(target = "customerResponseDTO", source = "customer")
    @Mapping(target = "voucherResponseDTO", source = "voucher")
    @Mapping(target = "historyResponseDTOS", source = "histories")
    BillResponseDTO toDTO(Bill e);
    List<BillResponseDTO> toListDTO(List<Bill> e);
}
