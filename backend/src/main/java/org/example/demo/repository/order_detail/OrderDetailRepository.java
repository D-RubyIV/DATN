package org.example.demo.repository.order_detail;

import org.example.demo.entity.order.properties.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    Optional<OrderDetail> findByOrderIdAndProductDetailId(Integer idOrder, Integer idProductDetail);
}
