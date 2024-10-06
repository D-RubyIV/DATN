package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.SleeveResponseDTO;
import org.example.demo.entity.product.properties.Sleeve;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SleeveResponseMapper extends IMapperBasic<Sleeve, SleeveResponseDTO> {
}
