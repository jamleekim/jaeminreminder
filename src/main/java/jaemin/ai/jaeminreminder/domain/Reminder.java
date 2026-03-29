package jaemin.ai.jaeminreminder.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "reminder")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDate dueDate;

    private LocalTime dueTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Column(nullable = false)
    private Boolean flagged;

    @Column(nullable = false)
    private Boolean completed;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private Integer displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "list_id", nullable = false)
    private ReminderList list;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Builder
    public Reminder(String title, String notes, LocalDate dueDate, LocalTime dueTime,
                    Priority priority, Boolean flagged, Integer displayOrder, ReminderList list) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.priority = priority != null ? priority : Priority.NONE;
        this.flagged = flagged != null ? flagged : false;
        this.completed = false;
        this.displayOrder = displayOrder;
        this.list = list;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    public void update(String title, String notes, LocalDate dueDate, LocalTime dueTime,
                       Priority priority, Boolean flagged) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.priority = priority != null ? priority : Priority.NONE;
        this.flagged = flagged != null ? flagged : this.flagged;
        this.updatedAt = LocalDateTime.now();
    }

    public void toggleComplete() {
        this.completed = !this.completed;
        this.completedAt = this.completed ? LocalDateTime.now() : null;
        this.updatedAt = LocalDateTime.now();
    }

    public void toggleFlag() {
        this.flagged = !this.flagged;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
        this.updatedAt = LocalDateTime.now();
    }

    public void moveToList(ReminderList list) {
        this.list = list;
        this.updatedAt = LocalDateTime.now();
    }
}
