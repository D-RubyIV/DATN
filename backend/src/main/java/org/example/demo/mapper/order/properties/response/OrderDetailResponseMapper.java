package org.example.demo.mapper.order.properties.response;

import org.example.demo.dto.order.properties.response.OrderDetailResponseDTO;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderDetailResponseMapper extends IMapperBasic<OrderDetail, OrderDetailResponseDTO> {
}
