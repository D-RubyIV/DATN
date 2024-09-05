package org.example.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hoa_don_chi_tiet")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class HoaDonChiTiet extends BaseEntity{
    @Column(unique = true)
    private String ma;
    private Double gia;
    private Integer soLuong;

    @ManyToOne
    @JoinColumn
    @JsonIgnore
    private HoaDon hoaDon;

    @ManyToOne
    @JoinColumn
    private SanPhamChiTiet sanPhamChiTiet;

    private Boolean deleted = false;

}
