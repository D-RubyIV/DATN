package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.OriginResponseDTO;
import org.example.demo.entity.product.properties.Origin;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OriginResponseMapper extends IMapperBasic<Origin, OriginResponseDTO> {
}
