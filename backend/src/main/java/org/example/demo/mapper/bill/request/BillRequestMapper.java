package org.example.demo.mapper.bill.request;

import org.example.demo.dto.bill.request.BillRequestDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.mapper.IMapperBasic;
import org.example.demo.mapper.customer.request.CustomerRequestMapper;
import org.mapstruct.Mapper;
/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@Mapper(componentModel = "spring", uses = {CustomerRequestMapper.class})
public interface BillRequestMapper extends IMapperBasic<Bill, BillRequestDTO> {

}
