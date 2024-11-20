package org.example.demo.controller.websocket;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationController {

    // Lắng nghe tin nhắn từ client gửi đến /app/order-placed
    @MessageMapping("/order-placed")
    @SendTo("/topic/notifications")
    public String notifyOrder(String message) {
        // Xử lý thông báo khi khách hàng đặt hàng
        return "New order placed: " + message;
    }
}
