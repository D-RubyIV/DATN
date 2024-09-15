package org.example.demo.dto.order.properties.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.product.core.ProductDetail;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDetailResponseDTO {
    private Integer quantity;
    private ProductDetail productDetail;
}
