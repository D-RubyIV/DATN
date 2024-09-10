package org.example.demo.mapper.staff.response;

import org.example.demo.dto.customer.response.CustomerResponseDTO;
import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StaffResponseMapper extends IMapperBasic<Staff, StaffResponseDTO> {

}
