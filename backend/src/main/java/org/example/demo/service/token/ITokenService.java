package org.example.demo.service.token;

import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.security.TokenRecord;

public interface ITokenService {
    TokenRecord addToken(Staff staff, String token, boolean isMobileDevice);

    TokenRecord refreshToken(String refresh, Staff staff) throws Exception;
}
