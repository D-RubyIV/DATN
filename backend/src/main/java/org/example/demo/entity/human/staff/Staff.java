package org.example.demo.entity.human.staff;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.role.Role;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "staff", uniqueConstraints = @UniqueConstraint(columnNames = {"code", "email", "phone"}))
public class Staff extends BaseEntity {

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

    @Column(name = "citizenId")
    private String citizenId;

    @Column(name = "address")
    private String address;

    @Column(name = "province")
    private String province;

    @Column(name = "district")
    private String district;

    @Column(name = "ward")
    private String ward;

    @Column(name = "status")
    private String status;

    @Column(name = "note")
    private String note;

    @Column(name = "birthDay")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDay;

    @Column(name = "deleted")
    private Boolean deleted;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
}
