package org.example.demo.mapper.product.response.core;

import org.example.demo.dto.product.response.core.ProductDetailResponseDTO;
import org.example.demo.dto.product.response.properties.ProductResponseDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.Product;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductDetailResponseMapper extends IMapperBasic<ProductDetail, ProductDetailResponseDTO> {

}
