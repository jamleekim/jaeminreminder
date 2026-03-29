package jaemin.ai.jaeminreminder.service;

import jaemin.ai.jaeminreminder.dto.ReminderListRequest;
import jaemin.ai.jaeminreminder.dto.ReminderListResponse;
import jaemin.ai.jaeminreminder.dto.ReorderRequest;
import jaemin.ai.jaeminreminder.service.ports.inp.ReminderListService;
import jaemin.ai.jaeminreminder.repository.ReminderListRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class ReminderListServiceTest {

    @Autowired
    private ReminderListService service;

    @Autowired
    private ReminderListRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    @DisplayName("전체 리스트를 displayOrder 순으로 조회한다")
    void findAll_returns_ordered_lists() {
        service.create(new ReminderListRequest("업무", "#007AFF", "briefcase"));
        service.create(new ReminderListRequest("개인", "#FF3B30", "person"));

        List<ReminderListResponse> result = service.findAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).name()).isEqualTo("업무");
        assertThat(result.get(1).name()).isEqualTo("개인");
    }

    @Test
    @DisplayName("ID로 리스트를 조회한다")
    void findById_returns_list() {
        ReminderListResponse created = service.create(new ReminderListRequest("업무", "#007AFF", "briefcase"));

        ReminderListResponse result = service.findById(created.id());

        assertThat(result.name()).isEqualTo("업무");
        assertThat(result.color()).isEqualTo("#007AFF");
    }

    @Test
    @DisplayName("존재하지 않는 ID로 조회하면 예외가 발생한다")
    void findById_throws_when_not_found() {
        assertThatThrownBy(() -> service.findById(99L))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    @DisplayName("리스트를 생성하면 displayOrder가 자동 부여된다")
    void create_assigns_next_displayOrder() {
        service.create(new ReminderListRequest("업무", "#007AFF", "briefcase"));
        service.create(new ReminderListRequest("개인", "#FF3B30", "person"));
        ReminderListResponse third = service.create(new ReminderListRequest("쇼핑", "#34C759", "cart"));

        assertThat(third.name()).isEqualTo("쇼핑");
        assertThat(third.displayOrder()).isEqualTo(2);
    }

    @Test
    @DisplayName("리스트를 수정하면 name, color, icon이 변경된다")
    void update_changes_fields() {
        ReminderListResponse created = service.create(new ReminderListRequest("업무", "#007AFF", "briefcase"));

        ReminderListResponse result = service.update(created.id(), new ReminderListRequest("개인", "#FF3B30", "person"));

        assertThat(result.name()).isEqualTo("개인");
        assertThat(result.color()).isEqualTo("#FF3B30");
        assertThat(result.icon()).isEqualTo("person");
    }

    @Test
    @DisplayName("리스트를 삭제한다")
    void delete_removes_list() {
        ReminderListResponse created = service.create(new ReminderListRequest("업무", "#007AFF", "briefcase"));

        service.delete(created.id());

        assertThat(service.findAll()).isEmpty();
    }

    @Test
    @DisplayName("reorder로 리스트 순서를 변경한다")
    void reorder_updates_displayOrder() {
        ReminderListResponse first = service.create(new ReminderListRequest("업무", "#007AFF", "briefcase"));
        ReminderListResponse second = service.create(new ReminderListRequest("개인", "#FF3B30", "person"));
        ReminderListResponse third = service.create(new ReminderListRequest("쇼핑", "#34C759", "cart"));

        service.reorder(new ReorderRequest(List.of(third.id(), first.id(), second.id())));

        List<ReminderListResponse> result = service.findAll();
        assertThat(result.get(0).name()).isEqualTo("쇼핑");
        assertThat(result.get(1).name()).isEqualTo("업무");
        assertThat(result.get(2).name()).isEqualTo("개인");
    }
}
