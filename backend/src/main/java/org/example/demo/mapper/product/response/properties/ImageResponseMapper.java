package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.ImageResponseDTO;
import org.example.demo.entity.product.properties.Image;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImageResponseMapper extends IMapperBasic<Image, ImageResponseDTO> {
}
