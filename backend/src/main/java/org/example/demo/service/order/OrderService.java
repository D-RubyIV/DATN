package org.example.demo.service.order;

import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.history.request.HistoryRequestDTO;
import org.example.demo.dto.order.core.request.OrderRequestDTO;
import org.example.demo.dto.order.core.response.CountStatusOrder;
import org.example.demo.dto.order.core.response.OrderOverviewResponseDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.order.properties.History;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.payment.Payment;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.exception.EntityNotFoundException;
import org.example.demo.infrastructure.constant.PaymentMethodConstant;
import org.example.demo.infrastructure.session.UserSession;
import org.example.demo.mapper.order.core.request.OrderRequestMapper;
import org.example.demo.mapper.order.core.response.OrderResponseMapper;
import org.example.demo.repository.history.HistoryRepository;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.payment.PaymentRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.example.demo.service.IService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@Slf4j
@Service
public class OrderService implements IService<Order, Integer, OrderRequestDTO>,IOrderService {
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
    private StaffRepository staffRepository;

    @Autowired
    private UserSession session;

    @Autowired
    private PaymentRepository paymentRepository;

    private String genOrderCode() {
        String prefix = "HD230104";
        int x = 1;
        String code = prefix + x;
        while (orderRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }



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

    // hùng code (k đúng thì sửa nhé ><)
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Order create() throws BadRequestException {
        Order order = new Order();
        History orderHistory = new History();
//        if signIn
//        Integer idStaff = session.getCustomer().getId();
//        Staff staff = staffRepository.findById(idStaff).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Staff not found"));
        Optional<Staff> staffDemo = staffRepository.findById(38); // demo nen set mac dinh
        order.setStaff(staffDemo.get());
        order.setStatus(Status.CREATE_AN_ORDER);
        order.setCode(this.genOrderCode());
        Order orderSaved = orderRepository.save(order);

        orderHistory.setOrder(orderSaved);
        orderHistory.setStatus(orderSaved.getStatus());
        orderHistory.setNote("Tạo Đơn Hàng");
        historyRepository.save(orderHistory);
        return orderSaved;
    }

    // day la create bill tuong duong voi update
    @Override
    @Transactional
    public Order update(Integer id, OrderRequestDTO requestDTO) {
        if (requestDTO.getVoucher() != null) {
            Voucher voucher = voucherRepository.findById(requestDTO.getVoucher().getId()).get();
            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepository.save(voucher);
        }
        History history = new History();
        Payment payment = new Payment();
        Order order = orderRequestMapper.toEntity(requestDTO);
        history.setOrder(order);
        payment.setOrder(order);
        payment.setType(PaymentMethodConstant.CUSTOMER_PAYMENT);

        if (requestDTO.getWaitPayment()) {
            order.setStatus(Status.WAITING_YOUR_PAYMENT);
            history.setStatus(Status.WAITING_YOUR_PAYMENT);
            historyRepository.save(history);
            orderRepository.save(order);
            return order;
        }

        if (requestDTO.getType() == Type.INSTORE) {
            order.setStatus(Status.DELIVERED);
            History history1 = new History();
            history1.setOrder(order);
            history1.setNote("Đã xác nhận thông tin!");
            history1.setStatus(Status.CONFIRM_PAYMENT);
            historyRepository.save(history1);
            if (requestDTO.getPaymentMethod() == PaymentMethodConstant.CASH) {
                payment.setTotalMoney(order.getTotal());
                payment.setNote("Đã thanh toán bằng tiền mặt!");
                payment.setMethod(PaymentMethodConstant.CASH);
                paymentRepository.save(payment);
            } else if (requestDTO.getPaymentMethod() == PaymentMethodConstant.BANK_TRANSFER) {
                payment.setTotalMoney(order.getTotal());
                payment.setNote("Đã thanh toán bằng hình thức chuyển khoản!");
                payment.setTradingCode(requestDTO.getTradingCode());
                payment.setMethod(PaymentMethodConstant.BANK_TRANSFER);
                paymentRepository.save(payment);
            }
            history.setNote("Thanh toán thành công! Vui lòng ra quầy lấy hàng!");
            history.setStatus(Status.DELIVERED);
        } else if (requestDTO.getType() == Type.ONLINE) {
            order.setStatus(Status.TOSHIP);
            history.setStatus(Status.TOSHIP);
            history.setNote("Chờ giao hàng");
            if (requestDTO.getPaymentMethod() == PaymentMethodConstant.BANK_TRANSFER) {
                History history1 = new History();
                history1.setOrder(order);
                history1.setNote("Đã xác nhận thong tin thanh toán");
                history1.setStatus(Status.CONFIRM_PAYMENT);
                historyRepository.save(history1);
                payment.setTotalMoney(order.getTotal()); // chỗ này chưa tính phí ship dùng bên khác thì làm như nào nhỉ
                payment.setNote("Đã thanh toán bằng hình thức chuyển khoản!");
                payment.setTradingCode(requestDTO.getTradingCode());
                payment.setMethod(PaymentMethodConstant.BANK_TRANSFER);
                paymentRepository.save(payment);
            }
        }
        historyRepository.save(history);
        orderRepository.save(order);
        return order;
    }


    @Override
    public Order changeInforCustomer(Integer id, OrderRequestDTO requestDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));

        Customer existingCustomer  = order.getCustomer();
        if (existingCustomer == null) {
            throw new EntityNotFoundException("Customer not found in the order.");
        }
        if (requestDTO.getCustomer().getName() != null) {
            existingCustomer.setName(requestDTO.getCustomer().getName());
        }
        if (requestDTO.getCustomer().getAddresses() != null) {
            existingCustomer.setAddresses(requestDTO.getCustomer().getAddresses());
        }
        if (requestDTO.getCustomer().getPhone() != null) {
            existingCustomer.setPhone(requestDTO.getCustomer().getPhone());
        }
        // bug : thay doi dia chi thi phai tinh lai phi ship (Chua lam)
        customerRepository.save(existingCustomer);

        History history = new History();
        history.setOrder(order);
        history.setStatus(Status.EDIT_AN_ORDER);
        history.setNote("Cập nhật thông tin khách hàng!");
        historyRepository.save(history);
        return orderRepository.save(order);
    }


    @Override
    @Transactional
    public Order save(OrderRequestDTO requestDTO) {
        Order entityMapped = orderRequestMapper.toEntity(requestDTO);
        entityMapped.setDeleted(false);
        entityMapped.setStatus(Status.PENDING);


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


//    @Override
//    @Transactional
//    public Order update(Integer id, OrderRequestDTO requestDTO) {
//        return null;
//    }


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


}
