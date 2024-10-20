package org.example.demo.service.token;

import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.security.Token;

public interface ITokenService {
    Token addToken(Staff staff,String token, boolean isMobileDevice);

    Token refreshToken(String refresh, Staff staff) throws Exception;
}
