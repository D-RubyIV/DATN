package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Thickness;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThicknessRepository extends JpaRepository<Thickness, Integer> {
    boolean existsByCodeAndName(String code, String name);

}
