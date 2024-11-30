package org.example.demo.controller.auth;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.demo.components.LocalizationUtils;
import org.example.demo.dto.auth.request.AccountRequestDTO;
import org.example.demo.dto.user.RefreshTokenDTO;
import org.example.demo.dto.user.UserLoginDTO;
import org.example.demo.dto.user.response.LoginResponse;
import org.example.demo.entity.security.Account;
import org.example.demo.entity.security.TokenRecord;
import org.example.demo.mapper.auth.response.AccountResponseMapper;
import org.example.demo.model.ResponseObject;
import org.example.demo.repository.security.AccountRepository;
import org.example.demo.service.auth.AccountService;
import org.example.demo.service.token.ITokenService;
import org.example.demo.util.MessageKeys;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final LocalizationUtils localizationUtils;
    private final ITokenService tokenService;
    private final AccountResponseMapper accountResponseMapper;
    private final AccountRepository accountRepository;

    @PostMapping("/register")
    public ResponseEntity<ResponseObject> createUser(
            @Valid @RequestBody AccountRequestDTO accountRequestDTO,
            BindingResult result
    ) throws Exception {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();

            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .data(null)
                    .message(errorMessages.toString())
                    .build());
        }
        Account account = accountService.createAccount(accountRequestDTO);
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.CREATED)
                .data(accountResponseMapper.toDTO(account))
                .message("Đăng ký tài khoản thành công")
                .build());
    }


    @PostMapping("/login")
    public ResponseEntity<ResponseObject> login(
            @Valid @RequestBody UserLoginDTO userLoginDTO,
            HttpServletRequest request
    ) {
        System.out.println("======================0");
        String token  = accountService.authenticate(userLoginDTO.getUsername(),
                userLoginDTO.getPassword(),userLoginDTO.getRoleId() == null ? 1 : userLoginDTO.getRoleId() );
        System.out.println("======================1");

        String userAgent = request.getHeader("User-Agent");
        Account account = accountService.getAccountDetailsFromToken(token);
        System.out.println("======================2");
        TokenRecord jwtTokenRecord = tokenService.addToken(account, token,isMobileDevice(userAgent));
        System.out.println("======================3");

        LoginResponse loginResponse = LoginResponse.builder()
                .message(localizationUtils.getLocalizedMessage(MessageKeys.LOGIN_SUCCESSFULLY))
                .token(jwtTokenRecord.getToken())
                .tokenType(jwtTokenRecord.getTokenType())
                .refreshToken(jwtTokenRecord.getRefreshToken())
                .username(account.getUsername())
                .roles(account.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList())
                .id(account.getId())
                .build();
        System.out.println("======================4");
        return ResponseEntity.ok().body(ResponseObject.builder()
                .message("Login successfully")
                .data(loginResponse)
                .status(HttpStatus.OK)
                .build());
    }


    private boolean isMobileDevice(String userAgent) {
        // Kiểm tra User-Agent header để xác định thiết bị di động
        // Ví dụ đơn giản:
        return userAgent.toLowerCase().contains("mobile");
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<ResponseObject> refreshToken(
            @Valid @RequestBody RefreshTokenDTO refreshTokenDTO
    ) throws Exception {
        Account account = accountService.getAccountDetailsFromRefreshToken(refreshTokenDTO.getRefreshToken());
        TokenRecord jwtTokenRecord = tokenService.refreshToken(refreshTokenDTO.getRefreshToken(), account);
        LoginResponse loginResponse = LoginResponse.builder()
                .message("Refresh token successfully")
                .token(jwtTokenRecord.getToken())
                .tokenType(jwtTokenRecord.getTokenType())
                .refreshToken(jwtTokenRecord.getRefreshToken())
                .username(account.getUsername())
                .roles(account.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList())
                .id(account.getId()).build();
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .data(loginResponse)
                        .message(loginResponse.getMessage())
                        .status(HttpStatus.OK)
                        .build());

    }

    @PostMapping("/details")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<ResponseObject> getUserDetails(
            @RequestHeader("Authorization") String authorizationHeader
    ) throws Exception {
        String extractedToken = authorizationHeader.substring(7); // Loại bỏ "Bearer " từ chuỗi token
        Account user = accountService.getAccountDetailsFromToken(extractedToken);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Get user's detail successfully")
                        .data(accountResponseMapper.toDTO(user))
                        .status(HttpStatus.OK)
                        .build()
        );
    }

    @DeleteMapping("/delete/{id}")
    public String updateUser(@PathVariable Integer id) {
        Optional<Account> exits = accountRepository.findById(id);

        accountRepository.deleteById(id);
        return "Ok";
    }

//    @PutMapping("/details/{userId}")
//    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
//    public ResponseEntity<ResponseObject> updateUserDetails(
//            @PathVariable Integer accountId,
//            @RequestBody AccountRequestDTO accountRequestDTO,
//            @RequestHeader("Authorization") String authorizationHeader
//    ) throws Exception{
//        String extractedToken = authorizationHeader.substring(7);
//        Account user = accountService.getAccountDetailsFromToken(extractedToken);
//        // Ensure that the user making the request matches the user being updated
//        if (user.getId() != accountId) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        }
//        Account updatedUser = accountService.updateStaff(accountId, accountRequestDTO);
//        return ResponseEntity.ok().body(
//                ResponseObject.builder()
//                        .message("Update user detail successfully")
//                        .data(accountResponseMapper.toDTO(updatedUser))
//                        .status(HttpStatus.OK)
//                        .build()
//        );
//    }
//    @PutMapping("/reset-password/{userId}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<ResponseObject> resetPassword(@Valid @PathVariable Integer userId){
//        try {
//            String newPassword = UUID.randomUUID().toString().substring(0, 5); // Tạo mật khẩu mới
//            userService.resetPassword(userId, newPassword);
//            return ResponseEntity.ok(ResponseObject.builder()
//                    .message("Reset password successfully")
//                    .data(newPassword)
//                    .status(HttpStatus.OK)
//                    .build());
//        } catch (InvalidPasswordException e) {
//            return ResponseEntity.ok(ResponseObject.builder()
//                    .message("Invalid password")
//                    .data("")
//                    .status(HttpStatus.BAD_REQUEST)
//                    .build());
//        } catch (DataNotFoundException e) {
//            return ResponseEntity.ok(ResponseObject.builder()
//                    .message("User not found")
//                    .data("")
//                    .status(HttpStatus.BAD_REQUEST)
//                    .build());
//        }
//    }
//    @PutMapping("/block/{userId}/{status}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<ResponseObject> blockOrEnable(
//            @Valid @PathVariable Integer userId,
//            @Valid @PathVariable String status
//    ) throws Exception {
//        // Check if the status is either "ACTIVE" or "INACTIVE"
//        if (!status.equalsIgnoreCase("ACTIVE") && !status.equalsIgnoreCase("INACTIVE")) {
//            throw new IllegalArgumentException("Status must be either 'ACTIVE' or 'INACTIVE'");
//        }
//
//        // Perform the block or enable operation in the service
//        userService.blockOrEnable(userId, status.toUpperCase());
//
//        // Create a response message based on the status
//        String message = status.equalsIgnoreCase("ACTIVE")
//                ? "Successfully enabled the user."
//                : "Successfully blocked the user.";
//
//        // Return the response
//        return ResponseEntity.ok().body(ResponseObject.builder()
//                .message(message)
//                .status(HttpStatus.OK)
//                .data(null)
//                .build());
//    }



}
