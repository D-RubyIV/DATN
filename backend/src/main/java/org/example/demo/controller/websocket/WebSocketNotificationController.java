package org.example.demo.controller.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketNotificationController {

    @MessageMapping("/order-notification") // Endpoint nhận thông báo
    @SendTo("/topic/notifications") // Nơi gửi thông báo đến client
    public String notifyStaff(String orderInfo) {
        return orderInfo; // Thông báo sẽ được gửi đến tất cả các client lắng nghe
    }
}
