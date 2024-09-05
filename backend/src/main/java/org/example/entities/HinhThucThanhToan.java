package org.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hinh_thuc_thanh_toan")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class HinhThucThanhToan extends BaseEntity{
    private String ten;
    private Boolean deleted = false;

}
