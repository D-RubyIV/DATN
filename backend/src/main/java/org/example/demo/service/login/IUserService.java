package org.example.demo.service.login;

import org.example.demo.dto.customer.request.CustomerRequestDTO;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.exception.DataNotFoundException;
import org.example.demo.exception.InvalidPasswordException;
import org.example.demo.exception.PermissionDenyException;

public interface IUserService {

    Staff createStaff(StaffRequestDTO staffRequestDTO) throws DataNotFoundException, PermissionDenyException;

    Customer createCustomer(CustomerRequestDTO customerRequestDTO);


    String login(String email, String password, Long roleId) throws Exception;

    Staff getStaffDetailsFromToken(String token) throws Exception;
    Staff getStaffDetailsFromRefreshToken(String refreshToken) throws Exception;
    Staff updateStaff(Integer staffId, StaffRequestDTO staffRequestDTO) throws Exception;

//    Page<Staff> findAll(String keyword, Pageable pageable) throws Exception;
    void resetPassword(Integer staffId, String newPassword) throws InvalidPasswordException, DataNotFoundException;

    public void blockOrEnable(Integer staffId, String Status) throws Exception;


}
