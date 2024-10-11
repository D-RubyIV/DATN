package org.example.demo.service.order;

import org.example.demo.dto.order.core.request.OrderRequestDTO;
import org.example.demo.entity.order.core.Order;

public interface IOrderService {

    Order changeInforCustomer(Integer id, OrderRequestDTO requestDTO);
}
