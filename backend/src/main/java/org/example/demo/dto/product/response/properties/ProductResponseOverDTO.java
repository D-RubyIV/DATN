package org.example.demo.dto.product.response.properties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.product.properties.Color;
import org.example.demo.entity.product.properties.Size;

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
    private Long discountPercent;
    private List<String> image;
    private List<String> mass;
    private List<Color> listColor;
    private List<Size> listSize;

    public ProductResponseOverDTO(Integer productId, String productCode, String productName, Long countColor, Long countSize) {
        this.productId = productId;
        this.productCode = productCode;
        this.productName = productName;
        this.countColor = countColor;
        this.countSize = countSize;
    }
}