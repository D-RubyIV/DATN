package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.ThicknessResponseDTO;
import org.example.demo.entity.product.properties.Thickness;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ThicknessResponseMapper extends IMapperBasic<Thickness, ThicknessResponseDTO> {
}
