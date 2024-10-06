package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.entity.product.properties.Collar;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CollarResponseMapper extends IMapperBasic<Collar, CollarResponseDTO> {
}
