package org.example.demo.dto.product.response.properties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductResponseOverDTO {
    private Integer productId;
    private String productCode;
    private String productName;
    private Long countColor;
    private Long countSize;
    private Double originPrice;
    private Double discountPrice;
    private Long discountPercent;
    private Long discountAmount;
    private List<String> image;
    private List<String> mass;

    public ProductResponseOverDTO(Integer productId, String productCode, String productName, Long countColor, Long countSize, Double originPrice, Double discountPrice) {
        this.productId = productId;
        this.productCode = productCode;
        this.productName = productName;
        this.countColor = countColor;
        this.countSize = countSize;
        this.originPrice = originPrice;
        this.discountPrice = discountPrice;
    }
}
