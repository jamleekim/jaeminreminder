package jaemin.ai.jaeminreminder.service.ports.inp;

import jaemin.ai.jaeminreminder.dto.ReminderRequest;
import jaemin.ai.jaeminreminder.dto.ReminderResponse;
import jaemin.ai.jaeminreminder.dto.ReorderRequest;

import java.util.List;

public interface ReminderService {

    List<ReminderResponse> findByListId(Long listId);

    ReminderResponse findById(Long id);

    ReminderResponse create(Long listId, ReminderRequest request);

    ReminderResponse update(Long id, ReminderRequest request);

    void delete(Long id);

    ReminderResponse toggleComplete(Long id);

    ReminderResponse toggleFlag(Long id);

    void reorder(ReorderRequest request);

    List<ReminderResponse> findToday();

    List<ReminderResponse> findScheduled();

    List<ReminderResponse> findAll();

    List<ReminderResponse> findCompleted();

    List<ReminderResponse> findFlagged();

    List<ReminderResponse> search(String query);
}
