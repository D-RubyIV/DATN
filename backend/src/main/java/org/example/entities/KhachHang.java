package org.example.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "khach_hang")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class KhachHang extends BaseEntity{
    @Column(unique = true)
    private String ma;
    @Column(unique = true)
    private String email;
    private String password;
    private boolean gioiTinh;
    private String soDienThoai;
    private String hoTen;
    private LocalDateTime ngaySinh;
    private String trangThai;
    private Boolean deleted = false;

    @ManyToOne
    @JoinColumn
    private DiaChiNhan diaChiNhan;
}