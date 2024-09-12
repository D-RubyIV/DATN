package org.example.demo.entity.human.customer;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import org.example.demo.entity.BaseEntity;
import org.hibernate.annotations.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "customer", uniqueConstraints = @UniqueConstraint(columnNames = {"code", "email", "phone"}))
public class Customer extends BaseEntity {

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "password")
    private String password;

    @Column(name = "deleted")
    private Boolean deleted;

    @Column(name = "birthDay")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDay;

    @OneToMany(mappedBy = "customer")
    @Fetch(value = FetchMode.SUBSELECT)
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Address> addresses;

}
