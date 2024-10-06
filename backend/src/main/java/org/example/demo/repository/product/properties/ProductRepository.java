package org.example.demo.repository.product.properties;

import org.example.demo.dto.product.response.properties.ProductWithQuantityDTO;
import org.example.demo.dto.product.response.properties.ProductWithQuantityResponseDTO;
import org.example.demo.entity.product.properties.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    boolean existsByCodeAndName(String code, String name);

    Optional<Product> findByName(String name);


    @Query(value = """
            SELECT DISTINCT p FROM Product p
            LEFT JOIN ProductDetail pd ON pd.product.id = p.id
            WHERE
            (:query IS NULL OR (LOWER(p.code) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:createdFrom IS NULL OR p.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR p.createdDate <= :createdTo)
            GROUP BY p
            """)
    Page<Product> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );



    @Query(value = """
        SELECT p.id as id, p.code as code, p.name as name, p.deleted as deleted, COALESCE(SUM(pd.quantity), 0) as quantity, p.createdDate as createdDate, p.updatedDate as modifiedDate 
        FROM Product p 
        LEFT JOIN ProductDetail pd ON p.id = pd.product.id
        WHERE
           (:query IS NULL OR (LOWER(p.code) LIKE LOWER(CONCAT('%', :query, '%'))
           OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
           )
           AND (:createdFrom IS NULL OR p.createdDate >= :createdFrom)
           AND (:createdTo IS NULL OR p.createdDate <= :createdTo)
        GROUP BY p.id, p.code, p.name, p.deleted, p.createdDate, p.updatedDate
        """)
    Page<ProductWithQuantityResponseDTO> findAllByPageWithQueryV2(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );

//    @Query("SELECT new org.example.demo.dto.product.response.properties.ProductWithQuantityDTO( " +
//            "p.id, " +
//            "p.code, " +
//            "p.name, " +
//            "p.deleted, " +
//            "COALESCE(SUM(pd.quantity), 0), " +
//            "p.createdDate, " +
//            "p.updatedDate) " +
//            "FROM Product p " +
//            "LEFT JOIN ProductDetail pd ON pd.product.id = p.id " +
//            "WHERE (:query IS NULL OR LOWER(p.code) LIKE LOWER(CONCAT('%', :query, '%')) " +
//            "OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
//            "AND (:createdFrom IS NULL OR p.createdDate >= :createdFrom) " +
//            "AND (:createdTo IS NULL OR p.createdDate <= :createdTo) " +
//            "GROUP BY p.id, p.code, p.name, p.deleted, p.createdDate, p.updatedDate")
//    Page<ProductWithQuantityDTO> findAllByPageWithQuery(
//            @Param("query") String query,
//            @Param("createdFrom") LocalDate createdFrom,
//            @Param("createdTo") LocalDate createdTo,
//            Pageable pageable);


}













