package jaemin.ai.jaeminreminder.repository;

import jaemin.ai.jaeminreminder.domain.ReminderList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReminderListRepository extends JpaRepository<ReminderList, Long> {

    List<ReminderList> findAllByOrderByDisplayOrderAsc();

    ReminderList findTopByOrderByDisplayOrderDesc();
}
