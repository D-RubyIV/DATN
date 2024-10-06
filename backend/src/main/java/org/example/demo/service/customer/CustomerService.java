package org.example.demo.service.customer;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.dto.customer.CustomerDTO;
import org.example.demo.dto.customer.CustomerDetailDTO;
import org.example.demo.dto.customer.CustomerListDTO;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomerService {

    Page<CustomerListDTO> search(String searchTerm, Pageable pageable);

    Page<CustomerListDTO> getAllCustomers(String status, Pageable pageable);

    CustomerDetailDTO getCustomerDetailById(Integer id);

    Customer saveCustomer(CustomerDTO customerDTO) throws BadRequestException;

    CustomerDetailDTO updateCustomer(Integer id, CustomerDetailDTO customerDetailDTO);

    void deleteCustomerById(Integer id);

    Customer updateStatus(Integer id, String newStatus);

    Address updateAddressDefault(Integer customerId, Integer addressId, Boolean defaultAddress);

    AddressDTO addAddressToCustomer(Integer customerId, AddressDTO addressDTO);


}
