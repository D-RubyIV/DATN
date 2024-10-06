package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.ElasticityResponseDTO;
import org.example.demo.entity.product.properties.Elasticity;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ElasticityResponseMapper extends IMapperBasic<Elasticity, ElasticityResponseDTO> {
}
