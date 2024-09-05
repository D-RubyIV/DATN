package org.example.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "loai_hoa_tiet")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class LoaiHoaTIet extends BaseEntity{
    @Column(unique = true)
    private String ma;
    private String ten;
    private Boolean deleted = false;
}
