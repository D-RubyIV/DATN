package org.example.demo.repository.product.core;

import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.Color;
import org.example.demo.entity.product.properties.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.List;

public interface ProductDetailRepository extends JpaRepository<ProductDetail, Integer> {
    boolean existsByCodeAndName(String code, String name);

    ProductDetail findByCodeAndName(String code, String name);
    @Query("SELECT p FROM ProductDetail p WHERE p.name = ?1 AND p.size = ?2 AND p.color = ?3")
     ProductDetail findByName(String name, Size size, Color color);

    List<ProductDetail> findByProductId(Integer productId);

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
            LEFT JOIN FETCH pd.images
            
         
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
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );



    // BY PHAH04
    @Query(value = """
            SELECT DISTINCT pd FROM ProductDetail pd
            LEFT JOIN FETCH pd.size pdse
            LEFT JOIN FETCH pd.color pdcr
            LEFT JOIN FETCH pd.product pdpt
            LEFT JOIN FETCH pd.texture pdt
            LEFT JOIN FETCH pd.origin pdo
            LEFT JOIN FETCH pd.brand pdbr
            LEFT JOIN FETCH pd.collar pdc
            LEFT JOIN FETCH pd.sleeve pds
            LEFT JOIN FETCH pd.material pdm
            LEFT JOIN FETCH pd.thickness pdth
            LEFT JOIN FETCH pd.elasticity pde
            WHERE
            (
                (:query IS NULL OR LOWER(pd.code) LIKE LOWER(CONCAT('%', :query, '%')))
                OR
                (:query IS NULL OR LOWER(pd.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:size IS NULL OR pd.size.id = :size)
            AND (:color IS NULL OR pd.color.id = :color)
            AND (:product IS NULL OR pd.product.id = :product)
            AND (:texture IS NULL OR pd.texture.id = :texture)
            AND (:origin IS NULL OR pd.origin.id = :origin)
            AND (:brand IS NULL OR pd.brand.id = :brand)
            AND (:collar IS NULL OR pd.collar.id = :collar)
            AND (:sleeve IS NULL OR pd.sleeve.id = :sleeve)
            AND (:material IS NULL OR pd.material.id = :material)
            AND (:thickness IS NULL OR pd.thickness.id = :thickness)
            AND (:elasticity IS NULL OR pd.elasticity.id = :elasticity)
            """)
    Page<ProductDetail> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("size") Integer size,
            @Param("color") Integer color,
            @Param("product") Integer product,
            @Param("texture") Integer texture,
            @Param("origin") Integer origin,
            @Param("brand") Integer brand,
            @Param("collar") Integer collar,
            @Param("sleeve") Integer sleeve,
            @Param("material") Integer material,
            @Param("thickness") Integer thickness,
            @Param("elasticity") Integer elasticity,
            Pageable pageable
    );

}
