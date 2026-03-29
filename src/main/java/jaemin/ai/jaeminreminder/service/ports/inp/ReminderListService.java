package jaemin.ai.jaeminreminder.service.ports.inp;

import jaemin.ai.jaeminreminder.dto.ReminderListRequest;
import jaemin.ai.jaeminreminder.dto.ReminderListResponse;
import jaemin.ai.jaeminreminder.dto.ReorderRequest;

import java.util.List;

public interface ReminderListService {

    List<ReminderListResponse> findAll();

    ReminderListResponse findById(Long id);

    ReminderListResponse create(ReminderListRequest request);

    ReminderListResponse update(Long id, ReminderListRequest request);

    void delete(Long id);

    void reorder(ReorderRequest request);
}
