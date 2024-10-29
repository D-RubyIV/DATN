package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Collar;
import org.example.demo.entity.product.properties.Origin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface OriginRepository extends JpaRepository<Origin, Integer> {
    boolean existsByCodeAndName(String code, String name);
    @Query(value = """
            SELECT DISTINCT o FROM Origin o
            WHERE
            (:query IS NULL OR (LOWER(o.code) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(o.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:createdFrom IS NULL OR o.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR o.createdDate <= :createdTo)
            GROUP BY o
            """)
    Page<Origin> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );
}
