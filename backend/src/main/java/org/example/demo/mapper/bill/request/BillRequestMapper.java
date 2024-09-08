package org.example.demo.mapper.bill.request;

import org.example.demo.dto.bill.request.BillRequestDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.mapper.IMapperBasic;
import org.example.demo.mapper.customer.request.CustomerRequestMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {CustomerRequestMapper.class})
public interface BillRequestMapper extends IMapperBasic<Bill, BillRequestDTO> {

}
