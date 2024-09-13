package org.example.demo.service.staff;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.mapper.staff.response.StaffResponseMapper;
import org.example.demo.mapper.staff.request.StaffRequestMapper;
import org.example.demo.repository.staff.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class StaffService implements IService1<Staff, Integer, StaffRequestDTO> {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private StaffResponseMapper staffResponseMapper;

    @Autowired
    private StaffRequestMapper staffRequestMapper;

    @Override
    public Page<StaffResponseDTO> findAllByPage(
            String code,
            String name,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable) {

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Staff> query = cb.createQuery(Staff.class);
        Root<Staff> root = query.from(Staff.class);

        List<Predicate> predicates = new ArrayList<>();

        if (code != null) {
            predicates.add(cb.equal(root.get("code"), code));
        }
        if (name != null) {
            predicates.add(cb.like(root.get("name"), "%" + name + "%"));
        }
        if (fromDate != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("birthDay"), fromDate));
        }
        if (toDate != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("birthDay"), toDate));
        }

        query.where(predicates.toArray(new Predicate[0]));

        if (pageable.getSort().isSorted()) {
            List<Order> orders = new ArrayList<>();
            for (Sort.Order sortOrder : pageable.getSort()) {
                Path<Object> path = root.get(sortOrder.getProperty());
                orders.add(sortOrder.isAscending() ? cb.asc(path) : cb.desc(path));
            }
            query.orderBy(orders);
        }

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Staff> countRoot = countQuery.from(Staff.class);
        countQuery.select(cb.count(countRoot))
                .where(predicates.toArray(new Predicate[0]));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();

        TypedQuery<Staff> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<Staff> resultList = typedQuery.getResultList();

        return new PageImpl<>(staffResponseMapper.toListDTO(resultList), pageable, totalRecords);
    }

    @Override
    public Staff findById(Integer id) throws BadRequestException {
        return staffRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Staff not found"));
    }

    @Override
    @Transactional
    public Staff delete(Integer id) throws BadRequestException {
        Staff entityFound = findById(id);
        entityFound.setDeleted(true);
        return staffRepository.save(entityFound); // Ensure to save the state change
    }

    @Override
    @Transactional
    public Staff save(StaffRequestDTO requestDTO) throws BadRequestException {
        Staff entityMapped = staffRequestMapper.toEntity(requestDTO);
        entityMapped.setDeleted(false); // Default value for 'deleted'
        return staffRepository.save(entityMapped);
    }

    @Override
    @Transactional
    public StaffResponseDTO update(Integer id, StaffRequestDTO requestDTO) {
        Staff existingStaff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff with id " + id + " not found"));

        staffRequestMapper.updateEntity(requestDTO, existingStaff);
        Staff updatedStaff = staffRepository.save(existingStaff);
        return staffResponseMapper.toDTO(updatedStaff);
    }

    public StaffResponseDTO getStaffResponseDTO(Staff staff) {
        return staffResponseMapper.toDTO(staff);
    }

    public Staff updateStatus(Integer id, String newStatus) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Staff not found"));
        staff.setStatus(newStatus);
        return staffRepository.save(staff);
    }
}
