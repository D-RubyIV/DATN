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

@Entity
@Table(name = "san_pham_chi_tiet")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SanPhamChiTiet extends BaseEntity{

    @Column(unique = true)
    private String ma;

    private Long soLuong;

    private Double gia;

    private String moTaNgan;

    private String moTaChiTiet;

    @ManyToOne
    @JoinColumn
    private SanPham sanPham;

    @ManyToOne
    @JoinColumn
    private MauSac mauSac;

    @ManyToOne
    @JoinColumn
    private KichThuoc kichThuoc;

    @ManyToOne
    @JoinColumn
    private LoaiHoaTIet loaiHoaTIet;

    @ManyToOne
    @JoinColumn
    private MoTaHoaTiet moTaHoaTiet;

    @ManyToOne
    @JoinColumn
    private NuocSanXuat nuocSanXuat;

    @ManyToOne
    @JoinColumn
    private ThuongHieu thuongHieu;

    @ManyToOne
    @JoinColumn
    private KieuCoAo kieuCoAo;

    @ManyToOne
    @JoinColumn
    private KieuTaiAo kieuTaiAo;

    @ManyToOne
    @JoinColumn
    private KieuDangAo kieuDangAo;

    @ManyToOne
    @JoinColumn
    private ChatLieu chatLieu;

    @ManyToOne
    @JoinColumn
    private DoDayCuaVai doDayCuaVai;

    @ManyToOne
    @JoinColumn
    private KhaNangCoDan khaNangCoDan;

    @ManyToOne
    @JoinColumn
    private HinhAnh hinhAnh;

    private Boolean deleted = false;
}

