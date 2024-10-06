package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.SizeResponseDTO;
import org.example.demo.entity.product.properties.Size;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SizeResponseMapper extends IMapperBasic<Size, SizeResponseDTO> {
}
