package org.example.demo.service.token;

import jakarta.validation.executable.ValidateOnExecution;
import lombok.RequiredArgsConstructor;
import org.example.demo.components.JwtTokenUtils;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.security.Token;
import org.example.demo.exception.DataNotFoundException;
import org.example.demo.exception.ExpiredTokenException;
import org.example.demo.repository.security.TokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenService implements  ITokenService{

    private static final int MAX_TOKENS = 3;

    @Value("${jwt.expiration}")
    private int expiration; //save to an environment variable

    @Value("${jwt.expiration-refresh-token}")
    private int expirationRefreshToken;

    private final TokenRepository tokenRepository;
    private final JwtTokenUtils jwtTokenUtils;

    @Override
    @Transactional
    public Token addToken(Staff staff, String token, boolean isMobileDevice) {
        List<Token> userTokens = tokenRepository.findByStaff(staff);
        int tokenCount = userTokens.size();
        // neu so luong token vuot qua gioi han , xoa 1 token cu
        if (tokenCount >= MAX_TOKENS) {
            //kiểm tra xem trong danh sách userTokens có tồn tại ít nhất
            //một token không phải là thiết bị di động (non-mobile)
            boolean hasNonMobileToken = !userTokens.stream().allMatch(Token::isMobile);
            Token tokenToDelete;
            if (hasNonMobileToken) {
                tokenToDelete = userTokens.stream()
                        .filter(userToken -> !userToken.isMobile())
                        .findFirst()
                        .orElse(userTokens.get(0));
            } else {
                //tất cả các token đều là thiết bị di động,
                //chúng ta sẽ xóa token đầu tiên trong danh sách
                tokenToDelete = userTokens.get(0);
            }
            tokenRepository.delete(tokenToDelete);
        }long expirationInSeconds = expiration;
        LocalDateTime expirationDateTime = LocalDateTime.now().plusSeconds(expirationInSeconds);
        // Tạo mới một token cho người dùng
        Token newToken = Token.builder()
                .staff(staff)
                .token(token)
                .revoked(false)
                .expired(false)
                .tokenType("Bearer")
                .expirationDate(expirationDateTime)
                .isMobile(isMobileDevice)
                .build();

        newToken.setRefreshToken(UUID.randomUUID().toString());
        newToken.setRefreshExpirationDate(LocalDateTime.now().plusSeconds(expirationRefreshToken));
        tokenRepository.save(newToken);
        return newToken;
    }

    @Override
    @Transactional
    public Token refreshToken(String refresh, Staff staff) throws Exception {
        Token existingToken = tokenRepository.findByRefreshToken(refresh);
        if (existingToken == null) {
            throw  new DataNotFoundException("Refresh token does not exist");
        }
        if(existingToken.getRefreshExpirationDate().compareTo(LocalDateTime.now()) < 0) {
            tokenRepository.delete(existingToken);
            throw  new ExpiredTokenException("Refresh token is expired");
        }
        String token = jwtTokenUtils.generateToken(staff);
        LocalDateTime expirationDateTime = LocalDateTime.now().plusSeconds(expiration);
        existingToken.setExpirationDate(expirationDateTime);
        existingToken.setToken(token);
        existingToken.setRefreshToken(UUID.randomUUID().toString());
        existingToken.setRefreshExpirationDate(LocalDateTime.now().plusSeconds(expirationRefreshToken));
        return existingToken;
    }
}