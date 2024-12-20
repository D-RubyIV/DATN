package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Collar;
import org.example.demo.entity.product.properties.Texture;
import org.example.demo.entity.product.properties.Thickness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface ThicknessRepository extends JpaRepository<Thickness, Integer> {
    boolean existsByCodeAndName(String code, String name);
    @Query(value = """
            SELECT DISTINCT t FROM Thickness t
            WHERE
            (:query IS NULL OR (LOWER(t.code) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:createdFrom IS NULL OR t.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR t.createdDate <= :createdTo)
            GROUP BY t
            """)
    Page<Thickness> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );

}
