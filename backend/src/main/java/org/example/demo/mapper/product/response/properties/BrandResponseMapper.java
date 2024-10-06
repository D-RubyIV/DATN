package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.BrandResponseDTO;
import org.example.demo.entity.product.properties.Brand;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandResponseMapper extends IMapperBasic<Brand, BrandResponseDTO> {
}
