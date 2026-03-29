package jaemin.ai.jaeminreminder.service;

import jaemin.ai.jaeminreminder.domain.Reminder;
import jaemin.ai.jaeminreminder.domain.ReminderList;
import jaemin.ai.jaeminreminder.dto.ReminderRequest;
import jaemin.ai.jaeminreminder.dto.ReminderResponse;
import jaemin.ai.jaeminreminder.dto.ReorderRequest;
import jaemin.ai.jaeminreminder.repository.ReminderListRepository;
import jaemin.ai.jaeminreminder.repository.ReminderRepository;
import jaemin.ai.jaeminreminder.service.ports.inp.ReminderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultReminderService implements ReminderService {

    private final ReminderRepository reminderRepository;
    private final ReminderListRepository listRepository;

    @Override
    public List<ReminderResponse> findByListId(Long listId) {
        return reminderRepository.findByListIdOrderByDisplayOrderAsc(listId).stream()
                .map(ReminderResponse::from)
                .toList();
    }

    @Override
    public ReminderResponse findById(Long id) {
        return ReminderResponse.from(getById(id));
    }

    @Override
    @Transactional
    public ReminderResponse create(Long listId, ReminderRequest request) {
        ReminderList list = listRepository.findById(listId)
                .orElseThrow(() -> new NoSuchElementException("ReminderList not found: " + listId));
        Reminder top = reminderRepository.findTopByListIdOrderByDisplayOrderDesc(listId);
        int nextOrder = top != null ? top.getDisplayOrder() + 1 : 0;
        Reminder reminder = Reminder.builder()
                .title(request.title())
                .notes(request.notes())
                .dueDate(request.dueDate())
                .dueTime(request.dueTime())
                .priority(request.priority())
                .flagged(request.flagged())
                .displayOrder(nextOrder)
                .list(list)
                .build();
        return ReminderResponse.from(reminderRepository.save(reminder));
    }

    @Override
    @Transactional
    public ReminderResponse update(Long id, ReminderRequest request) {
        Reminder reminder = getById(id);
        reminder.update(request.title(), request.notes(), request.dueDate(),
                request.dueTime(), request.priority(), request.flagged());
        if (request.listId() != null && !request.listId().equals(reminder.getList().getId())) {
            ReminderList newList = listRepository.findById(request.listId())
                    .orElseThrow(() -> new NoSuchElementException("ReminderList not found: " + request.listId()));
            reminder.moveToList(newList);
        }
        return ReminderResponse.from(reminder);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Reminder reminder = getById(id);
        reminderRepository.delete(reminder);
    }

    @Override
    @Transactional
    public ReminderResponse toggleComplete(Long id) {
        Reminder reminder = getById(id);
        reminder.toggleComplete();
        return ReminderResponse.from(reminder);
    }

    @Override
    @Transactional
    public ReminderResponse toggleFlag(Long id) {
        Reminder reminder = getById(id);
        reminder.toggleFlag();
        return ReminderResponse.from(reminder);
    }

    @Override
    @Transactional
    public void reorder(ReorderRequest request) {
        List<Long> ids = request.ids();
        if (ids.size() != ids.stream().distinct().count()) {
            throw new IllegalArgumentException("중복된 ID가 포함되어 있습니다.");
        }
        List<Reminder> reminders = ids.stream().map(this::getById).toList();
        for (int i = 0; i < reminders.size(); i++) {
            reminders.get(i).updateDisplayOrder(i);
        }
    }

    @Override
    public List<ReminderResponse> findToday() {
        return reminderRepository.findByDueDateAndCompletedFalseOrderByDisplayOrderAsc(LocalDate.now()).stream()
                .map(ReminderResponse::from)
                .toList();
    }

    @Override
    public List<ReminderResponse> findScheduled() {
        return reminderRepository.findByDueDateIsNotNullAndCompletedFalseOrderByDueDateAsc().stream()
                .map(ReminderResponse::from)
                .toList();
    }

    @Override
    public List<ReminderResponse> findAll() {
        return reminderRepository.findByCompletedFalseOrderByDisplayOrderAsc().stream()
                .map(ReminderResponse::from)
                .toList();
    }

    @Override
    public List<ReminderResponse> findCompleted() {
        return reminderRepository.findByCompletedTrueOrderByCompletedAtDesc().stream()
                .map(ReminderResponse::from)
                .toList();
    }

    @Override
    public List<ReminderResponse> findFlagged() {
        return reminderRepository.findByFlaggedTrueAndCompletedFalseOrderByDisplayOrderAsc().stream()
                .map(ReminderResponse::from)
                .toList();
    }

    @Override
    public List<ReminderResponse> search(String query) {
        String escaped = query.replace("%", "\\%").replace("_", "\\_");
        return reminderRepository.search(escaped).stream()
                .map(ReminderResponse::from)
                .toList();
    }

    private Reminder getById(Long id) {
        return reminderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reminder not found: " + id));
    }
}
