package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.TextureResponseDTO;
import org.example.demo.entity.product.properties.Texture;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TextureResponseMapper extends IMapperBasic<Texture, TextureResponseDTO> {
}
