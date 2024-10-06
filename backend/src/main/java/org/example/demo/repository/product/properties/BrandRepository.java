package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand,Integer> {
    boolean existsByCodeAndName(String code, String name);
}
