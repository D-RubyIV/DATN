package org.example.demo.repository.product.core;

import org.example.demo.entity.product.core.ProductDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ProductDetailRepository extends JpaRepository<ProductDetail, Integer> {
    boolean existsByCodeAndName(String code, String name);
    ProductDetail findByCodeAndName(String code, String name);
    ProductDetail findByName(String name);
    List<ProductDetail> findByProductId(Integer productId);
    @Query("SELECT p FROM ProductDetail p WHERE p.name = :name AND p.size = :size AND p.color = :color")
    ProductDetail findByNameAndSizeAndColor(@Param("name") String name, @Param("size") String size, @Param("color") String color);


    @Query(value = """
             SELECT DISTINCT pd FROM ProductDetail pd
             LEFT JOIN FETCH pd.size
             LEFT JOIN FETCH pd.color
             LEFT JOIN FETCH pd.texture
             LEFT JOIN FETCH pd.origin
             LEFT JOIN FETCH pd.brand
             LEFT JOIN FETCH pd.collar
             LEFT JOIN FETCH pd.sleeve
             LEFT JOIN FETCH pd.style
             LEFT JOIN FETCH pd.material
             LEFT JOIN FETCH pd.thickness
             LEFT JOIN FETCH pd.elasticity
             LEFT JOIN FETCH pd.image
             WHERE
             (:productId IS NULL OR pd.product.id = :productId)
             AND 
             (
                 (:query IS NULL OR LOWER(pd.code) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(pd.name) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(pd.brand.name) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(pd.collar.name) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(pd.color.name) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(pd.elasticity.name) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(pd.image.name) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(pd.origin.name) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(pd.size.name) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(pd.style.name) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(pd.sleeve.name) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(pd.thickness.name) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(pd.texture.name) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(CAST(pd.quantity AS string)) LIKE LOWER(CONCAT('%', :query, '%')))
                 OR (:query IS NULL OR LOWER(CAST(pd.price AS string)) LIKE LOWER(CONCAT('%', :query, '%')))
             )
             AND (:createdFrom IS NULL OR pd.createdDate >= :createdFrom)
             AND (:createdTo IS NULL OR pd.createdDate <= :createdTo)
            """)
    Page<ProductDetail> findAllByProductIdWithQuery(
            @Param("productId") Integer productId,
            @Param("query") String query,
            @Param("createdFrom") LocalDate createdFrom,
            @Param("createdTo") LocalDate createdTo,
            Pageable pageable
            // Uncomment if needed: @Param("deleted") Boolean deleted,
    );
}
