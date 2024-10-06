package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.MaterialResponseDTO;
import org.example.demo.entity.product.properties.Material;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MaterialResponseMapper extends IMapperBasic<Material, MaterialResponseDTO> {
}
