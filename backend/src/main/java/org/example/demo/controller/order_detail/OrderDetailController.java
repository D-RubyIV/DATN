package org.example.demo.controller.order_detail;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.controller.IControllerBasic;
import org.example.demo.dto.order.properties.request.OrderDetailRequestDTO;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.mapper.order.properties.response.OrderDetailResponseMapper;
import org.example.demo.repository.order.OrderProductDetailRepository;
import org.example.demo.service.order.OrderService;
import org.example.demo.service.order_detail.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RequestMapping(value = "order-details")
@RestController
public class OrderDetailController implements IControllerBasic<OrderDetail, OrderDetailRequestDTO> {

    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    private OrderDetailResponseMapper orderDetailResponseMapper;


    @GetMapping(value = "")
    public ResponseEntity<?> findAll(){
        return ResponseEntity.ok(orderDetailService.findAll());
    }

    @Override
    @PostMapping(value = "")
    public ResponseEntity<?> create(@Valid @RequestBody OrderDetailRequestDTO orderDetailRequestDTO) throws BadRequestException {
        return ResponseEntity.ok(orderDetailResponseMapper.toDTO(orderDetailService.save(orderDetailRequestDTO)));
    }

    @Override
    public ResponseEntity<?> update(OrderDetail orderDetail, OrderDetailRequestDTO orderDetailRequestDTO) {
        return null;
    }

    @Override
    public ResponseEntity<?> delete(OrderDetail orderDetail) throws BadRequestException {
        return null;
    }

    @Override
    public ResponseEntity<?> detail(OrderDetail orderDetail) throws BadRequestException {
        return null;
    }
}
