package org.example.demo.entity.human.customer;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.hibernate.annotations.BatchSize;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "address")
public class Address extends BaseEntity {

    @Column(name = "phone")
    private String phone;

    @Column(name = "name")
    private String name;

    @Column(name = "province_id")
    private Integer provinceId;

    @Column(name = "province")
    private String province;

    @Column(name = "district_id")
    private Integer districtId;

    @Column(name = "district")
    private String district;

    @Column(name = "ward_id")
    private Integer wardId;

    @Column(name = "ward")
    private String ward;

    @Column(name = "detail")
    private String detail;

    @Column(name = "is_default")
    private Boolean defaultAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
