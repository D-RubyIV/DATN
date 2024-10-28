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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AutoGenCode autoGenCode;

    @Override
    public Optional<Customer> getCustomerById(Integer id) {
        return customerRepository.findById(id);
    }

    @Override
    public Page<CustomerListDTO> search(String searchTerm, Pageable pageable) {
        return customerRepository.search(searchTerm, pageable)
                .map(CustomerMapper::toCustomerListDTO);
    }

    @Override
    public Page<CustomerListDTO> getAllCustomers(String status, Pageable pageable) {
        if (status != null && !status.isEmpty()) {
            return customerRepository.findByStatus(status, pageable)
                    .map(CustomerMapper::toCustomerListDTO);
        }
        return customerRepository.findAll(pageable)
                .map(CustomerMapper::toCustomerListDTO);
    }

    @Override
    public CustomerDetailDTO getCustomerDetailById(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return CustomerMapper.toCustomerDetailDTO(customer);
    }


    @Override
    @Transactional
    public Customer saveCustomer(CustomerDTO customerDTO)  {

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
        customer.setDeleted(false);// Mặc định là không bị xóa

        // Lưu Customer vào database
        Customer savedCustomer = customerRepository.save(customer);

        Address defaultAddress = new Address();
        defaultAddress.setName(customerDTO.getName()); // mới sửa
        defaultAddress.setPhone(customerDTO.getPhone()); // mới sửa
        defaultAddress.setProvince(customerDTO.getProvince());
        defaultAddress.setDistrict(customerDTO.getDistrict());
        defaultAddress.setWard(customerDTO.getWard());
        defaultAddress.setDetail(customerDTO.getDetail());
        defaultAddress.setCustomer(savedCustomer);
        defaultAddress.setDefaultAddress(true); // Đặt địa chỉ này là mặc định

        // Lưu địa chỉ
        addressRepository.save(defaultAddress);

        return savedCustomer;
    }


    @Override
    public CustomerDetailDTO updateCustomer(Integer id, CustomerDetailDTO customerDetailDTO) {
        Optional<Customer> customerOptional = customerRepository.findById(id);
        if (customerOptional.isPresent()) {
            Customer existingCustomer = customerOptional.get();

            // Cập nhật thông tin khách hàng và địa chỉ dựa trên DTO
            CustomerMapper.updateCustomerFromDTO(customerDetailDTO, existingCustomer);

            // Lưu khách hàng đã cập nhật
            Customer updatedCustomer = customerRepository.save(existingCustomer);
            return CustomerMapper.toCustomerDetailDTO(updatedCustomer);
        } else {
            throw new RuntimeException("Không tìm thấy khách hàng với id: " + id);
        }
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

    @Transactional
    @Override
    public Address updateAddressDefault(Integer customerId, Integer addressId, Boolean defaultAddress) {
        // Lấy tất cả các địa chỉ của khách hàng
        List<Address> customerAddresses = addressRepository.findByCustomerId(customerId);

        // Nếu địa chỉ mới được đặt làm mặc định
        if (defaultAddress) {
            // Đặt tất cả các địa chỉ khác thành không mặc định
            for (Address address : customerAddresses) {
                if (!address.getId().equals(addressId)) { // Chỉ đặt các địa chỉ khác
                    address.setDefaultAddress(false);
                    addressRepository.save(address); // Lưu ngay lập tức từng địa chỉ đã thay đổi
                }
            }
        } else {
            // Nếu địa chỉ được chọn không làm mặc định, kiểm tra xem có ít nhất một địa chỉ nào đó là mặc định không
            boolean hasDefaultAddress = customerAddresses.stream()
                    .anyMatch(Address::getDefaultAddress);

            // Nếu không có địa chỉ mặc định, ném ngoại lệ
            if (!hasDefaultAddress) {
                throw new IllegalStateException("At least one address must be set as default.");
            }
        }

        // Tìm địa chỉ cần cập nhật (nếu địa chỉ không tồn tại, ném ngoại lệ)
        Address addressToUpdate = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id " + addressId));

        // Cập nhật giá trị isDefault cho địa chỉ được chọn
        addressToUpdate.setDefaultAddress(defaultAddress);

        // Lưu địa chỉ đang được cập nhật (vì đã thay đổi giá trị isDefault)
        return addressRepository.save(addressToUpdate);
    }


    @Override
    public AddressDTO addAddressToCustomer(Integer customerId, AddressDTO addressDTO) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found width id " + customerId));

        // Tao va thiet lap dia chi moi
        Address newAddress = new Address();
        newAddress.setName(addressDTO.getName());
        newAddress.setPhone(addressDTO.getPhone());
        newAddress.setProvince(addressDTO.getProvince());
        newAddress.setDistrict(addressDTO.getDistrict());
        newAddress.setWard(addressDTO.getWard());
        newAddress.setDetail(addressDTO.getDetail());
        newAddress.setDefaultAddress(addressDTO.getIsDefault());

        addressRepository.save(newAddress);

        // Cap nhat thong tin Customer
        customer.getAddresses().add(newAddress);
        customerRepository.save(customer);

        // tra ve AddressDTO
        return CustomerMapper.toAddressDTO(newAddress);
    }

}
