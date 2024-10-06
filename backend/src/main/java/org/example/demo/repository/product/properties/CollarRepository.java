package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Collar;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollarRepository extends JpaRepository<Collar, Integer> {
    boolean existsByCodeAndName(String code, String name);
}
