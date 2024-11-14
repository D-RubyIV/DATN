package org.example.demo.config.security;

import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return customerRepository.findByEmail(email)
                .map(customer -> (UserDetails) customer)
                .orElseGet(() ->
                        staffRepository.findByEmail(email)
                                .map(staff -> (UserDetails) staff)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email))
                );
    }
}
