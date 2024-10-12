package org.example.demo.validator;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.CustomerDTO;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.service.CustomerService;
import org.example.demo.service.customer.impl.CustomerServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class CustomerValidator {

    @Autowired
    private CustomerRepository customerRepository;

    public void validate(CustomerDTO customerDTO, Integer existingCustomerId) throws BadRequestException {
        if (customerDTO == null) {
            throw new BadRequestException("Dữ liệu khách hàng không để trống");
        }

        validateName(customerDTO.getName());
        validateEmail(customerDTO.getEmail(), existingCustomerId);
        validatePhone(customerDTO.getPhone(), existingCustomerId);
//        validateBirthDate(customerDTO.getBirthDate() + "");


    }

    private void validateName(String name) throws BadRequestException {
        if (!StringUtils.hasText(name)) {
            throw new BadRequestException("Tên không để trống");
        }
        if (name.length() < 5 || name.length() > 100) {
            throw new BadRequestException("Tên phải lớn hơn 5 ký tự và không quá 100 ký tự");
        }
    }

    private void validateEmail(String email, Integer existingCustomerId) throws BadRequestException {
        if (!StringUtils.hasText(email)) {
            throw new BadRequestException("Email không để trống");
        }
        if (!email.matches("^[\\w-\\.]+@[\\w-]+\\.[a-zA-Z]{2,4}$")) {
            throw new BadRequestException("Email không đúng định dạng");
        }
        // Kiểm tra nếu tồn tại nhiều khách hàng có cùng email
        List<Customer> customers = customerRepository.findCustomerByEmail(email);
        for (Customer customer : customers) {
            // Nếu tìm thấy khách hàng có email này mà không phải khách hàng đang cập nhật
            if (!customer.getId().equals(existingCustomerId)) {
                throw new BadRequestException("Email đã tồn tại");
            }
        }
    }

    private void validatePhone(String phone, Integer existingCustomerId) throws BadRequestException {
        if (!StringUtils.hasText(phone)) {
            throw new BadRequestException("Số điện thoại không được để trống");
        }
        if (!phone.matches("^[0-9]{10}$")) {
            throw new BadRequestException("Số điện thoại không hợp lệ");
        }
        // Kiểm tra nếu tồn tại nhiều khách hàng có cùng số điện thoại
        List<Customer> customers = customerRepository.findCustomerByPhone(phone);
        for (Customer customer : customers) {
            // Nếu tìm thấy khách hàng có số điện thoại này mà không phải khách hàng đang cập nhật
            if (!customer.getId().equals(existingCustomerId)) {
                throw new BadRequestException("Số điện thoại đã tồn tại");
            }
        }

    }
}
