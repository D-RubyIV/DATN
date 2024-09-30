package org.example.demo.repository.order;

import org.example.demo.dto.order.core.response.CountStatusOrder;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.order.enums.Type;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    @Query(value = """
        SELECT DISTINCT b FROM Order b
        LEFT JOIN FETCH b.customer bc
        LEFT JOIN FETCH b.staff bs
        LEFT JOIN FETCH b.voucher bv
        LEFT JOIN FETCH bs.role
        LEFT JOIN FETCH bv.customers
        WHERE
        (
            (:query IS NULL OR LOWER(b.code) LIKE LOWER(CONCAT('%', :query, '%')))
            OR
            (:query IS NULL OR LOWER(b.phone) LIKE LOWER(CONCAT('%', :query, '%')))
            OR
            (:query IS NULL OR LOWER(b.customer.name) LIKE LOWER(CONCAT('%', :query, '%')))
            OR
            (:query IS NULL OR LOWER(b.staff.name) LIKE LOWER(CONCAT('%', :query, '%')))
        )
        AND
        (:status IS NULL OR LOWER(b.status) LIKE LOWER(CONCAT('%', :status, '%')))
        AND
        (:type IS NULL OR LOWER(b.type) LIKE LOWER(CONCAT('%', :type, '%')))
        AND
        (:createdFrom IS NULL OR b.createdDate >= :createdFrom)
        AND
        (:createdTo IS NULL OR b.createdDate <= :createdTo)
        """)
    Page<Order> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("status") String status,
            @Param("type") String type,
            @Param("createdFrom") LocalDate createdFrom,
            @Param("createdTo") LocalDate createdTo,
            Pageable pageable
    );

    @Query(value = "SELECT new org.example.demo.dto.order.core.response.CountStatusOrder( " +
            "COUNT(o), " +  // Đếm tổng số đơn hàng
            "SUM(CASE WHEN o.status = 'PENDING' THEN 1 ELSE 0 END), " +  // Đếm số đơn hàng 'PENDING'
            "SUM(CASE WHEN o.status = 'TOSHIP' THEN 1 ELSE 0 END), " +   // Đếm số đơn hàng 'TOSHIP'
            "SUM(CASE WHEN o.status = 'TORECEIVE' THEN 1 ELSE 0 END), " +// Đếm số đơn hàng 'TORECEIVE'
            "SUM(CASE WHEN o.status = 'DELIVERED' THEN 1 ELSE 0 END), " +// Đếm số đơn hàng 'DELIVERED'
            "SUM(CASE WHEN o.status = 'CANCELED' THEN 1 ELSE 0 END), " + // Đếm số đơn hàng 'CANCELED'
            "SUM(CASE WHEN o.status = 'RETURNED' THEN 1 ELSE 0 END)) " + // Đếm số đơn hàng 'RETURNED'
            "FROM Order o")
    CountStatusOrder getCountStatus();
}
