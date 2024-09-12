package org.example.demo.repository.bill;

import org.example.demo.dto.bill.response.BillOverviewResponseDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.entity.bill.enums.Status;
import org.example.demo.entity.bill.enums.Type;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {
    @Query(value = """
            SELECT DISTINCT b FROM Bill b
            LEFT JOIN FETCH b.customer bc
            LEFT JOIN FETCH b.staff bs
            LEFT JOIN FETCH b.voucher bv
            LEFT JOIN FETCH bs.role
            LEFT JOIN FETCH bv.customers
            WHERE
            (:code IS NULL OR LOWER(b.code) LIKE LOWER(CONCAT('%', :code, '%')))
            OR
            (:phone IS NULL OR LOWER(b.phone) LIKE LOWER(CONCAT('%', :phone, '%')))
            OR
            :customerName IS NULL OR LOWER(b.customer.name) LIKE LOWER(CONCAT('%', :customerName, '%'))
            OR
            (:staffName IS NULL OR LOWER(b.staff.name) LIKE LOWER(CONCAT('%', :staffName, '%')))
            AND
            (:status IS NULL OR LOWER(b.status) LIKE LOWER(CONCAT('%', :status, '%')))
            AND
            (:type IS NULL OR LOWER(b.type) LIKE LOWER(CONCAT('%', :type, '%')))
            AND
            (:createdFrom IS NULL OR b.createdDate >= :createdFrom)
            AND
            (:createdTo IS NULL OR b.createdDate <= :createdTo)
            """)
    Page<Bill> findAllByPageWithQuery(
            @Param("code") String code,
            @Param("phone") String phone,
            @Param("customerName") String customerName,
            @Param("staffName") String staffName,
            @Param("status") Status status,
            @Param("type") Type type,
            @Param("createdFrom") LocalDate createdFrom,
            @Param("createdTo") LocalDate createdTo,
            Pageable pageable
    );
}
