package org.example.demo.mapper.product.phah04;

import org.example.demo.dto.order.properties.response.ProductDetailResponseDTO;
import org.example.demo.dto.product.phah04.response.ProductOverviewResponse;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductDetailResponseMapper extends IMapperBasic<ProductDetail, ProductDetailResponseDTO> {
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
    ProductOverviewResponse toOverviewDTO(ProductDetail productDetail);
    List<ProductOverviewResponse> toOverviewDTOs(List<ProductDetail> productDetailList);
}
