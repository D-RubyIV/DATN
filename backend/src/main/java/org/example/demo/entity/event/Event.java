package org.example.demo.entity.event;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.product.properties.Product;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Table(name = "event")
@Entity
public class Event extends BaseEntity {
    private Integer discountPercent; // phần trăm giảm giá
    private LocalDate startDate;
    private LocalDate endDate;
    private String name; // tên sự kiện
    private String description;
    private Boolean status; // 

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Product> products;
}
