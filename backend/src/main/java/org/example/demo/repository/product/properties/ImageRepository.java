package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Integer> {
    boolean existsByCodeAndName(String code, String name);
}
