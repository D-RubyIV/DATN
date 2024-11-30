package org.example.demo.validator;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.repository.customer.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;

@Component
public class AddressValidator {

    @Autowired
    private AddressRepository addressRepository;

    public void validateAddress(AddressDTO addressDTO, Integer existingAddressId) throws BadRequestException {
        if (addressDTO == null) {
            throw new BadRequestException("Dữ liệu địa chỉ không để trống");
        }

        validateName(addressDTO.getName());
        validatePhone(addressDTO.getPhone(), existingAddressId);
        validateDetail(addressDTO.getDetail());
    }

    private void validateName(String name) throws BadRequestException {
        if (!StringUtils.hasText(name)) {
            throw new BadRequestException("Tên không để trống");
        }
        // Kiểm tra khoảng trắng thừa
        if (!name.trim().equals(name) || name.contains("  ")) {
            throw new BadRequestException("Tên không được chứa khoảng trắng ở đầu, cuối hoặc nhiều khoảng trắng liên tiếp");
        }
        if (!name.matches("^[\\p{L}\\s]+$")) {
            throw new BadRequestException("Tên không được chứa ký tự đặc biệt hoặc số");
        }
        if (name.length() < 3 || name.length() > 50) {
            throw new BadRequestException("Tên phải lớn hơn 3 ký tự và không quá 50 ký tự");
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
        List<Address> addresses = addressRepository.findAddressByPhone(phone);
        for (Address address : addresses) {
            // Nếu tìm thấy khách hàng có số điện thoại này mà không phải khách hàng đang cập nhật
            if (!address.getId().equals(existingCustomerId)) {
                throw new BadRequestException("Số điện thoại đã tồn tại");
            }
        }
    }

    private void validateDetail(String detail) throws BadRequestException {
        if (!StringUtils.hasText(detail)) {
            throw new BadRequestException("Địa chỉ chi tết không được để trống");
        }
    }
}
