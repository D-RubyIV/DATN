package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Texture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TextureRepository extends JpaRepository<Texture, Integer> {
    boolean existsByCodeAndName(String code, String name);

}
