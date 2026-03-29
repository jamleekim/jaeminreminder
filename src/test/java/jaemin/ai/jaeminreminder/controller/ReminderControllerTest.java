package jaemin.ai.jaeminreminder.controller;

import jaemin.ai.jaeminreminder.dto.ReminderListRequest;
import jaemin.ai.jaeminreminder.dto.ReminderListResponse;
import jaemin.ai.jaeminreminder.dto.ReminderRequest;
import jaemin.ai.jaeminreminder.dto.ReminderResponse;
import jaemin.ai.jaeminreminder.repository.ReminderListRepository;
import jaemin.ai.jaeminreminder.repository.ReminderRepository;
import jaemin.ai.jaeminreminder.service.ports.inp.ReminderListService;
import jaemin.ai.jaeminreminder.service.ports.inp.ReminderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ReminderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ReminderService reminderService;

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
    @DisplayName("GET /api/lists/{listId}/reminders — 리스트별 리마인더를 조회한다")
    void findByListId() throws Exception {
        reminderService.create(listId, new ReminderRequest("장보기", null, null, null, null, null, null));
        reminderService.create(listId, new ReminderRequest("회의 준비", null, null, null, null, null, null));

        mockMvc.perform(get("/api/lists/{listId}/reminders", listId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title").value("장보기"));
    }

    @Test
    @DisplayName("POST /api/lists/{listId}/reminders — 리마인더를 생성한다")
    void create() throws Exception {
        mockMvc.perform(post("/api/lists/{listId}/reminders", listId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "장보기", "notes": "우유, 계란", "priority": "LOW"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("장보기"))
                .andExpect(jsonPath("$.notes").value("우유, 계란"))
                .andExpect(jsonPath("$.priority").value("LOW"))
                .andExpect(jsonPath("$.completed").value(false));
    }

    @Test
    @DisplayName("PUT /api/reminders/{id} — 리마인더를 수정한다")
    void update() throws Exception {
        ReminderResponse created = reminderService.create(listId,
                new ReminderRequest("장보기", null, null, null, null, null, null));

        mockMvc.perform(put("/api/reminders/{id}", created.id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "회의 준비", "notes": "발표 자료", "priority": "HIGH", "flagged": true}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("회의 준비"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.flagged").value(true));
    }

    @Test
    @DisplayName("DELETE /api/reminders/{id} — 리마인더를 삭제한다")
    void deleteReminder() throws Exception {
        ReminderResponse created = reminderService.create(listId,
                new ReminderRequest("장보기", null, null, null, null, null, null));

        mockMvc.perform(delete("/api/reminders/{id}", created.id()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/lists/{listId}/reminders", listId))
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("PATCH /api/reminders/{id}/complete — 완료를 토글한다")
    void toggleComplete() throws Exception {
        ReminderResponse created = reminderService.create(listId,
                new ReminderRequest("장보기", null, null, null, null, null, null));

        mockMvc.perform(patch("/api/reminders/{id}/complete", created.id()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true))
                .andExpect(jsonPath("$.completedAt").isNotEmpty());
    }

    @Test
    @DisplayName("PATCH /api/reminders/{id}/flag — 깃발을 토글한다")
    void toggleFlag() throws Exception {
        ReminderResponse created = reminderService.create(listId,
                new ReminderRequest("장보기", null, null, null, null, null, null));

        mockMvc.perform(patch("/api/reminders/{id}/flag", created.id()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flagged").value(true));
    }

    @Test
    @DisplayName("PATCH /api/reminders/reorder — 리마인더 순서를 변경한다")
    void reorder() throws Exception {
        ReminderResponse first = reminderService.create(listId, new ReminderRequest("첫번째", null, null, null, null, null, null));
        ReminderResponse second = reminderService.create(listId, new ReminderRequest("두번째", null, null, null, null, null, null));

        mockMvc.perform(patch("/api/reminders/reorder")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"ids": [%d, %d]}
                                """.formatted(second.id(), first.id())))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/lists/{listId}/reminders", listId))
                .andExpect(jsonPath("$[0].title").value("두번째"))
                .andExpect(jsonPath("$[1].title").value("첫번째"));
    }

    @Test
    @DisplayName("GET /api/reminders/today — 오늘 마감 리마인더를 조회한다")
    void findToday() throws Exception {
        reminderService.create(listId, new ReminderRequest("오늘", null, LocalDate.now(), null, null, null, null));
        reminderService.create(listId, new ReminderRequest("내일", null, LocalDate.now().plusDays(1), null, null, null, null));

        mockMvc.perform(get("/api/reminders/today"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("오늘"));
    }

    @Test
    @DisplayName("GET /api/reminders/scheduled — 예정된 리마인더를 조회한다")
    void findScheduled() throws Exception {
        reminderService.create(listId, new ReminderRequest("예정", null, LocalDate.now().plusDays(1), null, null, null, null));
        reminderService.create(listId, new ReminderRequest("날짜없음", null, null, null, null, null, null));

        mockMvc.perform(get("/api/reminders/scheduled"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    @DisplayName("GET /api/reminders/all — 전체 미완료 리마인더를 조회한다")
    void findAll() throws Exception {
        ReminderResponse r1 = reminderService.create(listId, new ReminderRequest("할일1", null, null, null, null, null, null));
        reminderService.create(listId, new ReminderRequest("할일2", null, null, null, null, null, null));
        reminderService.toggleComplete(r1.id());

        mockMvc.perform(get("/api/reminders/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("할일2"));
    }

    @Test
    @DisplayName("GET /api/reminders/completed — 완료된 리마인더를 조회한다")
    void findCompleted() throws Exception {
        ReminderResponse r1 = reminderService.create(listId, new ReminderRequest("할일1", null, null, null, null, null, null));
        reminderService.create(listId, new ReminderRequest("할일2", null, null, null, null, null, null));
        reminderService.toggleComplete(r1.id());

        mockMvc.perform(get("/api/reminders/completed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("할일1"));
    }

    @Test
    @DisplayName("GET /api/reminders/flagged — 깃발 표시 리마인더를 조회한다")
    void findFlagged() throws Exception {
        ReminderResponse r1 = reminderService.create(listId, new ReminderRequest("할일1", null, null, null, null, null, null));
        reminderService.create(listId, new ReminderRequest("할일2", null, null, null, null, null, null));
        reminderService.toggleFlag(r1.id());

        mockMvc.perform(get("/api/reminders/flagged"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("할일1"));
    }

    @Test
    @DisplayName("GET /api/reminders/search — 리마인더를 검색한다")
    void search() throws Exception {
        reminderService.create(listId, new ReminderRequest("장보기", "우유 사기", null, null, null, null, null));
        reminderService.create(listId, new ReminderRequest("회의 준비", null, null, null, null, null, null));

        mockMvc.perform(get("/api/reminders/search").param("q", "우유"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("장보기"));
    }
}
