package org.example.demo.service.staff;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.entity.human.staff.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * The interface IService1.
 * @param <E> Entity type
 * @param <ID> Type of entity ID
 * @param <RQ> Request DTO type
 */
public interface IService1<E, ID, RQ> {

    Page<StaffResponseDTO> findAllByPage(
            String code,
            String name,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable);

    E findById(ID id) throws BadRequestException;
    E delete(ID id) throws BadRequestException;
    E save(RQ requestDTO) throws BadRequestException;

    @Transactional
    StaffResponseDTO update(ID id, RQ requestDTO);
}
