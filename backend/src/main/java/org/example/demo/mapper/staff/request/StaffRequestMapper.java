package org.example.demo.mapper.staff.request;


import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StaffRequestMapper extends IMapperBasic<Staff, StaffRequestDTO> {

    @Override
    @Mapping(target = "role", ignore = true) // Ignore role if not used
    Staff toEntity(StaffRequestDTO dto);

    @Override
    @Mapping(target = "role", ignore = true) // Ignore role if not used
    StaffRequestDTO toDTO(Staff entity);

    @Mapping(target = "id", ignore = true) // Ensure ID is not overwritten
    @Mapping(target = "deleted", ignore = true) // Ensure deleted flag is not overwritten
    void updateEntity(StaffRequestDTO dto, @MappingTarget Staff entity);
}

