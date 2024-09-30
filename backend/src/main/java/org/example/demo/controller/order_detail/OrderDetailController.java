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
public class OrderDetailController implements IControllerBasic<Integer, OrderDetailRequestDTO> {

    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    private OrderDetailResponseMapper orderDetailResponseMapper;


    @GetMapping(value = "")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(orderDetailService.findAll());
    }

    @Override
    @PostMapping(value = "")
    public ResponseEntity<?> create(@Valid @RequestBody OrderDetailRequestDTO orderDetailRequestDTO) {
        return ResponseEntity.ok(orderDetailResponseMapper.toDTO(orderDetailService.save(orderDetailRequestDTO)));
    }

    @Override
    public ResponseEntity<?> update(Integer integer, OrderDetailRequestDTO orderDetailRequestDTO) {
        return null;
    }

    @GetMapping(value = "quantity/update/{id}")
    public ResponseEntity<?> updateQuantity(@PathVariable Integer id, @RequestParam(value = "quantity", required = true) Integer quantity) {
        return ResponseEntity.ok(orderDetailResponseMapper.toDTO(orderDetailService.updateQuantity(id, quantity)));
    }

    @Override
    @DeleteMapping(value = "{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return ResponseEntity.ok(orderDetailService.delete(id));
    }

    @Override
    public ResponseEntity<?> detail(Integer integer) {
        return null;
    }
}
