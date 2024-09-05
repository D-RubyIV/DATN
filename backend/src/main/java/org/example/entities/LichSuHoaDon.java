package org.example.entities;

import com.example.app.enums.ETrangThaiHoaDon;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lich_su_hoa_don")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class LichSuHoaDon extends BaseEntity{
    @ManyToOne
    @JoinColumn
    private HoaDon hoaDon;
    private ETrangThaiHoaDon trangThaiDonHang;
    private String note;
    private Boolean deleted = false;
}
