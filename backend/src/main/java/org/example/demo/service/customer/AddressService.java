package org.example.demo.service.customer;

import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.entity.human.customer.Address;

public interface AddressService {

    AddressDTO getAddressById(Integer id);

    AddressDTO updateAddress(Integer id, AddressDTO addressDTO);

    void deleteAddress(Integer id);
}
