package org.example.demo.config.security;

import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private TokenRequestFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity, HandlerMappingIntrospector handlerMappingIntrospector) throws Exception {
        httpSecurity.sessionManagement(ss -> ss.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        httpSecurity.csrf(AbstractHttpConfigurer::disable);
        httpSecurity.cors(AbstractHttpConfigurer::disable);
        MvcRequestMatcher.Builder mvcMatcherBuilder = new MvcRequestMatcher.Builder(handlerMappingIntrospector);
        httpSecurity
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(
                        authorize -> authorize
                                .requestMatchers(mvcMatcherBuilder.pattern("users/**")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("v2/product")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("color/color-list")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("size/size-list")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("productDetails/abc")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("productDetails/**")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("orders/convert/**")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("orders/status/change/**")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("payment/**")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern(HttpMethod.POST, "orders/**")).hasAnyAuthority("ROLE_ADMIN")
                                .requestMatchers(mvcMatcherBuilder.pattern(HttpMethod.GET, "orders/**")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("voucher/**")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("customer/**")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("staffs/**")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("product/**")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("cart/v2")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("cart/**")).permitAll()
                                .requestMatchers(mvcMatcherBuilder.pattern("cart-details/**")).permitAll()
                                .anyRequest().authenticated()
                );
        httpSecurity.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        httpSecurity.exceptionHandling(ex -> {
            ex.authenticationEntryPoint((request, response, authException) -> response.sendError(401, "Unauthorized"));
            ex.accessDeniedHandler((request, response, authException) -> response.sendError(403, "Forbidden"));
        });
        return httpSecurity.build();
    }
}