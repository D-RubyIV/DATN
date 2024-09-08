package org.example.demo.mapper.bill.response;

import org.example.demo.dto.response.bill.BillResponseDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.mapper.IMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BillResponseMapper extends IMapper<Bill, BillResponseDTO> {
}
