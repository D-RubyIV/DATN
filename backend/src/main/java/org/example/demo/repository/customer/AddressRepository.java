package org.example.demo.repository.customer;

import org.example.demo.entity.human.customer.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    // Tìm tất cả địa chỉ của khách hàng dựa trên customerId
    List<Address> findByCustomerId(Integer customerId);
}
