package jaemin.ai.jaeminreminder.dto;

import jaemin.ai.jaeminreminder.domain.Priority;
import jaemin.ai.jaeminreminder.domain.Reminder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record ReminderResponse(
        Long id,
        String title,
        String notes,
        LocalDate dueDate,
        LocalTime dueTime,
        Priority priority,
        Boolean flagged,
        Boolean completed,
        LocalDateTime completedAt,
        Integer displayOrder,
        Long listId,
        String listName,
        String listColor,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ReminderResponse from(Reminder entity) {
        return new ReminderResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getNotes(),
                entity.getDueDate(),
                entity.getDueTime(),
                entity.getPriority(),
                entity.getFlagged(),
                entity.getCompleted(),
                entity.getCompletedAt(),
                entity.getDisplayOrder(),
                entity.getList().getId(),
                entity.getList().getName(),
                entity.getList().getColor(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
