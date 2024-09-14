package org.example.demo.service.order;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.order.request.OrderRequestDTO;
import org.example.demo.dto.order.response.OrderOverviewResponseDTO;
import org.example.demo.dto.order.response.OrderResponseDTO;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.mapper.order.request.OrderRequestMapper;
import org.example.demo.mapper.order.response.OrderResponseMapper;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.example.demo.service.IService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
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
public class OrderService implements IService<Order, Integer, OrderRequestDTO> {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private OrderResponseMapper orderResponseMapper;

    @Autowired
    private OrderRequestMapper orderRequestMapper;

    public Page<Order> findAll(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Page<OrderResponseDTO> findAllByPage(
            String code,
            LocalDate fromDate,
            LocalDate toDate,
            Double fromTotal,
            Double toTotal,
            Pageable pageable
    ) {

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Order> query = cb.createQuery(org.example.demo.entity.order.core.Order.class);
        Root<Order> root = query.from(org.example.demo.entity.order.core.Order.class);
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
            List<jakarta.persistence.criteria.Order> orders = new ArrayList<>();
            for (Sort.Order sortOrder : pageable.getSort()) {
                Path<Object> path = root.get(sortOrder.getProperty());
                orders.add(sortOrder.isAscending() ? cb.asc(path) : cb.desc(path));
            }
            query.orderBy(orders);
        }

        // Query để đếm tổng số bản ghi
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<org.example.demo.entity.order.core.Order> countRoot = countQuery.from(org.example.demo.entity.order.core.Order.class);
        countQuery.select(cb.count(countRoot))
                .where(predicates.toArray(new Predicate[0]));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();

        // Query để lấy dữ liệu phân trang
        TypedQuery<org.example.demo.entity.order.core.Order> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<org.example.demo.entity.order.core.Order> resultList = typedQuery.getResultList();

        // Trả về Page với tổng số lượng bản ghi và dữ liệu đã sắp xếp
        return new PageImpl<>(orderResponseMapper.toListDTO(resultList), pageable, totalRecords);
    }

    public Page<OrderOverviewResponseDTO> findAllOverviewByPage(
            String status,
            String type,
            LocalDate createdFrom,
            LocalDate createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        return orderRepository.findAllByPageWithQuery(query, status, type, createdFrom, createdTo, pageable).map(s -> orderResponseMapper.toOverViewDTO(s));
    }


    @Override
    public Order findById(Integer id) throws BadRequestException {
        return orderRepository.findById(id).orElseThrow(() -> new BadRequestException("Bill not found"));
    }

    @Override
    @Transactional
    public Order delete(Integer id) throws BadRequestException {
        Order entityFound = findById(id);
        entityFound.setDeleted(true);
        return entityFound;
    }

    @Override
    @Transactional
    public Order save(OrderRequestDTO requestDTO) throws BadRequestException {
        Order entityMapped = orderRequestMapper.toEntity(requestDTO);
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
        return orderRepository.save(entityMapped);
    }

    @Override
    @Transactional
    public Order update(Integer integer, OrderRequestDTO requestDTO) {
        return null;
    }

    @Transactional
    public Order changeStatus(Integer id, Status status) throws BadRequestException {
        Order entityFound = findById(id);
        entityFound.setStatus(status);
        System.out.println(status);
        return orderRepository.save(entityFound);
    }
}
