package org.example.entities;

import com.example.app.enums.ELoaiHoaDon;
import com.example.app.enums.ETrangThaiHoaDon;
import com.example.app.enums.ETrangThaiVanChuyen;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

import java.time.LocalDateTime;

@Entity
@Table(name = "hoa_don")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class HoaDon extends BaseEntity{
    @Column(unique = true)
    private String ma;

    private Double tongTien;
    private Double tongTienSauGiam;

    private String tenNguoiNhan;
    private String diaChiNhan;
    private String soDienThoaiNhan;

    private LocalDateTime ngayDatHang;
    private LocalDateTime ngayGiaoHang;
    private LocalDateTime ngayNhanHangDuKien;
    private LocalDateTime ngayNhanHang;

    @Enumerated(EnumType.STRING)
    private ETrangThaiHoaDon trangThai;

    @Enumerated(EnumType.STRING)
    private ETrangThaiVanChuyen trangThaiVanChuyen;

    @Enumerated(EnumType.STRING)
    private ELoaiHoaDon loaiHoaDon;

    private Double phiVanChuyen;

    @ManyToOne
    @JoinColumn
    private KhachHang khachHang;

    @ManyToOne
    @JoinColumn
    private PhieuGiamGia phieuGiamGia;

    @ManyToOne
    @JoinColumn
    private NhanVien nhanVien;

    @ManyToOne
    @JoinColumn
    private HinhThucThanhToan hinhThucThanhToan;

    private Boolean deleted = false;
    @Formula("concat_ws(' ', id, loaiHoaDon)") // Adjust according to your significant fields
    private String stringRepresentation;

}
