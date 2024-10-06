package org.example.demo.repository.customer;

import org.example.demo.entity.human.customer.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    // Tim kiem theo name, email, phone
    @Query("SELECT c FROM Customer c WHERE " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(c.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Customer> search(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Loc theo status
    @Query("SELECT c FROM Customer c WHERE c.status = :status")
    Page<Customer> findByStatus(@Param("status") String status, Pageable pageable);

}

