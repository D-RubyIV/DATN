package org.example.demo.mapper.bill.request;

import org.example.demo.dto.requests.BillRequestDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.mapper.IMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BillRequestMapper extends IMapper<Bill, BillRequestDTO> {
}
