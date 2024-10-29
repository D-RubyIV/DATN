package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.phah04.response.ProductOverviewResponse;
import org.example.demo.dto.product.response.properties.ProductResponseDTO;
import org.example.demo.dto.product.response.properties.ProductWithQuantityDTO;
import org.example.demo.dto.product.response.properties.ProductWithQuantityResponseDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.Product;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;


@Mapper(componentModel = "spring")
public interface ProductResponseMapper {

    Product toEntity(ProductResponseDTO dto);
    List<Product> toListEntity(List<ProductResponseDTO> dtoList);


}

