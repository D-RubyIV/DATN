package org.example.demo.entity.event;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.product.properties.Product;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Table(name = "event")
@Entity
public class Event extends BaseEntity {
    @Column(name = "discount_code", unique = true)
    private String discountCode;

    @Column(name = "name")
    private String name; // tên sự kiện

    @Column(name = "start_date")
    private Integer discountPercent; // phần trăm giảm giá

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "quantity_discount")
    private Integer quantityDiscount;

    @Column(name = "status")
    private Boolean status; //

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Product> products;
}
