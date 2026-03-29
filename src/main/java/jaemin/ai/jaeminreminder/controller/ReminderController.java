package jaemin.ai.jaeminreminder.controller;

import jaemin.ai.jaeminreminder.dto.ReminderRequest;
import jaemin.ai.jaeminreminder.dto.ReminderResponse;
import jaemin.ai.jaeminreminder.dto.ReorderRequest;
import jaemin.ai.jaeminreminder.service.ports.inp.ReminderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping("/api/lists/{listId}/reminders")
    public ResponseEntity<List<ReminderResponse>> findByListId(@PathVariable Long listId) {
        return ResponseEntity.ok(reminderService.findByListId(listId));
    }

    @PostMapping("/api/lists/{listId}/reminders")
    public ResponseEntity<ReminderResponse> create(@PathVariable Long listId,
                                                   @Valid @RequestBody ReminderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reminderService.create(listId, request));
    }

    @PutMapping("/api/reminders/{id}")
    public ResponseEntity<ReminderResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody ReminderRequest request) {
        return ResponseEntity.ok(reminderService.update(id, request));
    }

    @DeleteMapping("/api/reminders/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reminderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/api/reminders/{id}/complete")
    public ResponseEntity<ReminderResponse> toggleComplete(@PathVariable Long id) {
        return ResponseEntity.ok(reminderService.toggleComplete(id));
    }

    @PatchMapping("/api/reminders/{id}/flag")
    public ResponseEntity<ReminderResponse> toggleFlag(@PathVariable Long id) {
        return ResponseEntity.ok(reminderService.toggleFlag(id));
    }

    @PatchMapping("/api/reminders/reorder")
    public ResponseEntity<Void> reorder(@Valid @RequestBody ReorderRequest request) {
        reminderService.reorder(request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/reminders/today")
    public ResponseEntity<List<ReminderResponse>> findToday() {
        return ResponseEntity.ok(reminderService.findToday());
    }

    @GetMapping("/api/reminders/scheduled")
    public ResponseEntity<List<ReminderResponse>> findScheduled() {
        return ResponseEntity.ok(reminderService.findScheduled());
    }

    @GetMapping("/api/reminders/all")
    public ResponseEntity<List<ReminderResponse>> findAll() {
        return ResponseEntity.ok(reminderService.findAll());
    }

    @GetMapping("/api/reminders/completed")
    public ResponseEntity<List<ReminderResponse>> findCompleted() {
        return ResponseEntity.ok(reminderService.findCompleted());
    }

    @GetMapping("/api/reminders/flagged")
    public ResponseEntity<List<ReminderResponse>> findFlagged() {
        return ResponseEntity.ok(reminderService.findFlagged());
    }

    @GetMapping("/api/reminders/search")
    public ResponseEntity<List<ReminderResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(reminderService.search(q));
    }
}
