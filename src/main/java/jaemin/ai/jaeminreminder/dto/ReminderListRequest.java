package jaemin.ai.jaeminreminder.dto;

import jakarta.validation.constraints.NotBlank;

public record ReminderListRequest(
        @NotBlank String name,
        @NotBlank String color,
        String icon
) {}
