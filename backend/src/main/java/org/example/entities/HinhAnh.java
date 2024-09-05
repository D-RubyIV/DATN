package org.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hinh_anh")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class HinhAnh extends BaseEntity{
    private String ten;
}
