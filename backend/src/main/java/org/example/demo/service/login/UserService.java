package org.example.demo.service.login;

import lombok.RequiredArgsConstructor;
import org.example.demo.components.JwtTokenUtils;
import org.example.demo.components.LocalizationUtils;
import org.example.demo.dto.customer.request.CustomerRequestDTO;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.role.Role;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.security.TokenRecord;
import org.example.demo.exception.*;
import org.example.demo.mapper.customer.request.CustomerRequestMapper;
import org.example.demo.mapper.staff.request.StaffRequestMapper;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.security.RoleRepository;
import org.example.demo.repository.security.TokenRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.example.demo.util.MessageKeys;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService implements IUserService {

    private final PasswordEncoder passwordEncoder;
    private final StaffRepository staffRepository;
    private final RoleRepository roleRepository;
    private final CustomerRepository customerRepository;
    private final LocalizationUtils localizationUtils;
    private final StaffRequestMapper staffRequestMapper;
    private final CustomerRequestMapper customerRequestMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtils jwtTokenUtils;
    private final TokenRepository tokenRepository;

    @Override
    @Transactional
    public Staff createStaff(StaffRequestDTO staffRequestDTO) throws DataNotFoundException, PermissionDenyException {
        // register staff
        String email = staffRequestDTO.getEmail();
        if (staffRepository.existsByEmail(email)) {
            throw new DataIntegrityViolationException("Email đăng ký đã tồn tại");
        }
        Role role = roleRepository.findById(staffRequestDTO.getRoleId())
                .orElseThrow(() -> new DataNotFoundException(localizationUtils.getLocalizedMessage(MessageKeys.ROLE_DOES_NOT_EXISTS)));
        if(role.getName().toUpperCase().equalsIgnoreCase(Role.ADMIN)) {
            throw new PermissionDenyException("Không được phép đăng ký tài khoản Admin");
        }
        Staff newStaff = staffRequestMapper.toEntity(staffRequestDTO);
        newStaff.setRole(role);

        // Kiểm tra nếu có accountId, không yêu cầu password (chua check)
        String password = staffRequestDTO.getPassword();
        String encodedPassword = passwordEncoder.encode(password);
        newStaff.setPassword(encodedPassword);


        newStaff.setDeleted(false);
        if (newStaff.getStatus() == null) {
            newStaff.setStatus("ACTIVE");
        }
        return staffRepository.save(newStaff);
    }

    @Override
    @Transactional
    public Customer createCustomer(CustomerRequestDTO customerRequestDTO) {
        String email = customerRequestDTO.getEmail();
        if (customerRepository.existsByEmail(email)) {
            throw new DataIntegrityViolationException("Email đăng ký đã tồn tại");
        }
        Customer newCustomer = customerRequestMapper.toEntity(customerRequestDTO);
        String password = customerRequestDTO.getPassword();
        if (password != null && !password.isEmpty()) {
            String encodedPassword = passwordEncoder.encode(password);
            newCustomer.setPassword(encodedPassword);
        }
        newCustomer.setDeleted(false);
        if (newCustomer.getStatus() == null) {
            newCustomer.setStatus("ACTIVE");
        }
        return customerRepository.save(newCustomer);
    }

    @Override
    public String login(String email, String password, Long roleId)  {
        Optional<Staff> optionalStaff = staffRepository.findByEmail(email);
        if (optionalStaff.isEmpty()) {
            throw new CustomExceptions.CustomBadRequest(localizationUtils.getLocalizedMessage(MessageKeys.WRONG_EMAIL_PASSWORD));
        }
        Staff existingStaff = optionalStaff.get();
        // Check dk login fb or google  (neu co)
        if (!passwordEncoder.matches(password, existingStaff.getPassword())) {
            throw new  CustomExceptions.CustomBadRequest(localizationUtils.getLocalizedMessage(MessageKeys.WRONG_EMAIL_PASSWORD));
        }
        if (!optionalStaff.get().isEnabled()) {
            throw new  CustomExceptions.CustomBadRequest(localizationUtils.getLocalizedMessage(MessageKeys.USER_IS_LOCKED));
        }
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                email, password, existingStaff.getAuthorities());
        // authenticate with Java Spring security
        authenticationManager.authenticate(authenticationToken);
        return jwtTokenUtils.generateToken(existingStaff);

    }

    @Override
    public Staff getStaffDetailsFromToken(String token) {
        if (jwtTokenUtils.isTokenExpired(token)) {
            throw new CustomExceptions.CustomBadRequest("Token is expired");
        }
        String email = jwtTokenUtils.getSubject(token);
        Optional<Staff> staff = staffRepository.findByEmail(email);

        if (staff.isPresent()) {
            return staff.get();
        } else {
            throw new CustomExceptions.CustomBadRequest("User not found");
        }
    }

    @Override
    public Staff getStaffDetailsFromRefreshToken(String refreshToken) throws Exception {
        TokenRecord existingTokenRecord = tokenRepository.findByRefreshToken(refreshToken);
        return getStaffDetailsFromToken(existingTokenRecord.getToken());
    }

    @Override
    public Staff updateStaff(Integer staffId, StaffRequestDTO staffRequestDTO) throws Exception {
        Staff existingStaff = staffRepository.findById(staffId)
                .orElseThrow(() -> new CustomExceptions.CustomBadRequest("User not found"));
        // Check if the email is being changed and if it already exists for another user
        String newEmail = staffRequestDTO.getEmail();
        if (!existingStaff.getEmail().equals(newEmail) && staffRepository.existsByEmail(newEmail)) {
            throw new CustomExceptions.CustomBadRequest("Email already exists");
        }
        if (staffRequestDTO.getName() != null) {
            existingStaff.setName(staffRequestDTO.getName());
        }
        if (newEmail != null) {
            existingStaff.setEmail(newEmail);
        }
        // add another fields


        // Update the password if it is provided in the DTO
        if (staffRequestDTO.getPassword() != null && !staffRequestDTO.getPassword().isEmpty()) {

            String newPassword = staffRequestDTO.getPassword();
            String encodedPassword = passwordEncoder.encode(newPassword);
            existingStaff.setPassword(encodedPassword);
        }

        return staffRepository.save(existingStaff);
    }


    @Override
    @Transactional
    public void resetPassword(Integer staffId, String newPassword) throws InvalidPasswordException, DataNotFoundException {
        Staff existingStaff = staffRepository.findById(staffId)
                .orElseThrow(() -> new CustomExceptions.CustomBadRequest("User not found"));
        String encodedPassword = passwordEncoder.encode(newPassword);
        existingStaff.setPassword(encodedPassword);
        staffRepository.save(existingStaff);
        List<TokenRecord> tokenRecords = tokenRepository.findByStaff(existingStaff);
        for (TokenRecord tokenRecord : tokenRecords) {
            tokenRepository.delete(tokenRecord);
        }
    }

    @Override
    @Transactional
    public void blockOrEnable(Integer staffId, String status) throws Exception {
        Staff existingStaff = staffRepository.findById(staffId)
                .orElseThrow(() -> new CustomExceptions.CustomBadRequest("User not found"));
        existingStaff.setStatus(status);
        staffRepository.save(existingStaff);
    }


}