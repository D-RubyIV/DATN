package org.example.demo.entity.order.enums;

public enum Status {
    PENDING, // Chờ xác nhận
    PICKUP, // Chờ lấy hàng
    DELIVERY, // Chờ giao hàng
    DELIVERED, // Đã giao
    CANCELED, // Đã hủy
    RETURNED // Trả hàng
}