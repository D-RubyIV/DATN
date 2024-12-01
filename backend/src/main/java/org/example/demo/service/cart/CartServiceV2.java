package org.example.demo.service.cart;

import com.fasterxml.jackson.databind.JsonNode;
import org.example.demo.dto.cart.request.CartRequestDTO;
import org.example.demo.dto.cart.request.CartRequestDTOV2;
import org.example.demo.dto.ghn.FeeDTO;
import org.example.demo.dto.ghn.ItemDTO;
import org.example.demo.dto.order.core.request.OrderRequestDTO;
import org.example.demo.entity.cart.properties.Cart;
import org.example.demo.entity.event.Event;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.order.properties.History;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.security.Account;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.repository.cart.CartRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.example.demo.service.fee.FeeService;
import org.example.demo.util.DataUtils;
import org.example.demo.util.auth.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceV2 {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private FeeService feeService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    public void calculateDiscount(Cart cart) {
        Voucher voucher = cart.getVoucher();
        Double total = fetchTotal(cart);
        if (voucher != null) {
            if (total >= voucher.getMinAmount()) {
                double discount = total / 100 * voucher.getMaxPercent();
                cart.setDiscount(discount);
            }
        }
    }


    @Transactional
    public Cart update(Integer id, CartRequestDTOV2 requestDTO) {
        Cart cart = cartRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Order not found with id: " + id));
        String address = "";
        // update customer
        Account account = AuthUtil.getAccount();
        if(account != null){
            cart.setCustomer(account.getCustomer());
        }

        System.out.println();
        // update voucher
        if (requestDTO.getVoucher() != null) {
            if (requestDTO.getVoucher().getId() != null) {
                Voucher selectedVoucher = voucherRepository.findById(requestDTO.getVoucher().getId()).orElse(null);
                if (selectedVoucher != null) {
                    cart.setVoucher(selectedVoucher);
                }
            }
        }
        // payment
        if (requestDTO.getPayment() != null) {
            cart.setPayment(requestDTO.getPayment());
        }
        // type
        if (requestDTO.getType() != null) {
            cart.setType(requestDTO.getType());
        }
        // type
        if (requestDTO.getStatus() != null) {
            cart.setStatus(requestDTO.getStatus());
        }
        // address
        if (requestDTO.getAddress() != null && !DataUtils.isNullOrEmpty(requestDTO.getAddress())) {
            address += requestDTO.getAddress();
        }
        // ward
        if (requestDTO.getWardId() != null && !DataUtils.isNullOrEmpty(requestDTO.getWardName())) {
            cart.setWardName(requestDTO.getWardName());
            cart.setWardId(requestDTO.getWardId());
            address += ", " + requestDTO.getWardName();
        }
        // district
        if (requestDTO.getDistrictId() != null && !DataUtils.isNullOrEmpty(requestDTO.getDistrictName())) {
            cart.setDistrictName(requestDTO.getDistrictName());
            cart.setDistrictId(requestDTO.getDistrictId());
            address += ", " + requestDTO.getDistrictName();
        }
        // province
        if (requestDTO.getProvinceId() != null && !DataUtils.isNullOrEmpty(requestDTO.getProvinceName())) {
            cart.setProvinceName(requestDTO.getProvinceName());
            cart.setProvinceId(requestDTO.getProvinceId());
            address += ", " + requestDTO.getProvinceName();
        }
        // phone
        if (requestDTO.getPhone() != null && !DataUtils.isNullOrEmpty(requestDTO.getPhone())) {
            cart.setPhone(requestDTO.getPhone());
        }
        // recipientName;
        if (requestDTO.getRecipientName() != null && !DataUtils.isNullOrEmpty(requestDTO.getRecipientName())) {
            cart.setRecipientName(requestDTO.getRecipientName());
        }
        if (requestDTO.getEmail() != null && !DataUtils.isNullOrEmpty(requestDTO.getEmail())) {
            cart.setEmail(requestDTO.getEmail());
        }
        // set address
        if (!DataUtils.isNullOrEmpty(address)) {
            cart.setAddress(requestDTO.getAddress());
        }
        // return order
        reloadSubTotalOrder(cart);
        return cartRepository.save(cart);
    }

    public void reloadSubTotalOrder(Cart cart) {
        cart.setSubTotal(fetchTotal(cart));
        calculateDiscount(cart);
        try {
            if (cart.getDistrictId() != null && cart.getProvinceId() != null && cart.getType() == Type.ONLINE) {
                JsonNode feeObject = calculateFee(cart.getId());
                if (feeObject != null) {
                    String feeString = String.valueOf(feeObject.get("data").get("total"));
                    Double feeDouble = DataUtils.safeToDouble(feeString);
                    System.out.println("FEEE: " + feeDouble);
                    cart.setDeliveryFee(feeDouble);
                    cart.setTotal(fetchTotal(cart) + feeDouble - cart.getDiscount());
                }
            } else {
                cart.setDeliveryFee(0.0);
                cart.setTotal(fetchTotal(cart) - cart.getDiscount());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new CustomExceptions.CustomBadRequest("Lỗi tính phí vận chuyển");
        }
        cartRepository.save(cart);
    }

    private double getFinalPrice(ProductDetail productDetail) {
        double originPrice = productDetail.getPrice();
        double finalPrice = productDetail.getPrice();
        List<Event> validEvents = productDetail.getProduct().getValidEvents();
        if (!validEvents.isEmpty()) {
            double averageDiscount = validEvents.stream()
                    .mapToInt(Event::getDiscountPercent)
                    .average()
                    .orElse(0.0);
            finalPrice = finalPrice / 100 * (100 - averageDiscount);
        }
        System.out.println("ORIGIN PRICE: " + originPrice);
        System.out.println("FINAL PRICE: " + finalPrice);
        return finalPrice;
    }

    public Double fetchTotal(Cart cart) {
        return Optional.ofNullable(cart.getCartDetails())
                .orElse(Collections.emptyList())
                .stream()
                .mapToDouble(s -> {
                    getFinalPrice(s.getProductDetail());
                    return getFinalPrice(s.getProductDetail()) * s.getQuantity();
                })
                .sum();
    }

    public JsonNode calculateFee(Integer idCart) {
        Cart cart = cartRepository.findById(idCart).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy giỏ hàng"));
        FeeDTO feeDTO = new FeeDTO();
        feeDTO.setService_type_id(2);
        feeDTO.setFrom_district_id(3440); // quận Nam Từ Liêm

        if (cart.getDistrictId() != null && cart.getProvinceId() != null) {
            System.out.println("DISTRICT: " + cart.getDistrictId());
            System.out.println("PROVINCE: " + cart.getProvinceId());
            System.out.println("WARD: " + cart.getWardId());
            feeDTO.setTo_district_id(cart.getDistrictId());
            feeDTO.setTo_ward_code(cart.getWardId());

            feeDTO.setHeight(2);
            feeDTO.setLength(2);
            feeDTO.setWeight(2);
            feeDTO.setWidth(2);

            feeDTO.setInsurance_value(0);

            feeDTO.setCoupon("");
            List<ItemDTO> dtoList = cart.getCartDetails().stream().map(s -> {
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
                System.out.println(ex.getMessage());
                throw new CustomExceptions.CustomBadRequest("Lỗi tính phí vận chuyển");
            }
        } else {
            return null;
        }
    }



}
