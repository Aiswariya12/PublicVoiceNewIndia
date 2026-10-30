package com.newindia.user.dto;

import com.newindia.user.Role;
import java.time.LocalDateTime;

public record UserProfileResponse(
    Long id,
    String fullName,
    String email,
    Role role,
    LocalDateTime createdAt
) {}