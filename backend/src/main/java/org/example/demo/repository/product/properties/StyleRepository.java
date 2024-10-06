package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Style;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StyleRepository extends JpaRepository<Style, Integer> {
    boolean existsByCodeAndName(String code, String name);
}
