package org.example.demo.dto.product.response.core;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.product.properties.*;

import java.time.LocalDateTime;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDetailResponseDTO {
    private String code;
    private String name;
    private Double price;
    private Integer quantity;
    private Boolean deleted;
    private Size size;
    private Color color;
    private Product product;
    private Texture texture;
    private Origin origin;
    private Brand brand;
    private Collar collar;
    private Sleeve sleeve;
    private Style style;
    private Material material;
    private Thickness thickness;
    private Elasticity elasticity;
    private Image image;
    @JsonFormat(pattern = "dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    private LocalDateTime createdDate;
    @JsonFormat(pattern = "dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    private  LocalDateTime modifiedDate;


}
