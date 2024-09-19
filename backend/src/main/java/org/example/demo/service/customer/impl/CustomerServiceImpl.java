package org.example.demo.service.customer.impl;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.*;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.infrastructure.common.AutoGenCode;
import org.example.demo.repository.customer.AddressRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.service.customer.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AutoGenCode autoGenCode;

    @Override
    public Page<CustomerListDTO> search(String searchTerm, Pageable pageable) {
        return customerRepository.search(searchTerm, pageable)
                .map(CustomerMapper::toDTO);
    }

    @Override
    public Page<CustomerListDTO> getAllCustomers(String status, Pageable pageable) {
        if (status != null && !status.isEmpty()) {
            return customerRepository.findByStatus(status, pageable)
                    .map(CustomerMapper::toDTO);
        }
        return customerRepository.findAll(pageable)
                .map(CustomerMapper::toDTO);
    }

    @Override
    public CustomerDetailDTO getCustomerDetailById(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found width id " + id));

        CustomerDetailDTO customerDetailDTO = new CustomerDetailDTO();
        customerDetailDTO.setCode(customer.getCode());
        customerDetailDTO.setName(customer.getName());
        customerDetailDTO.setEmail(customer.getEmail());
        customerDetailDTO.setPhone(customer.getPhone());
        customerDetailDTO.setGender(customer.getGender());
        customerDetailDTO.setBirthDate(customer.getBirthDate());
        customerDetailDTO.setStatus(customer.getStatus());
        List<AddressDTO> addressDTOS = customer.getAddresses().stream().map(address -> {
            AddressDTO addressDTO = new AddressDTO();
            addressDTO.setPhone(addressDTO.getPhone());
            addressDTO.setProvince(address.getProvince());
            addressDTO.setDistrict(address.getDistrict());
            addressDTO.setWard(address.getWard());
            addressDTO.setDetail(address.getDetail());
            return addressDTO;
        }).collect(Collectors.toList());

        customerDetailDTO.setAddressDTOS(addressDTOS);

        return customerDetailDTO;
    }


    @Override
    @Transactional
    public Customer saveCustomer(CustomerDTO customerDTO) {

        String generatedCode = customerDTO.getCode() == null || customerDTO.getCode().isEmpty()
                ? autoGenCode.genarateUniqueCode() : customerDTO.getCode();

        Customer customer = new Customer();
        customer.setCode(generatedCode);
        customer.setName(customerDTO.getName());
        customer.setEmail(customerDTO.getEmail());
        customer.setPhone(customerDTO.getPhone());
        customer.setBirthDate(customerDTO.getBirthDate());
        customer.setGender(customerDTO.getGender());
        customer.setStatus(customerDTO.getStatus());
        customer.setDeleted(false);// default not deleted

        // save Customer
        Customer savedCustomer = customerRepository.save(customer);

        Address address = new Address();
        address.setProvince(customerDTO.getProvince());
        address.setDistrict(customerDTO.getDistrict());
        address.setWard(customerDTO.getWard());
        address.setDetail(customerDTO.getDetail());

        // add Customer to Address
        address.setCustomer(savedCustomer);

        addressRepository.save(address);

        return savedCustomer;
    }


    @Override
    public Customer updateCustomer(Integer id, CustomerDTO customerDTO) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found width id " + id));
        customer.setCode(customer.getCode());
        customer.setName(customerDTO.getName());
        customer.setEmail(customerDTO.getEmail());
        customer.setPhone(customerDTO.getPhone());
        customer.setBirthDate(customerDTO.getBirthDate());
        customer.setGender(customerDTO.getGender());
        customer.setStatus(customerDTO.getStatus());

        Address address = customer.getAddresses().get(0);
        address.setProvince(customerDTO.getProvince());
        address.setDistrict(customerDTO.getDistrict());
        address.setWard(customerDTO.getWard());
        address.setDetail(customerDTO.getDetail());

        addressRepository.save(address);
        return customerRepository.save(customer);
    }

    @Override
    public void deleteCustomerById(Integer id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found width id " + id);
        }
        customerRepository.deleteById(id);
    }

    @Transactional
    public Customer updateStatus(Integer id, String newStatus) {
        // Validate the new status value
        if (!"Active".equalsIgnoreCase(newStatus) && !"Inactive".equalsIgnoreCase(newStatus)) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }

        // Fetch the customer entity by ID
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff with id " + id + " not found"));

        // Update the status
        customer.setStatus(newStatus);

        // Save the updated staff entity
        return customerRepository.save(customer);
    }

}
