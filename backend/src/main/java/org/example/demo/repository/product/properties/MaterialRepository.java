package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Collar;
import org.example.demo.entity.product.properties.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface MaterialRepository extends JpaRepository<Material, Integer> {
    boolean existsByCodeAndName(String code, String name);
    @Query(value = """
            SELECT DISTINCT m FROM Material m
            WHERE
            (:query IS NULL OR (LOWER(m.code) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:createdFrom IS NULL OR m.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR m.createdDate <= :createdTo)
            GROUP BY m
            """)
    Page<Material> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );
}
