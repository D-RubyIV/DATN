package org.example.demo.service.statistic;

import org.example.demo.dto.statistic.response.StatisticOverviewResponse;
import org.example.demo.dto.statistic.response.StatisticOverviewResponseImpl;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.service.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatisticService {
    @Autowired
    private OrderService orderService;

    public List<StatisticOverviewResponse> calculateRevenueAnyDay(LocalDateTime from, LocalDateTime to) {
        List<StatisticOverviewResponse> orderList = orderService.fetchOrdersByStatusAndRangeTime(Status.DELIVERED, from, to);
        List<StatisticOverviewResponse> result = orderList.stream().map(order -> {
            return new StatisticOverviewResponseImpl(order.getCreateDate(), order.getTotalRevenue(), order.getQuantityOrder());
        }).collect(Collectors.toList());

        return result;
    }


}
