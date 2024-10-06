package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Sleeve;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SleeveRepository extends JpaRepository<Sleeve, Integer> {
    boolean existsByCodeAndName(String code, String name);
}
