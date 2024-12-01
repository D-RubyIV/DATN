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
import org.example.demo.dto.order.other.RefundAndChangeStatusDTO;
import org.example.demo.dto.order.other.UseOrderVoucherDTOByCode;
import org.example.demo.dto.order.other.UseOrderVoucherDTOById;
import org.example.demo.dto.statistic.response.StatisticOverviewResponse;
import org.example.demo.entity.cart.core.CartDetail;
import org.example.demo.entity.cart.properties.Cart;
import org.example.demo.entity.human.customer.Address;
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
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.example.demo.service.IService;
import org.example.demo.service.email.MailSenderService;
import org.example.demo.service.fee.FeeService;
import org.example.demo.service.history.HistoryService;
import org.example.demo.util.DataUtils;
import org.example.demo.util.RandomCodeGenerator;
import org.example.demo.util.auth.AuthUtil;
import org.example.demo.util.event.EventUtil;
import org.example.demo.util.number.NumberUtil;
import org.example.demo.util.phah04.PageableObject;
import org.example.demo.util.voucher.VoucherUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@Slf4j
@Service
public class OrderService implements IService<Order, Integer, OrderRequestDTO> {

    private final ExecutorService executorService = Executors.newFixedThreadPool(5);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

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
    private MailSenderService mailSenderService;

    @Autowired
    private FeeService feeService;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private VoucherUtil voucherUtil;

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

    @Transactional
    public Order refund_and_change_status(RefundAndChangeStatusDTO refundAndChangeStatusDTO, int orderId){
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy đơn hàng này"));
        Double amount = refundAndChangeStatusDTO.getAmount();
        String tradingCode = refundAndChangeStatusDTO.getTradingCode();
        History history = new History();
        String note = String.format("Trả lại: %.2f - Mã giao dịch: %s", amount, tradingCode);
        history.setNote(note);
        history.setAccount(AuthUtil.getAccount());
        history.setOrder(order);
        history.setStatus(refundAndChangeStatusDTO.getStatus());
        historyRepository.save(history);
        order.setStatus(refundAndChangeStatusDTO.getStatus());
        return orderRepository.save(order);
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
        entityMapped.setTotalPaid(0.0);
        entityMapped.setDiscountVoucherPercent(0.0);
        entityMapped.setIsPayment(false);
        entityMapped.setVoucherMinimumSubtotalRequired(0.0);
        entityMapped.setInStore(true);

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

    private Address getDefaultAddress(Integer customerId) {
        return customerRepository.findById(customerId)
                .map(customer -> customer.getAddresses().stream()
                        .filter(Address::getDefaultAddress) // Lọc địa chỉ mặc định
                        .findFirst()
                        .orElse(null))
                .orElse(null);
    }

    @Transactional
    public Order updateCustomerAndSetDefaultAddress(Integer id, OrderRequestDTO requestDTO) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Order not found with id: " + id));

        History history = new History();
        history.setOrder(order);
        history.setNote("Cập nhật thông tin khách hàng");
        history.setStatus(order.getStatus());
        historyRepository.save(history);

        if (requestDTO.getCustomer() != null) {
            if (requestDTO.getCustomer().getId() != null) {
                Customer selectedCustomer = customerRepository.findById(requestDTO.getCustomer().getId()).orElse(null);
                if (selectedCustomer != null) {
                    order.setEmail(selectedCustomer.getEmail());
                    order.setPhone(selectedCustomer.getPhone());
                    log.info("THÔNG TIN KHÁCH HÀNG TỒN TẠI");
                    order.setCustomer(selectedCustomer);

                    Address defaultAddress = getDefaultAddress(selectedCustomer.getId());
                    if(order.getType() == Type.ONLINE){
                        log.info("LÀ ĐƠN GIAO HÀNG");
                        if (defaultAddress != null){
                            log.info("ĐỊA CHỈ MẶC ĐỊNH KHÁCH HÀNG TỒN TẠI");
                            log.info("TINH: {}, HUYEN: {}, XA: {}, CHI TIET: {}", defaultAddress.getProvince(), defaultAddress.getDistrict(), defaultAddress.getWard(), defaultAddress.getDetail());
                            order.setProvinceId(Integer.valueOf(defaultAddress.getProvinceId()));
                            order.setDistrictId(Integer.valueOf(defaultAddress.getDistrictId()));
                            order.setWardId(defaultAddress.getWardId());

                            order.setProvinceName(defaultAddress.getProvince());
                            order.setDistrictName(defaultAddress.getDistrict());
                            order.setWardName(defaultAddress.getWard());
                            order.setAddress(defaultAddress.getDetail());
                            order.setRecipientName(defaultAddress.getName());
                            order.setPhone(defaultAddress.getPhone());
                        }
                        else{
                            log.info("ĐỊA CHỈ MẶC ĐỊNH KHÁCH HÀNG KHÔNG TỒN TẠI");
                        }
                    }
                    else{
                        log.info("KHÔNG LÀ ĐƠN GIAO HÀNG");
                    }
                }
                else{
                    log.info("THÔNG TIN KHÁCH HÀNG KHÔNG TỒN TẠI");
                }
            }
        }

        return orderRepository.save(order);
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

    private void checkValidateQuantity(Order order) {
        // B1: CHECK ĐỦ SỐ LƯỢNG PRODUCT DETAIL CÓ THỂ CUNG CẤP (CHỈ CẦN CHECK KHI CHUYỂN TỪ PENDING SANG TOSHIP)
        boolean availableProductDetailQuantity = check_valid_product_detail_quantity_in_storage(order);
        log.info("VALIDATE PRODUCT DETAIL QUANTITY: " + availableProductDetailQuantity);
        if (!availableProductDetailQuantity) {
            throw new CustomExceptions.CustomBadRequest("Có sản phẩm nào đó không đủ cung ứng");
        }
        // B2: CHECK ĐỦ SỐ LƯỢNG VOUCHER CÓ THỂ CUNG CẤP (CHỈ CẦN CHECK KHI CHUYỂN TỪ PENDING SANG TOSHIP)
        boolean availableVoucherQuantity = check_valid_voucher_quantity_in_storage(order);
        log.info("VALIDATE VOCUHER USED: " + availableVoucherQuantity);
        if (!availableVoucherQuantity) {
            throw new CustomExceptions.CustomBadRequest("Khuyến mãi này không đủ cung ứng");
        }
    }

    @Transactional
    public Order changeStatus(Integer id, HistoryRequestDTO requestDTO) {
        Order entityFound = findById(id);

        if (requestDTO.getStatus() == Status.CANCELED && entityFound.getIsPayment() && entityFound.getPayment() == Payment.TRANSFER) {
            if (DataUtils.isNullOrEmpty(requestDTO.getNote())) {
                throw new CustomExceptions.CustomBadRequest("Vui lòng nhập nội dung và mã giao dịch trước khi hủy");
            }
        }

        // B1: CHECK TRU SO LUONG(TRƯỢC KHI CẬP NHẬT TRẠNG THÁI MỚI)
        Status oldStatus = entityFound.getStatus();
        Status newStatus = requestDTO.getStatus();

        log.info("OLD STATUS: " + oldStatus);
        log.info("NEW STATUS: " + newStatus);
        log.info("-----------------1");
        if (oldStatus == Status.PENDING && newStatus == Status.TOSHIP) {
            checkValidateQuantity(entityFound);
            if (entityFound.getType() == Type.ONLINE) {
                check_validate_address_for_online_order(entityFound);
            }
            log.info("1");
            minusProductDetailsQuantity(entityFound);
        } else if (oldStatus == Status.TOSHIP && newStatus == Status.PENDING) {
            log.info("2");
            restoreProductDetailsQuantity(entityFound);
        } else if (oldStatus == Status.PENDING && newStatus == Status.DELIVERED) {
            if (entityFound.getType() == Type.ONLINE) {
                check_validate_address_for_online_order(entityFound);
            }
            checkValidateQuantity(entityFound);
            log.info("3");
            entityFound.setIsPayment(true);
        } else if (oldStatus == Status.TORECEIVE && newStatus == Status.DELIVERED) {
            log.info("4");
            entityFound.setIsPayment(true);
        } else if (oldStatus == Status.PENDING && newStatus == Status.CANCELED && entityFound.getInStore()) {
            called_order(entityFound);
        }
        if (oldStatus != newStatus) {
            sendEmail(entityFound);
        }
        log.info("-----------------2");

        //B2: CẬP NHẬT TRẠNG THÁI MỚI
        entityFound.setStatus(requestDTO.getStatus());
        //B3: LƯU LỊCH SỬ
        History history = new History();
        history.setOrder(entityFound);
        history.setNote(requestDTO.getNote());
        history.setStatus(requestDTO.getStatus());
        history.setAccount(AuthUtil.getAccount());
        historyRepository.save(history);


        reloadSubTotalOrder(entityFound);
        return orderRepository.save(entityFound);
    }

    private boolean check_validate_address_for_online_order(Order order) {
        if (order.getRecipientName() == null || order.getPhone() == null || order.getProvinceId() == null || order.getDistrictId() == null || order.getWardId() == null) {
            throw new CustomExceptions.CustomBadRequest("Vui lòng cung cấp tên, số điện thoại và địa chỉ cho đơn hàng này");
        }
        return true;
    }

    @Transactional
    public Order addVoucherById(UseOrderVoucherDTOById request) {
        Order orderFound = findById(request.getIdOrder());
        Voucher voucherFound = voucherRepository.findById(request.getIdVoucher()).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Phiếu giảm giá không hợp lệ"));
        useVoucher(voucherFound, orderFound);
        return orderRepository.save(orderFound);
    }

    @Transactional
    public Order addVoucherCode(UseOrderVoucherDTOByCode request) {
        Order orderFound = findById(request.getIdOrder());
        Voucher voucherFound = voucherRepository.findByCode(request.getCodeVoucher()).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Phiếu giảm giá không hợp lệ"));
        useVoucher(voucherFound, orderFound);
        return orderRepository.save(orderFound);
    }

    private void useVoucher(Voucher voucherFound, Order orderFound) {
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
    }

    public CountStatusOrder getCountStatusAnyOrder(String type) {
        return orderRepository.getCountStatus(type);
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
                throw new CustomExceptions.CustomBadRequest("Lỗi tính phí vận chuyển. Vui lòng xem xét lại địa chỉ hợp lệ");
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
        order.setTotal(NumberUtil.roundDouble(cart.getTotal()));
        order.setDeliveryFee(NumberUtil.roundDouble(cart.getDeliveryFee()));
        order.setDiscount(NumberUtil.roundDouble(cart.getDiscount()));
        order.setSubTotal(NumberUtil.roundDouble(cart.getSubTotal()));
        order.setType(Type.ONLINE);
        order.setStatus(Status.PENDING);
        order.setPayment(cart.getPayment());
        order.setCustomer(cart.getCustomer());
        order.setVoucher(cart.getVoucher());

        order.setInStore(false);

        if (cart.getVoucher() != null) {
            order.setDiscountVoucherPercent(Double.valueOf(cart.getVoucher().getMaxPercent()));
            order.setVoucherMinimumSubtotalRequired(Double.valueOf(cart.getVoucher().getMinAmount()));
        } else {
            order.setVoucherMinimumSubtotalRequired(0.0);
            order.setDiscountVoucherPercent(0.0);
        }

        if (order.getPayment() == Payment.TRANSFER) {
            isPayment = true;
            order.setTotalPaid(NumberUtil.roundDouble(cart.getTotal()));
        } else {
            order.setTotalPaid(0.0);
        }
        order.setIsPayment(isPayment);
        //
        Account account = AuthUtil.getAccount();


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
        reloadSubTotalOrder(order);
        cart.setDeleted(Boolean.TRUE);
        cartRepository.save(cart);
        return result;
    }


    public double get_total_value_of_order(Order order) {
        return get_discount_of_order_that_time(order) - get_discount_of_order_that_time(order);
    }

    public void reloadSubTotalOrder(Order order) {

        // tổng tiền các sản phẩm(tính cả event)
        double subtotal = get_subtotal_of_order(order);
        log.info("SUBTOTAL: " + subtotal);
        order.setSubTotal(subtotal);

        // sau khi cập nhật subtotal thì cũng tự động chọn voucher phù hợp
        if (order.getInStore()) {
            Voucher bestVoucher = voucherUtil.getBestVoucherCanUse(order);
            order.setVoucher(bestVoucher);
            if (bestVoucher == null) {
                log.info("BEST VOUCHER NULL");
                order.setDiscountVoucherPercent(0.0);
                order.setVoucherMinimumSubtotalRequired(0.0);
            } else {
                log.info("BEST VOUCHER CODE: " + bestVoucher.getCode());
                order.setDiscountVoucherPercent(Double.valueOf(bestVoucher.getMaxPercent()));
                order.setVoucherMinimumSubtotalRequired(Double.valueOf(bestVoucher.getMinAmount()));
            }
        }

        // tính tiền giảm của voucher cho hóa đơn
        double discount = get_discount_of_order_that_time(order);
        log.info("DISCOUNT: " + discount);
        order.setDiscount(discount);

        // tính ship
        double fee_ship = get_fee_ship_of_order(order);
        // tiền khách đã trả
        double total_paid = NumberUtil.roundDouble(order.getTotalPaid());
        // tổng tiền sau trừ giảm giá voucher và cộng ship
        double total_after_discount_and_fee = subtotal - discount + fee_ship;
        // tổng tiền cần thanh toán
        double total = NumberUtil.roundDouble(total_after_discount_and_fee - total_paid);

        log.info("FEE TOTAL: " + fee_ship);
        log.info("TOTAL: " + total);


        // ------------------ FIX FEE -----------------
        // hóa đơn có sản phẩm
        if (subtotal != 0) {
            order.setDeliveryFee(fee_ship);
        }
        // hóa đơn ko còn sản phẩm nào
        else {
            order.setDeliveryFee(0.0);
        }
        // ------------------ FIX FEE -----------------

        // NẾU ĐÃ NHẬN HÀNG (THANH TOÁN HÊT TIỀN)
        if (order.getStatus() == Status.DELIVERED) {
            order.setTotalPaid(total + total_paid);
            order.setTotal(0.0);
        }
        // NẾU CHƯA NHẬN
        else {
            // ĐƠN ONLINE
            if (order.getType() == Type.ONLINE) {
                // nếu có thanh toán r
                if (order.getIsPayment()) {
                    // NẾU TỔNG CẦN THANH TOÁN > 0 (TỨC CÓ ĐƠN PHÁT SINH)
                    if (total > 0) {
                        order.setTotal(total);
                    }
                    // NẾU KO CÓ ĐƠN PHÁT SINH
                    else {
                        order.setTotal(0.0);
                    }
                } else {
                    order.setTotal(total);
                }
            }
            // ĐƠN Ở CỦA HÀNG
            else if (order.getType() == Type.INSTORE) {
                order.setTotal(total);
            }
        }
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
            log.info("CÓ THỂ SỬ DỤNG VOUCHER");
            return NumberUtil.roundDouble(subtotal_of_order / 100 * discount_percent_at_that_time);
        } else {
            log.info("KHÔNG THỂ SỬ DỤNG VOUCHER");
            return 0.0;
        }
    }

    // SUBTOTAL CỦA HÓA DƠN
    // LẤY TỔNG TIỀN THEO HÓA DƠN CHI TIẾT (ĐÃ ẤP DỤNG EVENT)
    public double get_price_of_order_detail_at_that_time(OrderDetail s) {
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

    public Order callReCalculate(Integer id) {
        Order order = findById(id);
        reloadSubTotalOrder(order);
        return order;
    }

    public void minusProductDetailsQuantity(Order order) {
        List<OrderDetail> orderDetails = order.getOrderDetails();
        for (OrderDetail orderDetail : orderDetails) {
            ProductDetail productDetail = orderDetail.getProductDetail();
            int new_quantity = productDetail.getQuantity() - orderDetail.getQuantity();
            log.info("OLD QUANTITY: " + productDetail.getQuantity());
            log.info("NEW QUANTITY: " + new_quantity);
            productDetail.setQuantity(new_quantity);
            productDetailRepository.save(productDetail);
        }
    }

    public void restoreProductDetailsQuantity(Order order) {
        List<OrderDetail> orderDetails = order.getOrderDetails();
        for (OrderDetail orderDetail : orderDetails) {
            ProductDetail productDetail = orderDetail.getProductDetail();
            int new_quantity = productDetail.getQuantity() + orderDetail.getQuantity();
            productDetail.setQuantity(new_quantity);
            productDetailRepository.save(productDetail);
        }
    }

    public boolean check_valid_product_detail_quantity_in_storage(Order order) {
        boolean available = true;
        List<OrderDetail> orderDetails = order.getOrderDetails();
        for (OrderDetail orderDetail : orderDetails) {
            ProductDetail productDetail = orderDetail.getProductDetail();
            int order_detail_quantity = orderDetail.getQuantity();
            int product_detail_quantity = productDetail.getQuantity();
            if (order_detail_quantity > product_detail_quantity) {
                available = false;
            }
        }
        return available;
    }

    public boolean check_valid_voucher_quantity_in_storage(Order order) {
        Voucher voucher = order.getVoucher();
        if (voucher == null) {
            return true;
        } else {
            return voucher.getQuantity() > 0;
        }
    }


    private void sendEmail(Order order) {
        executorService.submit(() -> {
            try {
                if (order.getEmail() != null) {
                    log.info("ĐƠN HÀNG NÀY CÓ CUNG CẤP EMAIL");
                    mailSenderService.sendNewMail(order.getEmail(), "Subject right here", order);
                    log.info("ĐÃ GỬI EMAIL");
                }
                else{
                    log.info("ĐƠN HÀNG NÀY KHÔNG CUNG CẤP EMAIL");
                }
            } catch (Exception e) {
                log.error("Gửi mail thất bại", e);
            }
        });
    }

    private void called_order(Order order){
        List<OrderDetail> orderDetails = order.getOrderDetails().stream().filter(s -> !s.getDeleted()).toList();
        for (OrderDetail orderDetail : orderDetails) {
            int orderQuantity = orderDetail.getQuantity();
            ProductDetail productDetail = orderDetail.getProductDetail();
            productDetail.setQuantity(productDetail.getQuantity() + orderQuantity);
            productDetailRepository.save(productDetail);
        }
    }
}
