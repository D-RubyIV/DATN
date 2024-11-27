package org.example.demo.dto.product.requests.core;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.product.requests.properties.ImageRequestDTO;
import org.example.demo.entity.product.properties.*;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDetailRequestDTO {

    private String code;
    private Double price;
    private Integer quantity;
    private Integer mass;
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
    private List<ImageRequestDTO> images; //
}
