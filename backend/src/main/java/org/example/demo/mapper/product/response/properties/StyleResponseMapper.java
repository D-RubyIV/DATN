package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.StyleResponseDTO;
import org.example.demo.entity.product.properties.Style;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StyleResponseMapper extends IMapperBasic<Style, StyleResponseDTO> {
}
