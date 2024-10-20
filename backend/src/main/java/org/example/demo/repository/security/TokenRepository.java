package org.example.demo.repository.security;

import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.security.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TokenRepository extends JpaRepository<Token, Integer> {

    List<Token> findByStaff(Staff staff);

    List<Token> findByCustomer(Customer customer);

    Token findByToken(String token);

    Token findByRefreshToken(String refreshToken);

}
