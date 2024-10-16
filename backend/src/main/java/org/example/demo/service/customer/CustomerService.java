package org.example.demo.service.customer;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.dto.customer.CustomerDTO;
import org.example.demo.dto.customer.CustomerListDTO;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {

    Page<CustomerListDTO> search(String searchTerm, Pageable pageable);

    Page<CustomerListDTO> getAllCustomers(String status, Pageable pageable);

    CustomerDTO getCustomerDetailById(Integer id);

    CustomerDTO saveCustomer(CustomerDTO customerDTO) throws BadRequestException;

    CustomerDTO updateCustomer(Integer id, CustomerDTO customerDTO) throws BadRequestException;

    void deleteCustomerById(Integer id);

    Customer updateStatus(Integer id, String newStatus);

    Address updateAddressDefault(Integer customerId, Integer addressId, Boolean defaultAddress);

    AddressDTO addAddressToCustomer(Integer customerId, AddressDTO addressDTO) throws BadRequestException;


}