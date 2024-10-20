package org.example.demo.components;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.security.Token;
import org.example.demo.repository.security.TokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.InvalidParameterException;
import java.security.Key;
import java.security.SecureRandom;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtTokenUtils {

    @Value("${jwt.expiration}")
    private int expiration; //save to an environment variable

    @Value("${jwt.expiration-refresh-token}")
    private int expirationRefreshToken;


    @Value("${jwt.secretKey}")
    private String secretKey;

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenUtils.class);
    private final TokenRepository tokenRepository;

    public String generateToken(Staff staff) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", staff.getEmail());
        claims.put("staffId", staff.getId());
        try {
            String token = Jwts.builder()
                    .setClaims(claims) // how to extract claims from this ?
                    .setSubject(staff.getEmail())
                    .setExpiration(new Date(System.currentTimeMillis() + expiration *100L))
                    .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                    .compact();
            return token;
        } catch (Exception e) {
            throw new InvalidParameterException("Cannot create jwt token, error: " + e.getMessage());
        }
    }

    private Key getSignInKey() {
        byte[] bytes = Decoders.BASE64.decode(secretKey);
        //Keys.hmacShaKeyFor(Decoders.BASE64.decode("TaqlmGv1iEDMRiFp/pHuID1+T84IABfuA0xXh4GhiUI="));
        return Keys.hmacShaKeyFor(bytes);
    }

    private String generateSecretKey() {
        SecureRandom random = new SecureRandom();
        byte[] keyBytes = new byte[32]; // 256-bit key
        random.nextBytes(keyBytes);
        String secretKey = Encoders.BASE64.encode(keyBytes);
        return secretKey;
    }

    // truyen vao token lay ra doi tuong
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public  <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = this.extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    //check expiration
    public boolean isTokenExpired(String token) {
        Date expirationDate = this.extractClaim(token, Claims::getExpiration);
        return expirationDate.before(new Date());
    }

    public String extractEmail(String token) {return extractClaim(token, Claims::getSubject);}

    public boolean validateToken(String token, Staff staffDetails) {
        try {
            String email = extractEmail(token);
            Token existingToken = tokenRepository.findByToken(token);
            if (existingToken == null || existingToken.isRevoked() == true || !staffDetails.isEnabled()) {
                return false;
            }
            return (email.equals(staffDetails.getUsername())) && !isTokenExpired(token);
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

}
