package org.example.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nuoc_san_xuat")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class NuocSanXuat extends BaseEntity{
    @Column(unique = true)
    private String ma;
    private String ten;
    private Boolean deleted = false;
}
