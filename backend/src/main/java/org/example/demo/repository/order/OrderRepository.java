package org.example.demo.repository.order;

import org.example.demo.dto.order.core.response.CountOrderDetailInOrder;
import org.example.demo.dto.order.core.response.CountStatusOrder;
import org.example.demo.entity.order.core.Order;
import org.example.demo.model.response.ICountOrderDetailInOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

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
            :query IS NULL OR 
            LOWER(b.code) LIKE LOWER(CONCAT('%', :query, '%')) OR
            LOWER(b.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR
            LOWER(b.customer.name) LIKE LOWER(CONCAT('%', :query, '%')) OR
            LOWER(b.staff.name) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        AND
        (:status IS NULL OR :status = '' OR LOWER(b.status) LIKE LOWER(:status))
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
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );

    @Query(value = "SELECT new org.example.demo.dto.order.core.response.CountStatusOrder( " +
            "COUNT(o), " +  // Đếm tổng số đơn hàng
            "SUM(CASE WHEN o.status = 'PENDING' THEN 1 ELSE 0 END), " +  // Đếm số đơn hàng 'PENDING'
            "SUM(CASE WHEN o.status = 'TOSHIP' THEN 1 ELSE 0 END), " +   // Đếm số đơn hàng 'TOSHIP'
            "SUM(CASE WHEN o.status = 'TORECEIVE' THEN 1 ELSE 0 END), " +// Đếm số đơn hàng 'TORECEIVE'
            "SUM(CASE WHEN o.status = 'DELIVERED' THEN 1 ELSE 0 END), " +// Đếm số đơn hàng 'DELIVERED'
            "SUM(CASE WHEN o.status = 'CANCELED' THEN 1 ELSE 0 END), " + // Đếm số đơn hàng 'CANCELED'
            "SUM(CASE WHEN o.status = 'RETURNED' THEN 1 ELSE 0 END)," + // Đếm số đơn hàng 'RETURNED'
            "SUM(CASE WHEN o.status = 'PAID' THEN 1 ELSE 0 END), " + // Đếm số đơn hàng 'PAID'
            "SUM(CASE WHEN o.status = 'UNPAID' THEN 1 ELSE 0 END)) " + // Đếm số đơn hàng 'UNPAID'
            "FROM Order o")
    CountStatusOrder getCountStatus();


    @Query(value = "select count(od.id) as quantity, o.code as code, o.id as id from Order o left join OrderDetail od on od.order.id = o.id where o.id in :ids group by o.id, o.code")
    List<ICountOrderDetailInOrder> getCountOrderDetailByIds(@Param("ids") List<Integer> ids);

}
