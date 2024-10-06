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

//    ProductResponseDTO toOverViewDTO(ProductWithQuantityDTO e);
    ProductResponseDTO toOverViewDTO(Product e);
    List<ProductResponseDTO> toListOverViewDTO(List<Product> e);


    @Mapping(target = "sizeName", source = "size.name")
    @Mapping(target = "colorName", source = "color.name")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "textureName", source = "texture.name")
    @Mapping(target = "originName", source = "origin.name")
    @Mapping(target = "brandName", source = "brand.name")
    @Mapping(target = "collarName", source = "collar.name")
    @Mapping(target = "sleeveName", source = "sleeve.name")
    @Mapping(target = "materialName", source = "material.name")
    @Mapping(target = "thicknessName", source = "thickness.name")
    @Mapping(target = "elasticityName", source = "elasticity.name")
    ProductOverviewResponse toOverviewDTOPhah04(ProductDetail productDetail);
    List<ProductOverviewResponse> toOverviewDTOPhah04s(List<ProductDetail> productDetailList);
}

