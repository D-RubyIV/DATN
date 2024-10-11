package org.example.demo.service.order_detail;

import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.order.properties.request.OrderDetailRequestDTO;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.order.properties.History;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.exception.RestApiException;
import org.example.demo.repository.history.HistoryRepository;
import org.example.demo.repository.order.OrderProductDetailRepository;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.repository.order_detail.OrderDetailRepository;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.service.IService;
import org.example.demo.service.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class OrderDetailService implements IService<OrderDetail, Integer, OrderDetailRequestDTO> {
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private OrderProductDetailRepository orderProductDetailRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    public List<OrderDetail> findAll() {
        return orderDetailRepository.findAll();
    }

    @Override
    public OrderDetail findById(Integer integer) {
        return orderDetailRepository.findById(integer).orElseThrow(() -> new CustomExceptions.CustomBadRequest("OrderDetail not found"));
    }

//    @Override
//    @Transactional
//    public OrderDetail delete(Integer integer) {
//        OrderDetail orderDetail = findById(integer);
//        orderDetailRepository.delete(orderDetail);
//        orderService.reloadTotalOrder(orderDetail.getOrder());
//        return orderDetail;
//    }

    // hung code
    @Override
    @Transactional
    public OrderDetail delete(Integer id) {
        OrderDetail orderDetail = orderDetailRepository.findById(id).get();
        ProductDetail productDetail = orderDetail.getProductDetail();
        productDetail.setQuantity(productDetail.getQuantity() + orderDetail.getQuantity()); // xoa hoa don thi tra lai so luong vao db
        orderDetailRepository.delete(orderDetail);

        Order order = orderDetail.getOrder();
        if (order.getStatus() != Status.CREATE_AN_ORDER) {
            Double caculateTotalMoney = 0.0;
            List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(orderDetail.getOrder().getId());
            if (orderDetails != null) {
                caculateTotalMoney = orderDetails.stream()
                        .mapToDouble(detail -> detail.getQuantity() * detail.getProductDetail().getPrice().doubleValue())
                        .sum();
            }
            // truong hop co tien tra lai chua xet (dung xoa comment nay nhe )
            order.setTotal(caculateTotalMoney);
            if (order.getStatus() == Status.TOSHIP ||
                order.getStatus() == Status.PENDING ||
                order.getStatus() == Status.WAITING_YOUR_PAYMENT
            ) {
                History history = new History();
                history.setOrder(order);
                history.setNote("Đã xoá "+ " sản phẩm \"" + productDetail.getName() + " [" + productDetail.getColor().getName() + "-" + productDetail.getSize().getName() + "]\"" );
                history.setStatus(Status.EDIT_AN_ORDER);
                historyRepository.save(history);
            }
            orderRepository.save(order);
        }
        return orderDetail;
    }
    // hung code


    @Override
    public OrderDetail save(OrderDetailRequestDTO requestDTO) {
        Optional<OrderDetail> entityFound = orderDetailRepository.findByOrderIdAndProductDetailId(requestDTO.getOrderId(), requestDTO.getProductDetailId());
        Optional<ProductDetail> productDetailFound = productDetailRepository.findById(requestDTO.getProductDetailId());
        System.out.println(entityFound.isPresent());
        System.out.println(productDetailFound.isPresent());

        // chua check nhap so luong < 1    10/12/2024 da fix (sai thi xoa nhe =)))
        if (requestDTO.getQuantity() < 1) {
            throw new RestApiException("Số lượng phải lớn hơn 1!");
        }
        // hung code doan nay
        if (entityFound.isPresent() && productDetailFound.isPresent()) {
            int newCount = entityFound.get().getQuantity() + requestDTO.getQuantity();
            if (newCount > productDetailFound.get().getQuantity()) {
                throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
            } else {
                entityFound.get().setQuantity(newCount);
                // truonwfg hop hoa don nay chua xong nhunwg thanh toan cho khach sau truoc sau
                // muon thanh toan lai hoa don cu (tim theo ma , theo trang thai,...)
                // Tru di so luong san pham trong kho chua ha anh
                productDetailFound.get().setQuantity(productDetailFound.get().getQuantity() - requestDTO.getQuantity());
                productDetailRepository.save(productDetailFound.get());
                // hung code doan nay
                OrderDetail response = orderDetailRepository.save(entityFound.get());
                orderService.reloadTotalOrder(response.getOrder());
                return response;
            }
        } else {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setDeleted(false);
            orderDetail.setQuantity(requestDTO.getQuantity());
            orderDetail.setOrder(orderService.findById(requestDTO.getOrderId()));
            orderDetail.setProductDetail(orderProductDetailRepository.findById(requestDTO.getProductDetailId()).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Product detail not found")));
            OrderDetail response = orderDetailRepository.save(orderDetail);
            orderService.reloadTotalOrder(orderDetail.getOrder());
            return response;
        }
    }

    @Override
    public OrderDetail update(Integer integer, OrderDetailRequestDTO requestDTO) {
        return null;
    }


//    public OrderDetail updateQuantity(Integer integer, int newQuantity) {
//        OrderDetail orderDetail = findById(integer);
//        int quantityInStorage = orderDetail.getProductDetail().getQuantity();
//        int quantityInOrder = orderDetail.getQuantity();
//
//        if (newQuantity > quantityInStorage) {
//            throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
//        } else if (newQuantity == 0) {
//            orderDetailRepository.delete(orderDetail);
//            orderService.reloadTotalOrder(orderDetail.getOrder());
//            return orderDetail;
//        } else {
//            orderDetail.setQuantity(newQuantity);
//            orderService.reloadTotalOrder(orderDetail.getOrder());
//            return orderDetailRepository.save(orderDetail);
//        }
//    }

    // cái này có giống của Hà anh k tôi thấy giống giống =))
    // hung code
    public OrderDetail updateQuantity(Integer integer, Integer newQuantity) {
        OrderDetail orderDetail = findById(integer);
        ProductDetail productDetail = orderDetail.getProductDetail();
        if (newQuantity > (productDetail.getQuantity() + orderDetail.getQuantity())) {
            throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
        } else if (newQuantity <= 0) {
            throw new CustomExceptions.CustomBadRequest("Vui lòng nhập số lượng hợp lệ!");
        }
        productDetail.setQuantity(productDetail.getQuantity() + orderDetail.getQuantity() - newQuantity);
        orderDetail.setQuantity(newQuantity);
        orderDetailRepository.save(orderDetail);
        productDetailRepository.save(productDetail);

        Order order = orderDetail.getOrder();
        if (order.getStatus() != Status.CREATE_AN_ORDER) {
            Double caculateTotalMoney = 0.0;
            List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(orderDetail.getOrder().getId());
            if (orderDetails != null) {
                caculateTotalMoney = orderDetails.stream()
                        .mapToDouble(detail -> detail.getQuantity() * detail.getProductDetail().getPrice().doubleValue())
                        .sum();
            }
            // truong hop co tien tra lai chua xet (dung xoa comment nay nhe )
            order.setTotal(caculateTotalMoney);
            if (order.getStatus() == Status.TOSHIP ||
                    order.getStatus() == Status.PENDING ||
                    order.getStatus() == Status.WAITING_YOUR_PAYMENT
            ) {
                History history = new History();
                history.setOrder(order);
                history.setNote("Đã sửa số lượng "+ " sản phẩm \"" + productDetail.getName() + " [" + productDetail.getColor().getName() + "-" + productDetail.getSize().getName() + "]\" lên \"" + newQuantity + "\"" );
                history.setStatus(Status.EDIT_AN_ORDER);
                historyRepository.save(history);
            }
            orderRepository.save(order);
        }
        return orderDetail;
    }
    // hung code
}
