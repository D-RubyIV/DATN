package org.example.demo.service.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.demo.components.JwtTokenUtils;
import org.example.demo.components.LocalizationUtils;
import org.example.demo.dto.auth.request.AccountRequestDTO;
import org.example.demo.dto.customer.request.CustomerRequestDTO;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.dto.user.UserLoginDTO;
import org.example.demo.entity.human.role.Role;
import org.example.demo.entity.security.Account;
import org.example.demo.entity.security.TokenRecord;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.exception.DataNotFoundException;
import org.example.demo.exception.PermissionDenyException;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.security.AccountRepository;
import org.example.demo.repository.security.RoleRepository;
import org.example.demo.repository.security.TokenRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.example.demo.util.MessageKeys;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final AccountRepository accountRepository;
    private final StaffRepository staffRepository;
    private final CustomerRepository customerRepository;
    private final JwtTokenUtils jwtTokenUtils;
    private final TokenRepository tokenRepository;
    private final AuthenticationManager authenticationManager;
    private final LocalizationUtils localizationUtils;

    @Transactional
    public Account createAccount(AccountRequestDTO accountRequestDTO) throws DataNotFoundException, PermissionDenyException {
        String email = accountRequestDTO.getUsername();
        if (accountRepository.existsByUsername(email)) {
            throw new DataIntegrityViolationException("Email đăng ký đã tồn tại");
        }


        Role role = roleRepository.findById(accountRequestDTO.getRoleId())
                .orElseThrow(() -> new DataNotFoundException(localizationUtils.getLocalizedMessage(MessageKeys.ROLE_DOES_NOT_EXISTS)));
        if(role.getName().toUpperCase().equalsIgnoreCase(Role.ADMIN)) {
            throw new PermissionDenyException("Không được phép đăng ký tài khoản Admin");
        }

        Account account = Account.builder()
                .username(email)
                .password(accountRequestDTO.getPassword() != null ? passwordEncoder.encode(accountRequestDTO.getPassword()) : null)
                .role(role)
                .provider(accountRequestDTO.getProvider())
                .enabled(true)
                .status("Hoạt Động")
                .build();

        if (role.getName().equalsIgnoreCase(Role.USER)) {
            Staff staff = new Staff();
            staff.setEmail(email);
            staff.setAccount(account);
            account.setStaff(staff);
            staffRepository.save(staff);
        } else {
            Customer customer = new Customer();
            customer.setEmail(email);
            customer.setAccount(account);
            account.setCustomer(customer);
            customerRepository.save(customer);
        }
        return accountRepository.save(account);
    }


    public String authenticate(String email, String password, long roleId) {
        System.out.println("1");

        Account account = accountRepository.findByUsername(email)
                .orElseThrow(() -> new CustomExceptions.CustomBadRequest(
                        localizationUtils.getLocalizedMessage(MessageKeys.WRONG_EMAIL_PASSWORD)
                ));

        System.out.println("2");

        // Kiểm tra mật khẩu nếu không phải đăng nhập từ mạng xã hội
        if (account.getProvider() == null && !passwordEncoder.matches(password, account.getPassword())) {
            throw new CustomExceptions.CustomBadRequest(
                    localizationUtils.getLocalizedMessage(MessageKeys.WRONG_EMAIL_PASSWORD)
            );
        }
        System.out.println("3");

        if (!account.getEnabled()) {
            throw new CustomExceptions.CustomBadRequest(
                    localizationUtils.getLocalizedMessage(MessageKeys.USER_IS_LOCKED)
            );
        }
        System.out.println("4");

        UserDetails userDetail = (UserDetails) account;

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                email, password, userDetail.getAuthorities()
        );
        System.out.println("5");
        // authenticate with Java Spring security
        System.out.println(authToken);
        try {
            authenticationManager.authenticate(authToken);
            System.out.println("6");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Authentication failed: " + e.getMessage());
        }
        System.out.println("6");
        return jwtTokenUtils.generateToken(account);
    }

    public Account getAccountDetailsFromToken(String token) {
        if (jwtTokenUtils.isTokenExpired(token)) {
            throw new CustomExceptions.CustomBadRequest("Token is expired");
        }
        String email = jwtTokenUtils.getSubject(token);
        Optional<Account> account = accountRepository.findByUsername(email);
        if (account.isPresent()) {
            return account.get();
        } else {
            throw new CustomExceptions.CustomBadRequest("User not found");
        }
    }

    public Account getAccountDetailsFromRefreshToken(String refreshToken) throws Exception {
        TokenRecord existingTokenRecord = tokenRepository.findByRefreshToken(refreshToken);
        return getAccountDetailsFromToken(existingTokenRecord.getToken());
    }

    @Transactional
    public void updatePassword(Integer accountId, String newPassword) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new CustomExceptions.CustomBadRequest("Account not found"));

        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);

        // Hủy tất cả các token hiện tại
        List<TokenRecord> tokens = tokenRepository.findByAccount(account);
        tokenRepository.deleteAll(tokens);
    }

    @Transactional
    public void updateAccountStatus(Integer accountId, String status) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new CustomExceptions.CustomBadRequest("Account not found"));

        account.setStatus(status);
        account.setEnabled("ACTIVE".equals(status));
        accountRepository.save(account);
    }

//    private Optional<Account> findAccountByEmail(String email) {
//        Optional<Staff> staffOptional = staffRepository.findByEmail(email);
//        if (staffOptional.isPresent()) {
//            return Optional.of(staffOptional.get().getAccount());
//        }
//        Optional<Customer> customerOptional = customerRepository.findByEmail(email);
//        return customerOptional.map(Customer::getAccount);
//    }

    @Transactional
    public void updateStaff(StaffRequestDTO requestDTO) {

    }

    @Transactional
    public void updateCustomer(CustomerRequestDTO customerRequestDTO) {

    }

}