package jaemin.ai.jaeminreminder.service;

import jaemin.ai.jaeminreminder.domain.ReminderList;
import jaemin.ai.jaeminreminder.dto.ReminderListRequest;
import jaemin.ai.jaeminreminder.dto.ReminderListResponse;
import jaemin.ai.jaeminreminder.dto.ReorderRequest;
import jaemin.ai.jaeminreminder.service.ports.inp.ReminderListService;
import jaemin.ai.jaeminreminder.repository.ReminderListRepository;
import jaemin.ai.jaeminreminder.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultReminderListService implements ReminderListService {

    private final ReminderListRepository repository;
    private final ReminderRepository reminderRepository;

    @Override
    public List<ReminderListResponse> findAll() {
        return repository.findAllByOrderByDisplayOrderAsc().stream()
                .map(ReminderListResponse::from)
                .toList();
    }

    @Override
    public ReminderListResponse findById(Long id) {
        return ReminderListResponse.from(getById(id));
    }

    @Override
    @Transactional
    public ReminderListResponse create(ReminderListRequest request) {
        ReminderList top = repository.findTopByOrderByDisplayOrderDesc();
        int nextOrder = top != null ? top.getDisplayOrder() + 1 : 0;
        ReminderList list = ReminderList.builder()
                .name(request.name())
                .color(request.color())
                .icon(request.icon())
                .displayOrder(nextOrder)
                .build();
        ReminderListResponse saved = ReminderListResponse.from(repository.save(list));
        log.info("리스트 생성: id={}, name={}", saved.id(), saved.name());
        return saved;
    }

    @Override
    @Transactional
    public ReminderListResponse update(Long id, ReminderListRequest request) {
        ReminderList list = getById(id);
        list.update(request.name(), request.color(), request.icon());
        return ReminderListResponse.from(list);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ReminderList list = getById(id);
        reminderRepository.deleteAll(reminderRepository.findByListIdOrderByDisplayOrderAsc(id));
        repository.delete(list);
        log.info("리스트 삭제: id={}, name={}", id, list.getName());
    }

    @Override
    @Transactional
    public void reorder(ReorderRequest request) {
        List<Long> ids = request.ids();
        if (ids.size() != ids.stream().distinct().count()) {
            throw new IllegalArgumentException("중복된 ID가 포함되어 있습니다.");
        }
        List<ReminderList> lists = ids.stream().map(this::getById).toList();
        for (int i = 0; i < lists.size(); i++) {
            lists.get(i).updateDisplayOrder(i);
        }
    }

    private ReminderList getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ReminderList not found: " + id));
    }
}
