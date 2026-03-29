package jaemin.ai.jaeminreminder.controller;

import jaemin.ai.jaeminreminder.dto.ReminderListRequest;
import jaemin.ai.jaeminreminder.dto.ReminderListResponse;
import jaemin.ai.jaeminreminder.repository.ReminderListRepository;
import jaemin.ai.jaeminreminder.service.ports.inp.ReminderListService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ReminderListControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ReminderListService service;

    @Autowired
    private ReminderListRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    @DisplayName("GET /api/lists — 전체 리스트를 조회한다")
    void findAll() throws Exception {
        service.create(new ReminderListRequest("업무", "#007AFF", "briefcase"));
        service.create(new ReminderListRequest("개인", "#FF3B30", "person"));

        mockMvc.perform(get("/api/lists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("업무"))
                .andExpect(jsonPath("$[1].name").value("개인"));
    }

    @Test
    @DisplayName("GET /api/lists/{id} — 리스트를 단건 조회한다")
    void findById() throws Exception {
        ReminderListResponse created = service.create(new ReminderListRequest("업무", "#007AFF", "briefcase"));

        mockMvc.perform(get("/api/lists/{id}", created.id()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("업무"))
                .andExpect(jsonPath("$.color").value("#007AFF"));
    }

    @Test
    @DisplayName("GET /api/lists/{id} — 존재하지 않는 ID는 404를 반환한다")
    void findById_notFound() throws Exception {
        mockMvc.perform(get("/api/lists/{id}", 99))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @DisplayName("POST /api/lists — 리스트를 생성한다")
    void create() throws Exception {
        mockMvc.perform(post("/api/lists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name": "쇼핑", "color": "#34C759", "icon": "cart"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("쇼핑"))
                .andExpect(jsonPath("$.displayOrder").value(0));
    }

    @Test
    @DisplayName("POST /api/lists — name이 비어있으면 400을 반환한다")
    void create_validation() throws Exception {
        mockMvc.perform(post("/api/lists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name": "", "color": "#007AFF"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @DisplayName("PUT /api/lists/{id} — 리스트를 수정한다")
    void update() throws Exception {
        ReminderListResponse created = service.create(new ReminderListRequest("업무", "#007AFF", "briefcase"));

        mockMvc.perform(put("/api/lists/{id}", created.id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name": "개인", "color": "#FF3B30", "icon": "person"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("개인"))
                .andExpect(jsonPath("$.color").value("#FF3B30"));
    }

    @Test
    @DisplayName("DELETE /api/lists/{id} — 리스트를 삭제한다")
    void deleteList() throws Exception {
        ReminderListResponse created = service.create(new ReminderListRequest("업무", "#007AFF", "briefcase"));

        mockMvc.perform(delete("/api/lists/{id}", created.id()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/lists"))
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("PATCH /api/lists/reorder — 리스트 순서를 변경한다")
    void reorder() throws Exception {
        ReminderListResponse first = service.create(new ReminderListRequest("업무", "#007AFF", "briefcase"));
        ReminderListResponse second = service.create(new ReminderListRequest("개인", "#FF3B30", "person"));
        ReminderListResponse third = service.create(new ReminderListRequest("쇼핑", "#34C759", "cart"));

        mockMvc.perform(patch("/api/lists/reorder")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"ids": [%d, %d, %d]}
                                """.formatted(third.id(), first.id(), second.id())))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/lists"))
                .andExpect(jsonPath("$[0].name").value("쇼핑"))
                .andExpect(jsonPath("$[1].name").value("업무"))
                .andExpect(jsonPath("$[2].name").value("개인"));
    }
}
