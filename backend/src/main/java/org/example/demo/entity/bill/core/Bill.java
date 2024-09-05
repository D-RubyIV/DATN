package org.example.demo.entity.bill.core;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.bill.properties.History;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "bill", uniqueConstraints = @UniqueConstraint(columnNames = "code"))
public class Bill extends BaseEntity {
    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "phone")
    private String phone;

    @Column(name = "deleted")
    private Boolean deleted;

    @Column(name = "total")
    private Double total;

    @Column(name = "sub_total")
    private Double subTotal;

    @Column(name = "orderDate")
    private LocalDate orderDate;

    @OneToMany(mappedBy = "bills")
    private List<History> histories;



}
