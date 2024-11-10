package org.example.demo.config.security;


import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.example.demo.components.JwtTokenUtils;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Component
public class TokenRequestFilter extends OncePerRequestFilter {
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private JwtTokenUtils jwtTokenUtil;
    @Autowired
    private HandlerExceptionResolver handlerExceptionResolver;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String myAuthorization = request.getHeader("Authorization");
        if (!(myAuthorization != null && myAuthorization.startsWith("Bearer"))) {
            System.out.println("NOT HAVE AUTHORIZATION");
            filterChain.doFilter(request, response);
            return;
        }
        String tokenClient = myAuthorization.split(" ")[1].trim();

        try {
            if (jwtTokenUtil.getSubject(tokenClient) == null) {
                System.out.println("TOKEN NULL");
                throw new CustomExceptions.CustomBadSecurity("Invalid token");
            }

            String email = jwtTokenUtil.getSubject(tokenClient);
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
            if (userDetails == null) {
                System.out.println("USER NOT FOUND");
                throw new CustomExceptions.CustomBadSecurity("User not found");
            }

            setAuthenticationContext(userDetails, request);

        } catch (ExpiredJwtException e) {
            System.out.println("Expired jwt credentials");
            handlerExceptionResolver.resolveException(request, response, null, new CustomExceptions.CustomBadSecurity("Expired JWT token"));
            return;

        } catch (UsernameNotFoundException e) {
            System.out.println("Username not found");
            handlerExceptionResolver.resolveException(request, response, null, new CustomExceptions.CustomBadSecurity("User not found in database"));
            return;

        } catch (Exception ex) {
            System.out.println("Exception");
            ex.printStackTrace();
            handlerExceptionResolver.resolveException(request, response, null, ex);
            return;
        }

        filterChain.doFilter(request, response);
    }



    private void setAuthenticationContext(UserDetails userDetails, HttpServletRequest request) {
        log.info(String.format("REQUESTS FROM USER: %s", userDetails.getUsername()));
        UsernamePasswordAuthenticationToken
                authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());
        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}