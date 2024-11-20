package org.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // Định nghĩa nơi lưu trữ thông báo
        config.setApplicationDestinationPrefixes("/app"); // Tiền tố cho các endpoint WebSocket
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // Endpoint WebSocket
                .setAllowedOrigins("http://localhost:5173") // Frontend React
                .withSockJS(); // Hỗ trợ fallback SockJS nếu trình duyệt không hỗ trợ WebSocket
    }
}
