package org.example.demo.repository.security;

import org.example.demo.entity.security.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account,Integer> {

    Optional<Account> findByUsername(String email);
    boolean existsByUsername(String email);
}
