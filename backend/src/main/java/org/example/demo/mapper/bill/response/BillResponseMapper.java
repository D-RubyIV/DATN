package org.example.demo.mapper.bill.response;

import org.example.demo.dto.bill.response.BillResponseDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.mapper.customer.response.CustomerResponseMapper;
import org.example.demo.mapper.history.response.HistoryResponseMapper;
import org.example.demo.mapper.staff.response.StaffResponseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@Mapper(componentModel = "spring", uses = {HistoryResponseMapper.class, CustomerResponseMapper.class, StaffResponseMapper.class})
public interface BillResponseMapper{
    Bill toEntity(BillResponseDTO d);
    List<Bill> toListEntity(List<BillResponseDTO> d);


    @Mapping(target = "staffResponseDTO", source = "staff")
    @Mapping(target = "customerResponseDTO", source = "customer")
    @Mapping(target = "voucherResponseDTO", source = "voucher")
    @Mapping(target = "historyResponseDTOS", source = "histories")
    @Mapping(target = "staffName", source = "staff.name")
    BillResponseDTO toDTO(Bill e);
    List<BillResponseDTO> toListDTO(List<Bill> e);
//    ddau ra - dau vao
//    target 0- source
//   staffResponseDTO  <- staff


}
