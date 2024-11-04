//package org.example.demo.config;
//
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//import org.springframework.web.util.pattern.PathPatternParser;
//
//@Configuration
//public class ApiPrefixConfig implements WebMvcConfigurer {
//
//    private final String apiPrefix = "/api/v1";
//
//    @Override
//    public void configurePathMatch(PathMatchConfigurer configurer) {
//        configurer.addPathPrefix(apiPrefix, c -> true); // Áp dụng cho tất cả các controller
//        configurer.setPatternParser(new PathPatternParser());
//    }
//}
