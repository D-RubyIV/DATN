package org.example.demo.service.order_detail;

import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.order.properties.request.OrderDetailRequestDTO;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.repository.order.OrderProductDetailRepository;
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
    private OrderProductDetailRepository orderProductDetailRepository;
    @Autowired
    private ProductDetailRepository productDetailRepository;

    public List<OrderDetail> findAll() {
        return orderDetailRepository.findAll();
    }

    @Override
    public OrderDetail findById(Integer integer) {
        return orderDetailRepository.findById(integer).orElseThrow(() -> new CustomExceptions.CustomBadRequest("OrderDetail not found"));
    }

    @Override
    @Transactional
    public OrderDetail delete(Integer integer) {
        OrderDetail orderDetail = findById(integer);
        orderDetailRepository.delete(orderDetail);
        orderService.reloadTotalOrder(orderDetail.getOrder());
        return orderDetail;
    }

    @Override
    public OrderDetail save(OrderDetailRequestDTO requestDTO) {
        Optional<OrderDetail> entityFound = orderDetailRepository.findByOrderIdAndProductDetailId(requestDTO.getOrderId(), requestDTO.getProductDetailId());
        Optional<ProductDetail> productDetailFound = productDetailRepository.findById(requestDTO.getProductDetailId());
        System.out.println(entityFound.isPresent());
        System.out.println(productDetailFound.isPresent());
        // chua check nahp so luong < 1
        if (entityFound.isPresent() && productDetailFound.isPresent()) {
            int newCount = entityFound.get().getQuantity() + requestDTO.getQuantity();
            if (newCount > productDetailFound.get().getQuantity()) {
                throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
            } else {
                entityFound.get().setQuantity(newCount);
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


    public OrderDetail updateQuantity(Integer integer, int newQuantity) {
        OrderDetail orderDetail = findById(integer);
        int quantityInStorage = orderDetail.getProductDetail().getQuantity();
        int quantityInOrder = orderDetail.getQuantity();

        if (newQuantity > quantityInStorage) {
            throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
        } else if (newQuantity == 0) {
            orderDetailRepository.delete(orderDetail);
            orderService.reloadTotalOrder(orderDetail.getOrder());
            return orderDetail;
        } else {
            orderDetail.setQuantity(newQuantity);
            orderService.reloadTotalOrder(orderDetail.getOrder());
            return orderDetailRepository.save(orderDetail);
        }
    }
}
