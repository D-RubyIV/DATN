package org.example.demo.entity.bill.properties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.entity.product.core.ProductDetail;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "bill_detail")
public class BillDetail extends BaseEntity {

    @Column(name = "quantity")
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "productDetail_id")
    private ProductDetail productDetail;

    @OneToOne
    private Bill bill;
}
