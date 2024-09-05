package org.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "gio_hang_chi_tiet")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class GioHangChiTiet extends BaseEntity{
    private Integer soLuong;
    private Boolean deleted = false;

    @ManyToOne
    @JoinColumn
    private SanPhamChiTiet sanPhamChiTiet;

    @ManyToOne
    @JoinColumn
    private GioHang gioHang;

}
