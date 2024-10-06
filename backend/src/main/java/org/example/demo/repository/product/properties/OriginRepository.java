package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Origin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OriginRepository extends JpaRepository<Origin, Integer> {
    boolean existsByCodeAndName(String code, String name);
}
