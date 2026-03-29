package jaemin.ai.jaeminreminder.repository;

import jaemin.ai.jaeminreminder.domain.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByListIdOrderByDisplayOrderAsc(Long listId);

    List<Reminder> findByCompletedFalseOrderByDisplayOrderAsc();

    List<Reminder> findByCompletedTrueOrderByCompletedAtDesc();

    List<Reminder> findByFlaggedTrueAndCompletedFalseOrderByDisplayOrderAsc();

    List<Reminder> findByDueDateAndCompletedFalseOrderByDisplayOrderAsc(LocalDate dueDate);

    List<Reminder> findByDueDateIsNotNullAndCompletedFalseOrderByDueDateAsc();

    @Query("SELECT r FROM Reminder r WHERE r.completed = false AND (LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.notes) LIKE LOWER(CONCAT('%', :query, '%'))) ORDER BY r.displayOrder ASC")
    List<Reminder> search(@Param("query") String query);

    int countByListIdAndCompletedFalse(Long listId);

    Reminder findTopByListIdOrderByDisplayOrderDesc(Long listId);
}
