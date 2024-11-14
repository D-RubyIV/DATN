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
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Payment;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.order.properties.History;
import org.example.demo.entity.order.properties.OrderDetail;
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
import org.example.demo.util.DataUtils;
import org.example.demo.util.RandomCodeGenerator;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

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
        Staff staffDemo = staffRepository.findById(38).orElse(null); // demo nen set mac dinh

        entityMapped.setDeleted(false);
        entityMapped.setStatus(Status.PENDING);
        entityMapped.setPayment(Payment.CASH);
        entityMapped.setCode("HDI" + randomCodeGenerator.generateRandomCode());
        entityMapped.setStaff(staffDemo);

        entityMapped.setSubTotal(0.0);
        entityMapped.setTotal(0.);
        entityMapped.setDiscount(0.);
        entityMapped.setDeliveryFee(0.);

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
        // province
        if (requestDTO.getProvinceId() != null && !DataUtils.isNullOrEmpty(requestDTO.getProvinceName())) {
            order.setProvinceName(requestDTO.getProvinceName());
            order.setProvinceId(requestDTO.getProvinceId());
        }
        // district
        if (requestDTO.getDistrictId() != null && !DataUtils.isNullOrEmpty(requestDTO.getDistrictName())) {
            order.setDistrictName(requestDTO.getDistrictName());
            order.setDistrictId(requestDTO.getDistrictId());
        }
        // ward
        if (requestDTO.getWardId() != null && !DataUtils.isNullOrEmpty(requestDTO.getWardName())) {
            order.setWardName(requestDTO.getWardName());
            order.setWardId(requestDTO.getWardId());
        }
        // address
        if (requestDTO.getAddress() != null && !DataUtils.isNullOrEmpty(requestDTO.getAddress())){
            order.setAddress(requestDTO.getAddress());
        }
        // phone
        if(requestDTO.getPhone() != null  && !DataUtils.isNullOrEmpty(requestDTO.getPhone())){
            order.setPhone(requestDTO.getPhone());
        }
        // recipientName;
        if(requestDTO.getRecipientName() != null  && !DataUtils.isNullOrEmpty(requestDTO.getRecipientName())){
            order.setRecipientName(requestDTO.getRecipientName());
        }
        // return order
        reloadSubTotalOrder(order);
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
        reloadSubTotalOrder(entityFound);
        return orderRepository.save(entityFound);
    }

    @Transactional
    public Order addVoucher(UseOrderVoucherDTO request) {
        Order orderFound = findById(request.getIdOrder());
        Voucher voucherFound = voucherRepository.findById(request.getIdVoucher()).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Voucher not found"));
        System.out.println(orderFound.getCode());
        System.out.println(voucherFound.getCode());
        Double total = fetchTotal(orderFound);
        Integer t = voucherFound.getMinAmount();
        // kiêm tra số lương
        if (voucherFound.getQuantity() > 0) {
            if (total >= t) {
                double discount = total / 100 * voucherFound.getMaxPercent();
                orderFound.setTotal(total - discount);
                orderFound.setDiscount(discount);
                orderFound.setSubTotal(total);
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

    public void calculateDiscount(Order order) {
        Voucher voucher = order.getVoucher();
        Double total = fetchTotal(order);
        if (voucher != null) {
            if (total >= voucher.getMinAmount()) {
                double discount = total / 100 * voucher.getMaxPercent();
                order.setDiscount(discount);
            }
        }
    }

    public Double fetchTotal(Order order) {
        return Optional.ofNullable(order.getOrderDetails())
                .orElse(Collections.emptyList())
                .stream()
                .mapToDouble(s -> s.getProductDetail().getPrice() * s.getQuantity())
                .sum();
    }


    public void reloadSubTotalOrder(Order order) {
        order.setSubTotal(fetchTotal(order));
        calculateDiscount(order);
        try {
            if (order.getDistrictId() != null && order.getProvinceId() != null && order.getType() == Type.ONLINE) {
                System.out.println("DISTRICT: " + order.getDistrictId());
                System.out.println("PROVINCE: " + order.getProvinceId());
                System.out.println("WARD: " + order.getWardId());
                JsonNode feeObject = calculateFee(order.getId());
                if (feeObject != null) {
                    String feeString = String.valueOf(feeObject.get("data").get("total"));
                    Double feeDouble = DataUtils.safeToDouble(feeString);
                    order.setDeliveryFee(feeDouble);
                    order.setTotal(fetchTotal(order) + feeDouble - order.getDiscount());
                }
            } else {
                order.setDeliveryFee(0.0);
                order.setTotal(fetchTotal(order) - order.getDiscount());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            log.error(e.getMessage());
            throw new CustomExceptions.CustomBadRequest("Lỗi tính phí vận chuyển");
        }
        orderRepository.save(order);
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

    public List<StatisticOverviewResponse> fetchOrdersByStatusAndRangeTime(Status status, LocalDateTime from, LocalDateTime to){
        return orderRepository.findAllByStatusAndCreatedDateBetweenOrderByCreatedDateDesc(status, from, to);
    }

    public Order convertCartToOrder(Integer cartId){
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không xác đingj được giỏ hàng"));
        Order order = new Order();
        order.setCode("HDO" + randomCodeGenerator.generateRandomCode());
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
        order.setPayment(cart.getPayment());
        // status
        if (cart.getStatus() == org.example.demo.entity.cart.enums.Status.PENDING){
            order.setStatus(Status.PENDING);
        } else if (cart.getStatus() == org.example.demo.entity.cart.enums.Status.SUCCESS) {
            order.setStatus(Status.DELIVERED);
        } else if (cart.getStatus() == org.example.demo.entity.cart.enums.Status.TOSHIP) {
            order.setStatus(Status.TOSHIP);
        }
        //
        order.setCustomer(null);
        order.setVoucher(cart.getVoucher());
        List<OrderDetail> list = new ArrayList<>();
        List<CartDetail> listCardDetail = cart.getCartDetails();
        orderRepository.save(order);
        listCardDetail.forEach(s -> {
            OrderDetail od = new OrderDetail();
            od.setOrder(order);
            od.setQuantity(s.getQuantity());
            od.setProductDetail(s.getProductDetail());
            od.setDeleted(false);
            list.add(od);
        });
        List<OrderDetail> orderDetailListSaved = orderDetailRepository.saveAll(list);
        order.setOrderDetails(orderDetailListSaved);

        Order result = orderRepository.save(order);
        cart.setDeleted(Boolean.TRUE);
        cartRepository.save(cart);
        return result;
    }


}
