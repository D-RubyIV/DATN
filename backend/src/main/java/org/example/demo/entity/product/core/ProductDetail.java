package org.example.demo.entity.product.core;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.product.properties.*;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "product_detail", uniqueConstraints = @UniqueConstraint(columnNames = "code"))
public class ProductDetail extends BaseEntity {

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private Double price;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "deleted")
    private Boolean deleted;

    // Kích thước
    @ManyToOne
    @JoinColumn(name = "size_id")
    private Size size;

    // Màu sắc
    @ManyToOne
    @JoinColumn(name = "color_id")
    private Color color;

    // Sản phẩm
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Họa tiết
    @ManyToOne
    @JoinColumn(name = "texture_id")
    private Texture texture;

    // Xuất xứ
    @ManyToOne
    @JoinColumn(name = "origin_id")
    private Origin origin;

    // Thương hiệu
    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    // Cổ áo
    @ManyToOne
    @JoinColumn(name = "collar_id")
    private Collar collar;

    // Tay Áo
    @ManyToOne
    @JoinColumn(name = "sleeve_id")
    private Sleeve sleeve;

    // Kiểu dáng
    @ManyToOne
    @JoinColumn(name = "style_id")
    private Style style;

    // Chất liệu
    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;

    // Độ dày vài
    @ManyToOne
    @JoinColumn(name = "thickness_id")
    private Thickness thickness;

    // Độ co dãn
    @ManyToOne
    @JoinColumn(name = "elasticity_id")
    private Elasticity elasticity;

    // Hình ảnh
    @ManyToOne
    @JoinColumn(name = "image_id")
    private Image image;

}
