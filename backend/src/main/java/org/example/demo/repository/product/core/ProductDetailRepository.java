package org.example.demo.repository.product.core;

import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.Product;
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