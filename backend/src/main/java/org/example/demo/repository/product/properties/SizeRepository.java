package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Size;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SizeRepository extends JpaRepository<Size, Integer> {
    boolean existsByCodeAndName(String code, String name);
}
