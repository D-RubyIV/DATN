package org.example.demo.entity.order.enums;

public enum Status {
    CREATE_AN_ORDER, // Tạo Đơn Hàng
    WAITING_YOUR_PAYMENT, // Chờ thanh toán
    CONFIRM_PAYMENT, // Xác nhận thông tin thanh toán
    EDIT_AN_ORDER, // Chỉnh sửa đơn hàng

    PENDING,    // Chờ xác nhận
    TOSHIP,     // Chờ giao hàng
    TORECEIVE,  // Đang giao hàng
    DELIVERED,  // Hoàn thành
    CANCELED,   // Đã hủy
    RETURNED    // Trả hàng
}
