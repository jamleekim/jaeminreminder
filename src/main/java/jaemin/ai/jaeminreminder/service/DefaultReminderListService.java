package jaemin.ai.jaeminreminder.service;

import jaemin.ai.jaeminreminder.domain.ReminderList;
import jaemin.ai.jaeminreminder.dto.ReminderListRequest;
import jaemin.ai.jaeminreminder.dto.ReminderListResponse;
import jaemin.ai.jaeminreminder.dto.ReorderRequest;
import jaemin.ai.jaeminreminder.service.ports.inp.ReminderListService;
import jaemin.ai.jaeminreminder.repository.ReminderListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultReminderListService implements ReminderListService {

    private final ReminderListRepository repository;

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
        int nextOrder = (int) repository.count();
        ReminderList list = ReminderList.builder()
                .name(request.name())
                .color(request.color())
                .icon(request.icon())
                .displayOrder(nextOrder)
                .build();
        return ReminderListResponse.from(repository.save(list));
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
        repository.delete(list);
    }

    @Override
    @Transactional
    public void reorder(ReorderRequest request) {
        List<Long> ids = request.ids();
        for (int i = 0; i < ids.size(); i++) {
            ReminderList list = getById(ids.get(i));
            list.updateDisplayOrder(i);
        }
    }

    private ReminderList getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ReminderList not found: " + id));
    }
}
