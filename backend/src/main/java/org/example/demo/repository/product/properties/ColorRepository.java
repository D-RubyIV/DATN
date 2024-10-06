package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Color;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColorRepository extends JpaRepository<Color, Integer> {
    boolean existsByCodeAndName(String code, String name);
}
