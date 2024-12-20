package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Collar;
import org.example.demo.entity.product.properties.Texture;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface TextureRepository extends JpaRepository<Texture, Integer> {
    boolean existsByCodeAndName(String code, String name);
    @Query(value = """
            SELECT DISTINCT t FROM Texture t
            WHERE
            (:query IS NULL OR (LOWER(t.code) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:createdFrom IS NULL OR t.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR t.createdDate <= :createdTo)
            GROUP BY t
            """)
    Page<Texture> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );

}
