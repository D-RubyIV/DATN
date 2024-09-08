package org.example.demo.mapper.history.response;

import org.example.demo.dto.history.response.HistoryResponseDTO;
import org.example.demo.entity.bill.properties.History;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface HistoryResponseMapper {
    History toEntity(HistoryResponseDTO d);
    List<History> toListEntity(List<HistoryResponseDTO> d);


    HistoryResponseDTO toDTO(History e);
    List<HistoryResponseDTO> toListDTO(List<History> e);
}
