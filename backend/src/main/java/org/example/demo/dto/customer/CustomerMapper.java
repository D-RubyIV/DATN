package org.example.demo.dto.customer;

import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;

import java.util.List;
import java.util.stream.Collectors;

public class CustomerMapper {

    public static CustomerListDTO toDTO(Customer customer) {
        // Ánh xạ danh sách Address sang AddressDTO
        List<AddressDTO> addressDTOList = customer.getAddresses().stream().map(address ->
                new AddressDTO(
                        address.getId(),
                        address.getPhone(),
                        address.getName(),
                        address.getProvince(),
                        address.getDistrict(),
                        address.getWard(),
                        address.getDetail()
                )
        ).collect(Collectors.toList());

        return new CustomerListDTO(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getGender(),
                customer.getBirthDate(),
                addressDTOList,
                customer.getStatus()

        );
    }

}
