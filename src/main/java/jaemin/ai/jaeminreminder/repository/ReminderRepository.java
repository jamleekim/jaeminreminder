package jaemin.ai.jaeminreminder.repository;

import jaemin.ai.jaeminreminder.domain.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.EntityGraph;

import java.time.LocalDate;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    @EntityGraph(attributePaths = "list")
    List<Reminder> findByListIdOrderByDisplayOrderAsc(Long listId);

    @EntityGraph(attributePaths = "list")
    List<Reminder> findByCompletedFalseOrderByDisplayOrderAsc();

    @EntityGraph(attributePaths = "list")
    List<Reminder> findByCompletedTrueOrderByCompletedAtDesc();

    @EntityGraph(attributePaths = "list")
    List<Reminder> findByFlaggedTrueAndCompletedFalseOrderByDisplayOrderAsc();

    @EntityGraph(attributePaths = "list")
    List<Reminder> findByDueDateAndCompletedFalseOrderByDisplayOrderAsc(LocalDate dueDate);

    @EntityGraph(attributePaths = "list")
    List<Reminder> findByDueDateIsNotNullAndCompletedFalseOrderByDueDateAsc();

    @Query("SELECT r FROM Reminder r WHERE r.completed = false AND (LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) ESCAPE '\\' OR LOWER(r.notes) LIKE LOWER(CONCAT('%', :query, '%')) ESCAPE '\\') ORDER BY r.displayOrder ASC")
    List<Reminder> search(@Param("query") String query);

    int countByListIdAndCompletedFalse(Long listId);

    Reminder findTopByListIdOrderByDisplayOrderDesc(Long listId);
}
