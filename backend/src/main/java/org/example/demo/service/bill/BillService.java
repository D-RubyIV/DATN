package org.example.demo.service.bill;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.bill.request.BillRequestDTO;
import org.example.demo.dto.bill.response.BillOverviewResponseDTO;
import org.example.demo.dto.bill.response.BillResponseDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.entity.bill.enums.Status;
import org.example.demo.entity.bill.enums.Type;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.mapper.bill.request.BillRequestMapper;
import org.example.demo.mapper.bill.response.BillResponseMapper;
import org.example.demo.repository.bill.BillRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.example.demo.service.IService;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@Slf4j
@Service
public class BillService implements IService<Bill, Integer, BillRequestDTO> {
    @Autowired
    private BillRepository billRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private BillResponseMapper billResponseMapper;

    @Autowired
    private BillRequestMapper billRequestMapper;

    public Page<Bill> findAll(Pageable pageable) {
        return billRepository.findAll(pageable);
    }

    public Page<BillResponseDTO> findAllByPage(
            String code,
            LocalDate fromDate,
            LocalDate toDate,
            Double fromTotal,
            Double toTotal,
            Pageable pageable
    ) {

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Bill> query = cb.createQuery(Bill.class);
        Root<Bill> root = query.from(Bill.class);
        root.fetch("customer", JoinType.LEFT);
        root.fetch("voucher", JoinType.LEFT);
        root.fetch("histories", JoinType.LEFT);
        root.fetch("staff", JoinType.LEFT).fetch("role", JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();

        if (code != null) {
            predicates.add(cb.equal(root.get("code"), code));
        }
        if (fromDate != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("createdDate"), fromDate));
        }
        if (toDate != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("createdDate"), toDate));
        }
        if (fromTotal != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("total"), fromTotal));
        }
        if (toTotal != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("total"), toTotal));
        }

        // Áp dụng các điều kiện lọc vào truy vấn
        query.where(predicates.toArray(new Predicate[0]));

        // Thêm điều kiện sắp xếp
        if (pageable.getSort().isSorted()) {
            List<Order> orders = new ArrayList<>();
            for (Sort.Order sortOrder : pageable.getSort()) {
                Path<Object> path = root.get(sortOrder.getProperty());
                orders.add(sortOrder.isAscending() ? cb.asc(path) : cb.desc(path));
            }
            query.orderBy(orders);
        }

        // Query để đếm tổng số bản ghi
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Bill> countRoot = countQuery.from(Bill.class);
        countQuery.select(cb.count(countRoot))
                .where(predicates.toArray(new Predicate[0]));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();

        // Query để lấy dữ liệu phân trang
        TypedQuery<Bill> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<Bill> resultList = typedQuery.getResultList();

        // Trả về Page với tổng số lượng bản ghi và dữ liệu đã sắp xếp
        return new PageImpl<>(billResponseMapper.toListDTO(resultList), pageable, totalRecords);
    }

    public Page<BillOverviewResponseDTO> findAllOverviewByPage(
            String code,
            String phone,
            String customerName,
            String staffName,
            Status status,
            Type type,
            LocalDate createdFrom,
            LocalDate createdTo,
            Pageable pageable
    ) {
        return billRepository.findAllByPageWithQuery(code, phone, customerName, staffName, status, type, createdFrom, createdTo, pageable).map(s -> billResponseMapper.toOverViewDTO(s));
    }


    @Override
    public Bill findById(Integer id) throws BadRequestException {
        return billRepository.findById(id).orElseThrow(() -> new BadRequestException("Bill not found"));
    }

    @Override
    @Transactional
    public Bill delete(Integer id) throws BadRequestException {
        Bill entityFound = findById(id);
        entityFound.setDeleted(true);
        return entityFound;
    }

    @Override
    @Transactional
    public Bill save(BillRequestDTO requestDTO) throws BadRequestException {
        Bill entityMapped = billRequestMapper.toEntity(requestDTO);
        entityMapped.setDeleted(false);
        entityMapped.setStatus(Status.PENDING);

        Customer customerSelected = requestDTO.getCustomer();
        Voucher voucherSelected = requestDTO.getVoucher();

        if (customerSelected != null && customerSelected.getId() != null) {
            Integer id = customerSelected.getId();
            customerSelected = customerRepository.findById(id).orElseThrow(() -> new BadRequestException("Customer provided not found"));
            entityMapped.setCustomer(customerSelected);
        }
        if (voucherSelected != null && voucherSelected.getId() != null) {
            Integer id = voucherSelected.getId();
            voucherSelected = voucherRepository.findById(id).orElseThrow(() -> new BadRequestException("Voucher provided not found"));
            entityMapped.setVoucher(voucherSelected);
        }
        return billRepository.save(entityMapped);
    }

    @Override
    @Transactional
    public Bill update(Integer integer, BillRequestDTO requestDTO) {
        return null;
    }

    @Transactional
    public Bill changeStatus(Integer id, Status status) throws BadRequestException {
        Bill entityFound = findById(id);
        entityFound.setStatus(status);
        System.out.println(status);
        return billRepository.save(entityFound);
    }
}
