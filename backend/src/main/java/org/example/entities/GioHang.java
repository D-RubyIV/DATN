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
@Table(name = "gio_hang")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class GioHang extends BaseEntity{
    private String trangThai;
    private Boolean deleted = false;

    @ManyToOne
    @JoinColumn
    private KhachHang khachHang;
}
