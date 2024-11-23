package org.example.demo.service.order;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.example.demo.dto.ghn.FeeDTO;
import org.example.demo.dto.ghn.ItemDTO;
import org.example.demo.dto.history.request.HistoryRequestDTO;
import org.example.demo.dto.order.core.request.OrderRequestDTO;
import org.example.demo.dto.order.core.response.CountStatusOrder;
import org.example.demo.dto.order.core.response.OrderOverviewResponseDTO;
import org.example.demo.dto.order.other.UseOrderVoucherDTO;
import org.example.demo.dto.statistic.response.StatisticOverviewResponse;
import org.example.demo.entity.cart.core.CartDetail;
import org.example.demo.entity.cart.properties.Cart;
import org.example.demo.entity.event.Event;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Payment;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.order.properties.History;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.security.Account;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.mapper.order.core.request.OrderRequestMapper;
import org.example.demo.mapper.order.core.response.OrderResponseMapper;
import org.example.demo.model.response.ICountOrderDetailInOrder;
import org.example.demo.repository.cart.CartRepository;
import org.example.demo.repository.history.HistoryRepository;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.order_detail.OrderDetailRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.example.demo.service.IService;
import org.example.demo.service.fee.FeeService;
import org.example.demo.service.history.HistoryService;
import org.example.demo.util.DataUtils;
import org.example.demo.util.RandomCodeGenerator;
import org.example.demo.util.auth.AuthUtil;
import org.example.demo.util.event.EventUtil;
import org.example.demo.util.number.NumberUtil;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
    private HistoryService historyService;

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

    @Autowired
    private FeeService feeService;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private CartRepository cartRepository;

    public Page<OrderOverviewResponseDTO> findAllOverviewByPage(
            String status,
            String type,
            LocalDateTime createdFrom,
            LocalDateTime createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "createdDate")
            );
        }

        return orderRepository.findAllByPageWithQuery(query, status, type, createdFrom, createdTo, pageable).map(s -> orderResponseMapper.toOverViewDTO(s));
    }

    @Override
    public Order findById(Integer id) {
        return orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Order not found"));
    }

    public Order findByCode(String code) {
        return orderRepository.findByCode(code).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Order not found"));
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

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)) {
            Account account = (Account) authentication.getPrincipal();
            entityMapped.setStaff(account.getStaff());
        }

        entityMapped.setDeleted(false);
        entityMapped.setStatus(Status.PENDING);
        entityMapped.setPayment(Payment.CASH);
        entityMapped.setCode("HDI" + randomCodeGenerator.generateRandomCode());

        entityMapped.setSubTotal(0.0);
        entityMapped.setTotal(0.0);
        entityMapped.setDiscount(0.0);
        entityMapped.setDeliveryFee(0.0);
        entityMapped.setSurcharge(0.);
        entityMapped.setRefund(0.0);
        entityMapped.setDiscountVoucherPercent(0.0);
        entityMapped.setIsPayment(false);
        entityMapped.setVoucherMinimumSubtotalRequired(0.0);

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
        reloadSubTotalOrder(entityMapped);
        return orderRepository.save(entityMapped);
    }

    @Override
    @Transactional
    public Order update(Integer id, OrderRequestDTO requestDTO) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Order not found with id: " + id));
        History history = new History();
        history.setOrder(order);
        String address = "";
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
        // payment
        if (requestDTO.getPayment() != null) {
            order.setPayment(requestDTO.getPayment());
        }
        // type
        if (requestDTO.getType() != null) {
            order.setType(requestDTO.getType());
        }
        // type
        if (requestDTO.getStatus() != null) {
            order.setStatus(requestDTO.getStatus());
        }
        // address
        if (requestDTO.getAddress() != null && !DataUtils.isNullOrEmpty(requestDTO.getAddress())) {
            String detail = requestDTO.getAddress();
            address += detail;
        }
        // ward
        if (requestDTO.getWardId() != null && !DataUtils.isNullOrEmpty(requestDTO.getWardName())) {
            address += ", " + requestDTO.getWardName();
            order.setWardName(requestDTO.getWardName());
            order.setWardId(requestDTO.getWardId());
        }
        // district
        if (requestDTO.getDistrictId() != null && !DataUtils.isNullOrEmpty(requestDTO.getDistrictName())) {
            address += ", " + requestDTO.getDistrictName();
            order.setDistrictName(requestDTO.getDistrictName());
            order.setDistrictId(requestDTO.getDistrictId());
        }
        // province
        if (requestDTO.getProvinceId() != null && !DataUtils.isNullOrEmpty(requestDTO.getProvinceName())) {
            address += ", " + requestDTO.getProvinceName();
            order.setProvinceName(requestDTO.getProvinceName());
            order.setProvinceId(requestDTO.getProvinceId());
        }
        // set address
        if (!DataUtils.isNullOrEmpty(address)) {
            order.setAddress(requestDTO.getAddress());
        }
        // phone
        if (requestDTO.getPhone() != null && !DataUtils.isNullOrEmpty(requestDTO.getPhone())) {
            order.setPhone(requestDTO.getPhone());
        }
        // recipientName;
        if (requestDTO.getRecipientName() != null && !DataUtils.isNullOrEmpty(requestDTO.getRecipientName())) {
            order.setRecipientName(requestDTO.getRecipientName());
        }
        // return order
        reloadSubTotalOrder(order);
        return orderRepository.save(order);
    }

    @Transactional
    public Order changeStatus(Integer id, HistoryRequestDTO requestDTO) {
        Order entityFound = findById(id);
        if (requestDTO.getStatus() == Status.CANCELED && entityFound.getIsPayment() && entityFound.getPayment() == Payment.TRANSFER) {
            if (DataUtils.isNullOrEmpty(requestDTO.getNote())) {
                throw new CustomExceptions.CustomBadRequest("Vui lòng nhập nội dung và mã giao dịch trước khi hủy");
            }
        }
        entityFound.setStatus(requestDTO.getStatus());
        History history = new History();
        history.setOrder(entityFound);
        history.setNote(requestDTO.getNote());
        history.setStatus(requestDTO.getStatus());
        history.setAccount(AuthUtil.getAccount());
        historyRepository.save(history);
        reloadSubTotalOrder(entityFound);
        return orderRepository.save(entityFound);
    }

    @Transactional
    public Order addVoucher(UseOrderVoucherDTO request) {
        Order orderFound = findById(request.getIdOrder());
        Voucher voucherFound = voucherRepository.findById(request.getIdVoucher()).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Voucher not found"));
        System.out.println(orderFound.getCode());
        System.out.println(voucherFound.getCode());

        double subtotal_of_order = get_subtotal_of_order(orderFound);
        Integer t = voucherFound.getMinAmount();
        // kiêm tra số lương
        if (voucherFound.getQuantity() > 0) {
            if (subtotal_of_order >= t) {
                double discount = NumberUtil.roundDouble(subtotal_of_order / 100 * voucherFound.getMaxPercent());
                log.info("DISCOUNT VALUE: " + discount);
                log.info("DISCOUNT PERCENT: " + voucherFound.getMaxPercent());
                orderFound.setTotal(subtotal_of_order - discount);
                orderFound.setDiscount(discount);
                orderFound.setSubTotal(subtotal_of_order);
                orderFound.setDiscountVoucherPercent(Double.valueOf(voucherFound.getMaxPercent()));
                orderFound.setVoucher(voucherFound);
            } else {
                throw new CustomExceptions.CustomBadRequest("Số tiền tối thiểu không đáp ứng");
            }
        } else {
            throw new CustomExceptions.CustomBadRequest("Voucher này đã được sử dụng hết số lượng");
        }
        reloadSubTotalOrder(orderFound);
        return orderRepository.save(orderFound);
    }

    public CountStatusOrder getCountStatusAnyOrder() {
        return orderRepository.getCountStatus();
    }

    public List<ICountOrderDetailInOrder> getCountOrderDetailInOrder(List<Integer> ids) {
        return orderRepository.getCountOrderDetailByIds(ids);
    }

    public JsonNode calculateFee(Integer idOrder) {
        Order order = findById(idOrder);
        FeeDTO feeDTO = new FeeDTO();
        feeDTO.setService_type_id(2);
        feeDTO.setFrom_district_id(3440); // quận Nam Từ Liêm

        if (order.getDistrictId() != null && order.getProvinceId() != null) {
            feeDTO.setTo_district_id(order.getDistrictId());
            feeDTO.setTo_ward_code(order.getWardId());

            feeDTO.setHeight(2);
            feeDTO.setLength(2);
            feeDTO.setWeight(2);
            feeDTO.setWidth(2);

            feeDTO.setInsurance_value(0);

            feeDTO.setCoupon("");
            List<ItemDTO> dtoList = order.getOrderDetails().stream().map(s -> {
                ItemDTO itemDTO = new ItemDTO();
                itemDTO.setName("ORDER");
                itemDTO.setQuantity(s.getQuantity());
                itemDTO.setHeight(200);
                itemDTO.setWeight(200);
                itemDTO.setLength(200);
                itemDTO.setWidth(200);
                return itemDTO;
            }).toList();
            feeDTO.setItems(dtoList);
            try {
                JsonNode fee = feeService.calculator(
                        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                        feeDTO
                );
                String a = String.valueOf(fee.get("data").get("total"));
                System.out.println(a);
                return fee;
            } catch (Exception ex) {
                log.error(ex.getMessage());
                throw new CustomExceptions.CustomBadRequest("Lỗi tính phí vận chuyển");
            }
        } else {
            return null;
        }
    }

    public List<StatisticOverviewResponse> fetchOrdersByStatusAndRangeTime(Status status, LocalDateTime from, LocalDateTime to) {
        return orderRepository.findAllByStatusAndCreatedDateBetweenOrderByCreatedDateDesc(status, from, to);
    }

    @Transactional
    public Order convertCartToOrder(Integer cartId) {
        boolean isPayment = false;
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không xác định được giỏ hàng"));
        // BẮT ĐẦU SET THÔNG TIN TỪ CART VÀO HÓA ĐƠN
        Order order = new Order();
        order.setCode("HDO" + randomCodeGenerator.generateRandomCode());
        order.setRecipientName(cart.getRecipientName());
        order.setPhone(cart.getPhone());
        order.setAddress(cart.getAddress() + " " + cart.getDistrictName() + " " + cart.getDistrictName() + " " + cart.getProvinceName());
        order.setAddress(cart.getAddress());
        order.setProvinceId(cart.getProvinceId());
        order.setProvinceName(cart.getProvinceName());
        order.setDistrictId(cart.getDistrictId());
        order.setDistrictName(cart.getDistrictName());
        order.setWardId(cart.getWardId());
        order.setWardName(cart.getWardName());
        order.setPhone(cart.getPhone());
        order.setDeleted(Boolean.FALSE);
        order.setTotal(cart.getTotal());
        order.setDeliveryFee(cart.getDeliveryFee());
        order.setDiscount(cart.getDiscount());
        order.setSubTotal(cart.getSubTotal());
        order.setType(Type.ONLINE);
        order.setStatus(Status.PENDING);
        order.setPayment(cart.getPayment());
        order.setCustomer(cart.getCustomer());
        order.setVoucherMinimumSubtotalRequired(0.0);
        order.setSurcharge(0.0);
        order.setRefund(0.0);
        order.setDiscountVoucherPercent(0.0);
        if (order.getPayment() == Payment.TRANSFER) {
            isPayment = true;
        }
        order.setIsPayment(isPayment);
        //
        order.setCustomer(null);
        order.setVoucher(cart.getVoucher());
        List<OrderDetail> list = new ArrayList<>();
        List<CartDetail> listCardDetail = cart.getCartDetails();
        Order orderSaved = orderRepository.save(order);

        historyService.createNewHistoryObject(orderSaved, Status.PENDING, "Khởi tạo hóa đơn");

        // HOÀN THÀNH LƯU HÓA ĐƠN MỚI
        listCardDetail.forEach(s -> {
            OrderDetail od = new OrderDetail();
            od.setOrder(order);
            od.setQuantity(s.getQuantity());
            od.setProductDetail(s.getProductDetail());
            od.setDeleted(false);
            od.setAverageDiscountEventPercent(EventUtil.getAveragePercentEvent(s.getProductDetail().getProduct().getValidEvents()));
            list.add(od);
        });
        List<OrderDetail> orderDetailListSaved = orderDetailRepository.saveAll(list);
        order.setOrderDetails(orderDetailListSaved);

        Order result = orderRepository.save(order);
        cart.setDeleted(Boolean.TRUE);
        cartRepository.save(cart);
        return result;
    }


    public double get_total_value_of_order(Order order) {
        return get_discount_of_order_that_time(order) - get_discount_of_order_that_time(order);
    }

    public void reloadSubTotalOrder(Order order){
        double subtotal = get_subtotal_of_order(order);
        double discount = get_discount_of_order_that_time(order);
        double fee_ship = get_fee_ship_of_order(order);
        double total = NumberUtil.roundDouble(subtotal - discount + fee_ship);
        log.info("SUBTOTAL: " + subtotal);
        log.info("DISCOUNT: " + discount);
        log.info("FEE: " + fee_ship);
        log.info("TOTAL: " + total);
        order.setSubTotal(subtotal);
        order.setDiscount(discount);
        order.setDeliveryFee(fee_ship);
        order.setTotal(total);
        orderRepository.save(order);
    }

    // DISCOUNT CỦA HÓA ĐƠN
    // LẤY TỔNG TIỀN ĐƯỢC GIẢM GIÁ (ĐÃ CÓ VOUCHER)
    public double get_discount_of_order_that_time(Order order) {
        // phần trăm đc giảm giá đc lưu vào hóa đơn tại thời điểm tọa hóa đơn chờ
        double discount_percent_at_that_time = order.getDiscountVoucherPercent();
        // số tiền tối thiểu cần có để có thể áp dụng voucher
        double voucherMinimumSubtotalRequired = order.getVoucherMinimumSubtotalRequired();
        // lấy subtotal cần trả
        double subtotal_of_order = get_subtotal_of_order(order);
        // nếu đáp ứng giá trị đơn hàng tối thiểu với voucher
        if (subtotal_of_order > voucherMinimumSubtotalRequired) {
            return NumberUtil.roundDouble(subtotal_of_order / 100 * discount_percent_at_that_time);
        } else {
            return 0.0;
        }
    }

    // SUBTOTAL CỦA HÓA DƠN
    // LẤY TỔNG TIỀN THEO HÓA DƠN CHI TIẾT (ĐÃ ẤP DỤNG EVENT)
    private static double get_price_of_order_detail_at_that_time(OrderDetail s) {
        ProductDetail productDetail = s.getProductDetail();
        // lấy giá product detail cho tính toán
        double productDetailPrice = productDetail.getPrice();
        // lấy ra phần trăm giảm giá của sự kiện lúc tạo hóa đơn chờ tại thời điểm đó
        double averageEventPercent = s.getAverageDiscountEventPercent();
        // tính giá trị của hóa đơn chi tiết này tại thời điểm đó
        return NumberUtil.roundDouble(productDetailPrice * (1 - averageEventPercent / 100));
    }

    // SUBTOTAL CỦA HÓA DƠN CHI TIẾT
    // LẤY TỔNG TIỀN THEO HÓA ĐƠN (SUBTOTAL) (CHƯA CÓ VOCHER)
    public double get_subtotal_of_order(Order order) {
        double subtotal = 0;
        // lấy ra các hóa đơn không bị xóa của hóa đơn
        List<OrderDetail> orderDetailList = order.getOrderDetails().stream().filter((s) -> !s.getDeleted()).toList();
        // lặp tính tiền hóa đơn
        for (OrderDetail s : orderDetailList) {
            // lấy product detail cho việc tính toán
            double price_of_this_order_detail = get_price_of_order_detail_at_that_time(s) * s.getQuantity();
            // cộng dồn giá trị vào total;
            subtotal += price_of_this_order_detail;
        }
        return NumberUtil.roundDouble(subtotal);
    }

    public double get_fee_ship_of_order(Order order) {
        try {
            if (order.getDistrictId() != null && order.getProvinceId() != null && order.getType() == Type.ONLINE) {
                JsonNode feeObject = calculateFee(order.getId());
                if (feeObject != null) {
                    String feeString = String.valueOf(feeObject.get("data").get("total"));
                    return DataUtils.safeToDouble(feeString);
                }
            }
            return 0;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            log.error(e.getMessage());
            throw new CustomExceptions.CustomBadRequest("Lỗi tính phí vận chuyển");
        }
    }

}
