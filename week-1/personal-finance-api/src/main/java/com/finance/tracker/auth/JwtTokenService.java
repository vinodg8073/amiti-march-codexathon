package com.finance.tracker.auth;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finance.tracker.common.UnauthorizedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class JwtTokenService {
    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();
    private static final Duration ACCESS_TOKEN_TTL = Duration.ofMinutes(15);
    private static final Duration REFRESH_TOKEN_TTL = Duration.ofDays(7);

    private final ObjectMapper objectMapper;
    private final byte[] signingKey;

    public JwtTokenService(
            ObjectMapper objectMapper,
            @Value("${finance.jwt.secret:personal-finance-dev-secret-key}") String signingSecret
    ) {
        this.objectMapper = objectMapper;
        this.signingKey = signingSecret.getBytes(StandardCharsets.UTF_8);
    }

    public String createAccessToken(Long userId, String email) {
        return createToken(userId, email, "access", ACCESS_TOKEN_TTL);
    }

    public String createRefreshToken(Long userId, String email) {
        return createToken(userId, email, "refresh", REFRESH_TOKEN_TTL);
    }

    public TokenClaims parseAccessToken(String token) {
        return parseToken(token, "access");
    }

    public TokenClaims parseRefreshToken(String token) {
        return parseToken(token, "refresh");
    }

    private String createToken(Long userId, String email, String tokenType, Duration ttl) {
        try {
            String headerJson = objectMapper.writeValueAsString(Map.of("alg", "HS256", "typ", "JWT"));
            Instant expiresAt = Instant.now().plus(ttl);
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sub", String.valueOf(userId));
            payload.put("email", email);
            payload.put("type", tokenType);
            payload.put("exp", expiresAt.getEpochSecond());
            String payloadJson = objectMapper.writeValueAsString(payload);

            String encodedHeader = ENCODER.encodeToString(headerJson.getBytes(StandardCharsets.UTF_8));
            String encodedPayload = ENCODER.encodeToString(payloadJson.getBytes(StandardCharsets.UTF_8));
            String signature = sign(encodedHeader + "." + encodedPayload);
            return encodedHeader + "." + encodedPayload + "." + signature;
        } catch (Exception error) {
            throw new IllegalStateException("Failed to create token.", error);
        }
    }

    private TokenClaims parseToken(String token, String expectedType) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new UnauthorizedException("Invalid token.");
            }

            String signedContent = parts[0] + "." + parts[1];
            String expectedSignature = sign(signedContent);
            if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) {
                throw new UnauthorizedException("Invalid token signature.");
            }

            Map<String, Object> payload = objectMapper.readValue(DECODER.decode(parts[1]), new TypeReference<>() {});
            String tokenType = String.valueOf(payload.get("type"));
            if (!expectedType.equals(tokenType)) {
                throw new UnauthorizedException("Unexpected token type.");
            }

            Instant expiresAt = Instant.ofEpochSecond(Long.parseLong(String.valueOf(payload.get("exp"))));
            if (expiresAt.isBefore(Instant.now())) {
                throw new UnauthorizedException("Token expired.");
            }

            Long userId = Long.parseLong(String.valueOf(payload.get("sub")));
            return new TokenClaims(userId, tokenType, expiresAt);
        } catch (UnauthorizedException error) {
            throw error;
        } catch (Exception error) {
            throw new UnauthorizedException("Invalid token.");
        }
    }

    private String sign(String value) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(signingKey, "HmacSHA256"));
        return ENCODER.encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    }

    public record TokenClaims(Long userId, String tokenType, Instant expiresAt) {
    }
}
