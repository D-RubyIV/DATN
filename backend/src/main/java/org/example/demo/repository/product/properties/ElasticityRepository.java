package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Elasticity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ElasticityRepository extends JpaRepository<Elasticity, Integer> {
    boolean existsByCodeAndName(String code, String name);
}
