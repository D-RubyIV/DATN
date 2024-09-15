package org.example.demo.service.order_detail;

import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.order.properties.request.OrderDetailRequestDTO;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.repository.order.OrderProductDetailRepository;
import org.example.demo.repository.order_detail.OrderDetailRepository;
import org.example.demo.service.IService;
import org.example.demo.service.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class OrderDetailService implements IService<OrderDetail, Integer, OrderDetailRequestDTO> {
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderProductDetailRepository orderProductDetailRepository;

    public List<OrderDetail> findAll(){
        return orderDetailRepository.findAll();
    }

    @Override
    public OrderDetail findById(Integer integer) throws BadRequestException {
        return orderDetailRepository.findById(integer).orElseThrow(() -> new BadRequestException("OrderDetail not found"));
    }

    @Override
    @Transactional
    public OrderDetail delete(Integer integer) throws BadRequestException {
        OrderDetail orderDetail = findById(integer);
        orderDetail.setDeleted(true);
        return null;
    }

    @Override
    public OrderDetail save(OrderDetailRequestDTO requestDTO) throws BadRequestException {
        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setDeleted(false);
        orderDetail.setQuantity(requestDTO.getQuantity());
        orderDetail.setOrder(orderService.findById(requestDTO.getOrderId()));
        orderDetail.setProductDetail(orderProductDetailRepository.findById(requestDTO.getOrderId()).orElseThrow(()-> new BadRequestException("Product detail not found")));
        return orderDetailRepository.save(orderDetail);
    }

    @Override
    public OrderDetail update(Integer integer, OrderDetailRequestDTO requestDTO) {
        return null;
    }
}
