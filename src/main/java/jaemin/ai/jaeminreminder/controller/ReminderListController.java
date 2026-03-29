package jaemin.ai.jaeminreminder.controller;

import jaemin.ai.jaeminreminder.dto.ReminderListRequest;
import jaemin.ai.jaeminreminder.dto.ReminderListResponse;
import jaemin.ai.jaeminreminder.dto.ReorderRequest;
import jaemin.ai.jaeminreminder.service.ports.inp.ReminderListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class ReminderListController {

    private final ReminderListService reminderListService;

    @GetMapping
    public ResponseEntity<List<ReminderListResponse>> findAll() {
        return ResponseEntity.ok(reminderListService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReminderListResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(reminderListService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ReminderListResponse> create(@Valid @RequestBody ReminderListRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reminderListService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReminderListResponse> update(@PathVariable Long id,
                                                       @Valid @RequestBody ReminderListRequest request) {
        return ResponseEntity.ok(reminderListService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reminderListService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/reorder")
    public ResponseEntity<Void> reorder(@Valid @RequestBody ReorderRequest request) {
        reminderListService.reorder(request);
        return ResponseEntity.noContent().build();
    }
}
