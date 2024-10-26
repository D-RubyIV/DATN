package org.example.demo.config.security;

import lombok.RequiredArgsConstructor;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {


    private final CustomerRepository customerRepository;

    private final StaffRepository staffRepository;

    // User's detail object
    @Bean
    public UserDetailsService userDetailsService() {
        return email -> {
            // Tìm kiếm người dùng trong bảng Customer trước
            return customerRepository.findByEmail(email)
                    .map(customer -> (UserDetails) customer)
                    .orElseGet(() ->
                            // Nếu không tìm thấy trong bảng Customer, tiếp tục tìm trong bảng Staff
                            staffRepository.findByEmail(email)
                                    .map(staff -> (UserDetails) staff)
                                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email))
                    );
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }


}
