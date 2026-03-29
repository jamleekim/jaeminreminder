package jaemin.ai.jaeminreminder.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ReminderTest {

    private final ReminderList list = ReminderList.builder()
            .name("업무")
            .color("#007AFF")
            .icon("briefcase")
            .displayOrder(0)
            .build();

    @Test
    @DisplayName("Builder로 Reminder를 생성하면 기본값이 올바르게 설정된다")
    void builder_creates_with_defaults() {
        Reminder reminder = Reminder.builder()
                .title("장보기")
                .displayOrder(0)
                .list(list)
                .build();

        assertThat(reminder.getTitle()).isEqualTo("장보기");
        assertThat(reminder.getPriority()).isEqualTo(Priority.NONE);
        assertThat(reminder.getFlagged()).isFalse();
        assertThat(reminder.getCompleted()).isFalse();
        assertThat(reminder.getCompletedAt()).isNull();
        assertThat(reminder.getCreatedAt()).isNotNull();
        assertThat(reminder.getCreatedAt()).isEqualTo(reminder.getUpdatedAt());
    }

    @Test
    @DisplayName("update()를 호출하면 필드가 변경되고 updatedAt이 갱신된다")
    void update_changes_fields() throws InterruptedException {
        Reminder reminder = createReminder();
        var initialUpdatedAt = reminder.getUpdatedAt();

        Thread.sleep(10);
        reminder.update("회의 준비", "발표 자료", null, null, Priority.HIGH, true);

        assertThat(reminder.getTitle()).isEqualTo("회의 준비");
        assertThat(reminder.getNotes()).isEqualTo("발표 자료");
        assertThat(reminder.getPriority()).isEqualTo(Priority.HIGH);
        assertThat(reminder.getFlagged()).isTrue();
        assertThat(reminder.getUpdatedAt()).isAfter(initialUpdatedAt);
    }

    @Test
    @DisplayName("toggleComplete()를 호출하면 완료 상태와 completedAt이 토글된다")
    void toggleComplete_toggles_state() {
        Reminder reminder = createReminder();

        reminder.toggleComplete();
        assertThat(reminder.getCompleted()).isTrue();
        assertThat(reminder.getCompletedAt()).isNotNull();

        reminder.toggleComplete();
        assertThat(reminder.getCompleted()).isFalse();
        assertThat(reminder.getCompletedAt()).isNull();
    }

    @Test
    @DisplayName("toggleFlag()를 호출하면 깃발 상태가 토글된다")
    void toggleFlag_toggles_state() {
        Reminder reminder = createReminder();

        reminder.toggleFlag();
        assertThat(reminder.getFlagged()).isTrue();

        reminder.toggleFlag();
        assertThat(reminder.getFlagged()).isFalse();
    }

    @Test
    @DisplayName("moveToList()를 호출하면 소속 리스트가 변경된다")
    void moveToList_changes_list() {
        Reminder reminder = createReminder();
        ReminderList newList = ReminderList.builder()
                .name("개인")
                .color("#FF3B30")
                .icon("person")
                .displayOrder(1)
                .build();

        reminder.moveToList(newList);

        assertThat(reminder.getList().getName()).isEqualTo("개인");
    }

    private Reminder createReminder() {
        return Reminder.builder()
                .title("장보기")
                .notes("우유, 계란")
                .priority(Priority.LOW)
                .displayOrder(0)
                .list(list)
                .build();
    }
}
