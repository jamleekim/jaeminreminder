package jaemin.ai.jaeminreminder.service;

import jaemin.ai.jaeminreminder.domain.Priority;
import jaemin.ai.jaeminreminder.dto.*;
import jaemin.ai.jaeminreminder.repository.ReminderListRepository;
import jaemin.ai.jaeminreminder.repository.ReminderRepository;
import jaemin.ai.jaeminreminder.service.ports.inp.ReminderListService;
import jaemin.ai.jaeminreminder.service.ports.inp.ReminderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.NoSuchElementException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class ReminderServiceTest {

    @Autowired
    private ReminderService service;

    @Autowired
    private ReminderListService listService;

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private ReminderListRepository listRepository;

    private Long listId;

    @BeforeEach
    void setUp() {
        reminderRepository.deleteAll();
        listRepository.deleteAll();
        listId = listService.create(new ReminderListRequest("업무", "#007AFF", "briefcase")).id();
    }

    @Test
    @DisplayName("리스트별 리마인더를 조회한다")
    void findByListId_returns_reminders() {
        service.create(listId, new ReminderRequest("장보기", null, null, null, null, null, null));
        service.create(listId, new ReminderRequest("회의 준비", null, null, null, null, null, null));

        List<ReminderResponse> result = service.findByListId(listId);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).title()).isEqualTo("장보기");
        assertThat(result.get(1).title()).isEqualTo("회의 준비");
    }

    @Test
    @DisplayName("리마인더를 생성하면 기본값이 설정된다")
    void create_sets_defaults() {
        ReminderResponse result = service.create(listId,
                new ReminderRequest("장보기", "우유, 계란", null, null, null, null, null));

        assertThat(result.id()).isNotNull();
        assertThat(result.title()).isEqualTo("장보기");
        assertThat(result.notes()).isEqualTo("우유, 계란");
        assertThat(result.priority()).isEqualTo(Priority.NONE);
        assertThat(result.flagged()).isFalse();
        assertThat(result.completed()).isFalse();
        assertThat(result.displayOrder()).isEqualTo(0);
    }

    @Test
    @DisplayName("리마인더를 수정한다")
    void update_changes_fields() {
        ReminderResponse created = service.create(listId,
                new ReminderRequest("장보기", null, null, null, null, null, null));

        ReminderResponse result = service.update(created.id(),
                new ReminderRequest("회의 준비", "발표 자료", LocalDate.of(2026, 4, 1), LocalTime.of(14, 0), Priority.HIGH, true, null));

        assertThat(result.title()).isEqualTo("회의 준비");
        assertThat(result.notes()).isEqualTo("발표 자료");
        assertThat(result.dueDate()).isEqualTo(LocalDate.of(2026, 4, 1));
        assertThat(result.dueTime()).isEqualTo(LocalTime.of(14, 0));
        assertThat(result.priority()).isEqualTo(Priority.HIGH);
        assertThat(result.flagged()).isTrue();
    }

    @Test
    @DisplayName("리마인더를 삭제한다")
    void delete_removes_reminder() {
        ReminderResponse created = service.create(listId,
                new ReminderRequest("장보기", null, null, null, null, null, null));

        service.delete(created.id());

        assertThat(service.findByListId(listId)).isEmpty();
    }

    @Test
    @DisplayName("리마인더 수정 시 listId를 지정하면 리스트를 이동한다")
    void update_moves_to_different_list() {
        Long otherListId = listService.create(new ReminderListRequest("개인", "#FF3B30", "person")).id();
        ReminderResponse created = service.create(listId,
                new ReminderRequest("할일", null, null, null, null, null, null));

        ReminderResponse result = service.update(created.id(),
                new ReminderRequest("할일", null, null, null, null, null, otherListId));

        assertThat(result.listId()).isEqualTo(otherListId);
        assertThat(service.findByListId(listId)).isEmpty();
        assertThat(service.findByListId(otherListId)).hasSize(1);
    }

    @Test
    @DisplayName("존재하지 않는 ID로 조회하면 예외가 발생한다")
    void findById_throws_when_not_found() {
        assertThatThrownBy(() -> service.findById(99L))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    @DisplayName("완료 토글 시 completed와 completedAt이 변경된다")
    void toggleComplete_toggles_state() {
        ReminderResponse created = service.create(listId,
                new ReminderRequest("장보기", null, null, null, null, null, null));

        ReminderResponse completed = service.toggleComplete(created.id());
        assertThat(completed.completed()).isTrue();
        assertThat(completed.completedAt()).isNotNull();

        ReminderResponse uncompleted = service.toggleComplete(created.id());
        assertThat(uncompleted.completed()).isFalse();
        assertThat(uncompleted.completedAt()).isNull();
    }

    @Test
    @DisplayName("깃발 토글 시 flagged가 변경된다")
    void toggleFlag_toggles_state() {
        ReminderResponse created = service.create(listId,
                new ReminderRequest("장보기", null, null, null, null, null, null));

        ReminderResponse flagged = service.toggleFlag(created.id());
        assertThat(flagged.flagged()).isTrue();

        ReminderResponse unflagged = service.toggleFlag(created.id());
        assertThat(unflagged.flagged()).isFalse();
    }

    @Test
    @DisplayName("완료 처리 후 새 리마인더를 생성해도 displayOrder가 중복되지 않는다")
    void create_after_complete_no_duplicate_displayOrder() {
        ReminderResponse r1 = service.create(listId, new ReminderRequest("첫번째", null, null, null, null, null, null));
        service.create(listId, new ReminderRequest("두번째", null, null, null, null, null, null));

        service.toggleComplete(r1.id());

        ReminderResponse r3 = service.create(listId, new ReminderRequest("세번째", null, null, null, null, null, null));

        // 전체 리마인더(완료 포함) 중 displayOrder 중복이 없어야 함
        List<ReminderResponse> all = service.findByListId(listId);
        long distinctOrders = all.stream().map(ReminderResponse::displayOrder).distinct().count();
        assertThat(distinctOrders).isEqualTo(all.size());
    }

    @Test
    @DisplayName("reorder로 리마인더 순서를 변경한다")
    void reorder_updates_displayOrder() {
        ReminderResponse first = service.create(listId, new ReminderRequest("첫번째", null, null, null, null, null, null));
        ReminderResponse second = service.create(listId, new ReminderRequest("두번째", null, null, null, null, null, null));
        ReminderResponse third = service.create(listId, new ReminderRequest("세번째", null, null, null, null, null, null));

        service.reorder(new ReorderRequest(List.of(third.id(), first.id(), second.id())));

        List<ReminderResponse> result = service.findByListId(listId);
        assertThat(result.get(0).title()).isEqualTo("세번째");
        assertThat(result.get(1).title()).isEqualTo("첫번째");
        assertThat(result.get(2).title()).isEqualTo("두번째");
    }

    @Test
    @DisplayName("오늘 마감 리마인더를 조회한다")
    void findToday_returns_today_reminders() {
        service.create(listId, new ReminderRequest("오늘 할일", null, LocalDate.now(), null, null, null, null));
        service.create(listId, new ReminderRequest("내일 할일", null, LocalDate.now().plusDays(1), null, null, null, null));
        service.create(listId, new ReminderRequest("날짜 없음", null, null, null, null, null, null));

        List<ReminderResponse> result = service.findToday();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("오늘 할일");
    }

    @Test
    @DisplayName("예정된 리마인더를 조회한다")
    void findScheduled_returns_scheduled_reminders() {
        service.create(listId, new ReminderRequest("예정1", null, LocalDate.now(), null, null, null, null));
        service.create(listId, new ReminderRequest("예정2", null, LocalDate.now().plusDays(3), null, null, null, null));
        service.create(listId, new ReminderRequest("날짜 없음", null, null, null, null, null, null));

        List<ReminderResponse> result = service.findScheduled();

        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("전체 미완료 리마인더를 조회한다")
    void findAll_returns_incomplete_reminders() {
        ReminderResponse r1 = service.create(listId, new ReminderRequest("할일1", null, null, null, null, null, null));
        service.create(listId, new ReminderRequest("할일2", null, null, null, null, null, null));
        service.toggleComplete(r1.id());

        List<ReminderResponse> result = service.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("할일2");
    }

    @Test
    @DisplayName("완료된 리마인더를 조회한다")
    void findCompleted_returns_completed_reminders() {
        ReminderResponse r1 = service.create(listId, new ReminderRequest("할일1", null, null, null, null, null, null));
        service.create(listId, new ReminderRequest("할일2", null, null, null, null, null, null));
        service.toggleComplete(r1.id());

        List<ReminderResponse> result = service.findCompleted();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("할일1");
    }

    @Test
    @DisplayName("깃발 표시된 리마인더를 조회한다")
    void findFlagged_returns_flagged_reminders() {
        ReminderResponse r1 = service.create(listId, new ReminderRequest("할일1", null, null, null, null, null, null));
        service.create(listId, new ReminderRequest("할일2", null, null, null, null, null, null));
        service.toggleFlag(r1.id());

        List<ReminderResponse> result = service.findFlagged();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("할일1");
    }

    @Test
    @DisplayName("제목과 메모로 리마인더를 검색한다")
    void search_finds_by_title_and_notes() {
        service.create(listId, new ReminderRequest("장보기", "우유 사기", null, null, null, null, null));
        service.create(listId, new ReminderRequest("회의 준비", "발표 자료", null, null, null, null, null));
        service.create(listId, new ReminderRequest("이메일", null, null, null, null, null, null));

        assertThat(service.search("장보기")).hasSize(1);
        assertThat(service.search("우유")).hasSize(1);
        assertThat(service.search("자료")).hasSize(1);
        assertThat(service.search("없는검색어")).isEmpty();
    }

    @Test
    @DisplayName("검색어에 와일드카드 문자가 포함되어도 리터럴로 검색한다")
    void search_escapes_wildcard_characters() {
        service.create(listId, new ReminderRequest("100% 완료", null, null, null, null, null, null));
        service.create(listId, new ReminderRequest("할일_중요", null, null, null, null, null, null));
        service.create(listId, new ReminderRequest("일반 할일", null, null, null, null, null, null));

        // '%'로 검색하면 '100% 완료'만 매칭되어야 함 (전체 매칭이 아님)
        assertThat(service.search("%")).hasSize(1);
        assertThat(service.search("_")).hasSize(1);
    }
}
