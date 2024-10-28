package org.example.demo.dto.customer;

import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CustomerMapper {

    public static CustomerListDTO toCustomerListDTO(Customer customer) {
        Address defaultAddress = customer.getAddresses().stream()
                .filter(Address::getDefaultAddress)
                .findFirst()// lay dia chi dau tien lam mac dinh khi cung tra ve true
                .orElse(null);

        AddressDTO defaultAddressDTO = defaultAddress != null ? toAddressDTO(defaultAddress) : null;

        return new CustomerListDTO(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getGender(),
                customer.getBirthDate(),
                defaultAddressDTO,
                customer.getStatus()
        );
    }

    public static Customer toEntityCustomer(CustomerDetailDTO dto) {
        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setCode(dto.getCode());
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setGender(dto.getGender());
        customer.setBirthDate(dto.getBirthDate());
        customer.setStatus(dto.getStatus());

        List<Address> addresses = dto.getAddressDTOS().stream()
                .map(CustomerMapper::toEntityAddress)
                .collect(Collectors.toList());
        customer.setAddresses(addresses);

        return customer;
    }

    public static CustomerDetailDTO toCustomerDetailDTO(Customer customer) {
        CustomerDetailDTO dto = new CustomerDetailDTO();
        dto.setId(customer.getId());
        dto.setCode(customer.getCode());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setGender(customer.getGender());
        dto.setBirthDate(customer.getBirthDate());
        dto.setStatus(customer.getStatus());

        if (customer.getAddresses() != null) {
            List<AddressDTO> addressDTOS = customer.getAddresses().stream()
                    .map(CustomerMapper::toAddressDTO)
                    .collect(Collectors.toList());
            dto.setAddressDTOS(addressDTOS);
        }

        return dto;
    }

    public static void updateCustomerFromDTO(CustomerDetailDTO dto, Customer customer) {
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setGender(dto.getGender());
        customer.setBirthDate(dto.getBirthDate());
        customer.setStatus(dto.getStatus());

        if (dto.getCode() != null) {
            customer.setCode(dto.getCode());
        }

        // Cập nhật danh sách địa chỉ
        if (dto.getAddressDTOS() != null) {
            for (AddressDTO addressDTO : dto.getAddressDTOS()) {
                // Tìm địa chỉ tương ứng trong customer hiện tại
                Address existingAddress = customer.getAddresses().stream()
                        .filter(address -> address.getId().equals(addressDTO.getId()))
                        .findFirst().orElse(null);

                if (existingAddress != null) {
                    // Cập nhật địa chỉ hiện có
                    updateAddressFromDTO(addressDTO, existingAddress);
                } else {
                    // Thêm địa chỉ mới nếu không tồn tại
                    Address newAddress = toEntityAddress(addressDTO);
                    newAddress.setCustomer(customer); // Set the customer on the new address
                    customer.getAddresses().add(newAddress);
                }
            }
        }
    }

    public static void updateAddressFromDTO(AddressDTO dto, Address address) {
        address.setName(dto.getName());
        address.setPhone(dto.getPhone());
        address.setProvince(dto.getProvince());
        address.setDistrict(dto.getDistrict());
        address.setWard(dto.getWard());
        address.setDetail(dto.getDetail());
        address.setDefaultAddress(dto.getIsDefault());
    }

    public static Address toEntityAddress(AddressDTO dto) {
        Address address = new Address();
        address.setId(dto.getId());
        address.setName(dto.getName());
        address.setPhone(dto.getPhone());
        address.setProvince(dto.getProvince());
        address.setDistrict(dto.getDistrict());
        address.setWard(dto.getWard());
        address.setDetail(dto.getDetail());
        address.setDefaultAddress(dto.getIsDefault());
        // Note: Setting the customer should be handled when adding to the customer's addresses directly
        return address;
    }

    public static AddressDTO toAddressDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setName(address.getName());
        dto.setPhone(address.getPhone());
        dto.setProvince(address.getProvince());
        dto.setDistrict(address.getDistrict());
        dto.setWard(address.getWard());
        dto.setDetail(address.getDetail());
        dto.setIsDefault(address.getDefaultAddress());
        return dto;
    }
}