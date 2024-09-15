package org.example.demo.mapper.order.properties.response;

import org.example.demo.dto.order.properties.response.ProductDetailResponseDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductDetailResponseMapper extends IMapperBasic<ProductDetail, ProductDetailResponseDTO> {
}
