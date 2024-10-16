package org.example.demo.service.customer;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.entity.human.customer.Address;

public interface AddressService {

    AddressDTO getAddressById(Integer id);

    AddressDTO updateAddress(Integer id, AddressDTO addressDTO) throws BadRequestException;

    void deleteAddress(Integer id);
}
