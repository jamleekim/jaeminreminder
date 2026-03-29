package jaemin.ai.jaeminreminder.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ReminderListTest {

    @Test
    @DisplayName("Builder로 ReminderList를 생성하면 필드가 올바르게 설정된다")
    void builder_creates_with_correct_fields() {
        ReminderList list = ReminderList.builder()
                .name("업무")
                .color("#007AFF")
                .icon("briefcase")
                .displayOrder(0)
                .build();

        assertThat(list.getName()).isEqualTo("업무");
        assertThat(list.getColor()).isEqualTo("#007AFF");
        assertThat(list.getIcon()).isEqualTo("briefcase");
        assertThat(list.getDisplayOrder()).isEqualTo(0);
    }

    @Test
    @DisplayName("생성 시 createdAt, updatedAt이 자동 설정된다")
    void constructor_sets_timestamps() {
        ReminderList list = ReminderList.builder()
                .name("업무")
                .color("#007AFF")
                .icon("briefcase")
                .displayOrder(0)
                .build();

        assertThat(list.getCreatedAt()).isNotNull();
        assertThat(list.getUpdatedAt()).isNotNull();
        assertThat(list.getCreatedAt()).isEqualTo(list.getUpdatedAt());
    }

    @Test
    @DisplayName("update()를 호출하면 name, color, icon이 변경되고 updatedAt이 갱신된다")
    void update_changes_fields_and_refreshes_updatedAt() throws InterruptedException {
        ReminderList list = ReminderList.builder()
                .name("업무")
                .color("#007AFF")
                .icon("briefcase")
                .displayOrder(0)
                .build();

        var createdAt = list.getCreatedAt();
        var initialUpdatedAt = list.getUpdatedAt();

        Thread.sleep(10);
        list.update("개인", "#FF3B30", "person");

        assertThat(list.getName()).isEqualTo("개인");
        assertThat(list.getColor()).isEqualTo("#FF3B30");
        assertThat(list.getIcon()).isEqualTo("person");
        assertThat(list.getCreatedAt()).isEqualTo(createdAt);
        assertThat(list.getUpdatedAt()).isAfter(initialUpdatedAt);
    }

    @Test
    @DisplayName("updateDisplayOrder()를 호출하면 순서가 변경되고 updatedAt이 갱신된다")
    void updateDisplayOrder_changes_order_and_refreshes_updatedAt() throws InterruptedException {
        ReminderList list = ReminderList.builder()
                .name("업무")
                .color("#007AFF")
                .icon("briefcase")
                .displayOrder(0)
                .build();

        var initialUpdatedAt = list.getUpdatedAt();

        Thread.sleep(10);
        list.updateDisplayOrder(3);

        assertThat(list.getDisplayOrder()).isEqualTo(3);
        assertThat(list.getUpdatedAt()).isAfter(initialUpdatedAt);
    }
}
