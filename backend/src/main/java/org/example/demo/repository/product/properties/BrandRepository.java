package org.example.demo.repository.product.properties;

import org.example.demo.dto.product.response.properties.BrandResponseDTO;
import org.example.demo.entity.product.properties.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface BrandRepository extends JpaRepository<Brand,Integer> {
    boolean existsByCodeAndName(String code, String name);
    @Query(value = """
            SELECT DISTINCT b FROM Brand b
            WHERE
            (:query IS NULL OR (LOWER(b.code) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(b.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:createdFrom IS NULL OR b.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR b.createdDate <= :createdTo)
            GROUP BY b
            """)
    Page<Brand> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );
}
