package org.example.demo.entity.order.enums;

public enum Status {
    WAITING_YOUR_PAYMENT, // Chờ thanh toán
    CREATE_AN_ORDER, // Tạo Đơn Hàng
    PENDING,    // Chờ xác nhận
    CONFIRM_PAYMENT, // Xác nhận thông tin thanh toán
    TOSHIP,     // Chờ giao hàng
    TORECEIVE,  // Đang giao hàng
    DELIVERED,  // Hoàn thành
    CANCELED,   // Đã hủy
    RETURNED,    // Trả hàng
    EDIT_AN_ORDER // Chỉnh sửa đơn hàng

}
