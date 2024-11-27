//package org.example.demo.config;
//
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.core.Ordered;
//import org.springframework.core.annotation.Order;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//@Component("customCorsFilter")
//@Order(Ordered.HIGHEST_PRECEDENCE)
//public class CorsFilter extends OncePerRequestFilter {
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        // Thiết lập các header CORS
//        response.setHeader("Access-Control-Allow-Origin", "*"); // Cho phép mọi domain
//        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS"); // Các phương thức HTTP được phép
//        response.setHeader("Access-Control-Max-Age", "3600"); // Thời gian cache preflight request (3600 giây)
//        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, XSRF-TOKEN"); // Các header cho phép
//        response.setHeader("Access-Control-Allow-Credentials", "false"); // Không cho phép cookie
//
//        // Nếu là preflight request (OPTIONS), trả về status 200 mà không cần tiếp tục với các bộ lọc khác
//        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
//            response.setStatus(HttpServletResponse.SC_OK);
//        } else {
//            // Tiến hành gọi tiếp các filter còn lại
//            filterChain.doFilter(request, response);
//        }
//    }
//}
