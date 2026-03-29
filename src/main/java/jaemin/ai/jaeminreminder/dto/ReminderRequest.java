package jaemin.ai.jaeminreminder.dto;

import jaemin.ai.jaeminreminder.domain.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReminderRequest(
        @NotBlank String title,
        @Size(max = 5000) String notes,
        LocalDate dueDate,
        LocalTime dueTime,
        Priority priority,
        Boolean flagged,
        Long listId
) {}
