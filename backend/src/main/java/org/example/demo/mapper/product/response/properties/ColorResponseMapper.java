package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.ColorResponseDTO;
import org.example.demo.entity.product.properties.Color;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ColorResponseMapper extends IMapperBasic<Color, ColorResponseDTO> {
}
