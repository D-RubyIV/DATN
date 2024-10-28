package org.example.demo.repository.order;

import org.example.demo.entity.product.core.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderProductDetailRepository extends JpaRepository<ProductDetail, Integer> {
}
