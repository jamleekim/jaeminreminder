package jaemin.ai.jaeminreminder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ReminderListRequest(
        @NotBlank String name,
        @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "HEX 색상 형식이어야 합니다 (예: #007AFF)") String color,
        String icon
) {}
