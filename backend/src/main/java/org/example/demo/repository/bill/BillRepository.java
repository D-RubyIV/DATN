package org.example.demo.repository.bill;

import org.example.demo.entity.bill.core.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {

}
