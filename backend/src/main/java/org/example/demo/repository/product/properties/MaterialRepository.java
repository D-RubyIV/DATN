package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Material;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<Material, Integer> {
    boolean existsByCodeAndName(String code, String name);
}
