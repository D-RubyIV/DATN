package org.example.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "do_day_cua_vai")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class DoDayCuaVai extends BaseEntity{
    @Column(unique = true)
    private String ma;
    private String ten;
    private Boolean deleted = false;
}
