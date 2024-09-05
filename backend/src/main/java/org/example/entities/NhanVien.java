package org.example.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "nhan_vien")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class NhanVien extends BaseEntity{
    @Column(unique = true)
    private String ma;
    private String email;
    private String password;
    private String hoTen;
    private String diaChi;
    private boolean gioiTinh;
    private String soDienThoai;
    private String CCCD;
    private Date ngaySinh;
    private String trangThai;
    private String ghiChu;
    private Boolean deleted = false;
    @OneToOne
    private ChucVu chucVu;

}
