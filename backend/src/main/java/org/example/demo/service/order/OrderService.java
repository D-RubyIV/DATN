package org.example.demo.service.order;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.example.demo.dto.history.request.HistoryRequestDTO;
import org.example.demo.dto.order.core.request.OrderRequestDTO;
import org.example.demo.dto.order.core.response.CountStatusOrder;
import org.example.demo.dto.order.core.response.OrderOverviewResponseDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.order.properties.History;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.mapper.order.core.request.OrderRequestMapper;
import org.example.demo.mapper.order.core.response.OrderResponseMapper;
import org.example.demo.repository.history.HistoryRepository;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.example.demo.service.IService;
import org.example.demo.util.RandomCodeGenerator;
import org.example.demo.util.phah04.PageableObject;
import org.example.demo.validate.group.GroupCreate;
import org.example.demo.validate.group.GroupUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

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
    private HistoryRepository historyRepository;

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

    @Autowired
    private RandomCodeGenerator randomCodeGenerator;

    @Autowired
    private StaffRepository staffRepository;

    public Page<OrderOverviewResponseDTO> findAllOverviewByPage(
            String status,
            String type,
            LocalDateTime createdFrom,
            LocalDateTime createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        return orderRepository.findAllByPageWithQuery(query, status, type, createdFrom, createdTo, pageable).map(s -> orderResponseMapper.toOverViewDTO(s));
    }

    @Override
    public Order findById(Integer id) {
        return orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Bill not found"));
    }

    @Override
    @Transactional
    public Order delete(Integer id) {
        Order entityFound = findById(id);
        entityFound.setDeleted(true);
        return entityFound;
    }

    @Override
    @Transactional
    public Order save(OrderRequestDTO requestDTO) {
        History orderHistory = new History();
        Order entityMapped = orderRequestMapper.toEntity(requestDTO);
        Staff staffDemo = staffRepository.findById(38).orElse(null); // demo nen set mac dinh

        entityMapped.setDeleted(false);
        entityMapped.setStatus(Status.PENDING);
        entityMapped.setCode(randomCodeGenerator.generateRandomCode());
        entityMapped.setStaff(staffDemo);

        orderHistory.setNote("Tạo Đơn Hàng");

        Customer customerSelected = requestDTO.getCustomer();
        Voucher voucherSelected = requestDTO.getVoucher();

        if (customerSelected != null && customerSelected.getId() != null) {
            Integer id = customerSelected.getId();
            customerSelected = customerRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Customer provided not found"));
            entityMapped.setCustomer(customerSelected);
        }
        if (voucherSelected != null && voucherSelected.getId() != null) {
            Integer id = voucherSelected.getId();
            voucherSelected = voucherRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Voucher provided not found"));
            entityMapped.setVoucher(voucherSelected);
        }
        return orderRepository.save(entityMapped);
    }

    @Override
    @Transactional
    public Order update(Integer id, OrderRequestDTO requestDTO) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Order not found with id: " + id));
        History history = new History();
        history.setOrder(order);
        // update customer
        if (requestDTO.getCustomer() != null) {
            if (requestDTO.getCustomer().getId() != null) {
                Customer selectedCustomer = customerRepository.findById(requestDTO.getCustomer().getId()).orElse(null);
                if (selectedCustomer != null) {
                    order.setCustomer(selectedCustomer);
                }
            }
            history.setNote("Thêm thông tin khách hàng");
        }
        // update voucher
        if (requestDTO.getVoucher() != null) {
            if (requestDTO.getVoucher().getId() != null) {
                Voucher selectedVoucher = voucherRepository.findById(requestDTO.getVoucher().getId()).orElse(null);
                if (selectedVoucher != null) {
                    order.setVoucher(selectedVoucher);
                }
            }
            history.setNote("Thêm thông tin khuyến mãi");
        }
        // UPDATE THEM
        // province
        order.setProvinceName(requestDTO.getProvinceName());
        order.setProvinceId(requestDTO.getProvinceId());
        // district
        order.setDistrictName(requestDTO.getDistrictName());
        order.setDistrictId(requestDTO.getDistrictName());
        // ward
        order.setWardName(requestDTO.getWardName());
        order.setWardId(requestDTO.getWardId());
        // return order
        return orderRepository.save(order);
    }

    @Transactional
    public Order changeStatus(Integer id, HistoryRequestDTO requestDTO) {
        Order entityFound = findById(id);
        entityFound.setStatus(requestDTO.getStatus());

        History history = new History();
        history.setOrder(entityFound);
        history.setNote(requestDTO.getNote());
        history.setStatus(requestDTO.getStatus());
        historyRepository.save(history);
        return orderRepository.save(entityFound);
    }

    public void reloadTotalOrder(Order order) {
        double total = 0;

        List<OrderDetail> orderDetailList = order.getOrderDetails();

        for (OrderDetail or : orderDetailList) {
            total += or.getQuantity() * or.getProductDetail().getPrice();
        }

        order.setTotal(total);
        orderRepository.save(order);
    }

    public CountStatusOrder getCountStatusAnyOrder() {
        return orderRepository.getCountStatus();
    }

//    public Order changeInfoCustomer(Integer id, OrderRequestDTO requestDTO) {
//        Order order = orderRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
//
//        Customer existingCustomer = order.getCustomer();
//        if (existingCustomer == null) {
//            throw new EntityNotFoundException("Customer not found in the order.");
//        }
//        if (requestDTO.getCustomer().getName() != null) {
//            existingCustomer.setName(requestDTO.getCustomer().getName());
//        }
//        if (requestDTO.getCustomer().getAddresses() != null) {
//            existingCustomer.setAddresses(requestDTO.getCustomer().getAddresses());
//        }
//        if (requestDTO.getCustomer().getPhone() != null) {
//            existingCustomer.setPhone(requestDTO.getCustomer().getPhone());
//        }
//        // bug : thay doi dia chi thi phai tinh lai phi ship (Chua lam)
//        customerRepository.save(existingCustomer);
//
//        History history = new History();
//        history.setOrder(order);
//        history.setStatus(Status.EDIT_AN_ORDER);
//        history.setNote("Cập nhật thông tin khách hàng!");
//        historyRepository.save(history);
//        return orderRepository.save(order);
//    }
}
