package org.example.demo.repository.order_detail;

import org.example.demo.entity.order.properties.OrderDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    Optional<OrderDetail> findByOrderIdAndProductDetailId(Integer idOrder, Integer idProductDetail);

    @Query(
            value = "SELECT o from OrderDetail o left join fetch o.order ord where ord.id = :id"
    )
    Page<OrderDetail> getPageOrderDetailWithPage(Integer id, Pageable pageable);
}
