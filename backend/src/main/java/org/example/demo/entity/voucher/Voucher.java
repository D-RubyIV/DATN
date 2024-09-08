package org.example.demo.entity.voucher;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "voucher", uniqueConstraints = @UniqueConstraint(columnNames = {"code"}))
public class Voucher extends BaseEntity {

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "minAmount")
    private Integer minAmount;

    @Column(name = "maxPercent")
    private Integer maxPercent;

    @Column(name = "typeTicket")
    private String typeTicket;

    @Column(name = "startDate")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate startDate;

    @Column(name = "endDate")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate endDate;

    @Column(name = "deleted")
    private Boolean deleted;

    @ManyToMany
    @JoinTable(
            name = "voucher_customer",
            joinColumns = @JoinColumn(name = "voucher_id"),
            inverseJoinColumns = @JoinColumn(name = "customer_id")
    )
    private List<Customer> customers;

}
