package org.example.demo.entity.order.core;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.order.enums.Payment;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.order.properties.History;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.voucher.core.Voucher;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "orders", uniqueConstraints = @UniqueConstraint(columnNames = "code"))
public class Order extends BaseEntity {

    @Column(name = "code")
    private String code;

    @Column(name = "address")
    private String address;

    @Column(name = "provinceCode")
    private String provinceCode;

    @Column(name = "provinceName")
    private String provinceName;

    @Column(name = "districtCode")
    private String districtCode;

    @Column(name = "districtName")
    private String districtName;

    @Column(name = "wardCode")
    private String wardCode;

    @Column(name = "wardName")
    private String wardName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "deleted")
    private Boolean deleted;

    @Column(name = "total")
    private Double total;

    @Column(name = "sub_total")
    private Double subTotal;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(name = "payment")
    @Enumerated(EnumType.STRING)
    private Payment payment;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @OneToMany(mappedBy = "order")
    private List<OrderDetail> orderDetails;

    @OneToMany(mappedBy = "order")
    private List<History> histories;
}
