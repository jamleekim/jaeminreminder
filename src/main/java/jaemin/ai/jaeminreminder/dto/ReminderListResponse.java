package jaemin.ai.jaeminreminder.dto;

import jaemin.ai.jaeminreminder.domain.ReminderList;

import java.time.LocalDateTime;

public record ReminderListResponse(
        Long id,
        String name,
        String color,
        String icon,
        Integer displayOrder,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ReminderListResponse from(ReminderList entity) {
        return new ReminderListResponse(
                entity.getId(),
                entity.getName(),
                entity.getColor(),
                entity.getIcon(),
                entity.getDisplayOrder(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
