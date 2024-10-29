package org.example.demo.mapper.staff.request;

import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StaffRequestMapper extends IMapperBasic<Staff, StaffRequestDTO> {

    @Override
    Staff toEntity(StaffRequestDTO dto);

    // Chuyển đổi từ Staff entity sang StaffRequestDTO, bỏ qua trường `role` nếu không cần thiết
    @Override
    @Mapping(target = "role", ignore = true)
    StaffRequestDTO toDTO(Staff entity);

    // Cập nhật Staff entity hiện tại từ DTO, bỏ qua ID và deleted
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void updateEntity(StaffRequestDTO dto, @MappingTarget Staff entity);

    // Xử lý các trường hợp null đặc biệt sau khi ánh xạ
    @AfterMapping
    default void handleNulls(StaffRequestDTO dto, @MappingTarget Staff entity) {
        if (dto.getPhone() == null) {
            entity.setPhone(null);
        }
        // Tương tự cho các trường khác nếu cần thiết
    }
}
