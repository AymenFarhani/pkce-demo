package com.pkce_bff.web;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/public")
    public Map<String, String> getPublicData() {
        return Map.of("message", "Hello! This endpoint is completely PUBLIC.");
    }

    @GetMapping("/protected")
    public Map<String, Object> getProtectedData(@AuthenticationPrincipal Jwt jwt) {
        return Map.of(
                "message", "Success! You have verified your identity using OAuth2 PKCE Flow.",
                "username", jwt.getClaimAsString("preferred_username"),
                "email", jwt.getClaimAsString("email")
        );
    }
}
