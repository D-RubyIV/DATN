package org.example.demo.service.customer.impl;

import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.dto.customer.CustomerMapper;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.repository.customer.AddressRepository;
import org.example.demo.service.customer.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public AddressDTO getAddressById(Integer id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Address not found with ID: " + id));

        return CustomerMapper.toAddressDTO(address);
    }

    @Override
    public AddressDTO updateAddress(Integer id, AddressDTO addressDTO) {
        Address existingAddress = addressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Address not found with ID: " + id));

        // cap nhat cac truong tu DTO vao entity
        existingAddress.setName(addressDTO.getName());
        existingAddress.setPhone(addressDTO.getPhone());
        existingAddress.setProvince(addressDTO.getProvince());
        existingAddress.setDistrict(addressDTO.getDistrict());
        existingAddress.setWard(addressDTO.getWard());
        existingAddress.setDetail(addressDTO.getDetail());
        existingAddress.setDefaultAddress(addressDTO.getIsDefault());

        // luu vao DB
        Address updatedAddress = addressRepository.save(existingAddress);

        return CustomerMapper.toAddressDTO(updatedAddress);
    }

    @Override
    public void deleteAddress(Integer id) {
        addressRepository.deleteById(id);
    }
}
