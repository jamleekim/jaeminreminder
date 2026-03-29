package jaemin.ai.jaeminreminder.config;

import jaemin.ai.jaeminreminder.domain.Priority;
import jaemin.ai.jaeminreminder.domain.Reminder;
import jaemin.ai.jaeminreminder.domain.ReminderList;
import jaemin.ai.jaeminreminder.repository.ReminderListRepository;
import jaemin.ai.jaeminreminder.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
@Profile("!test")
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final ReminderListRepository listRepository;
    private final ReminderRepository reminderRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (listRepository.count() > 0) return;

        ReminderList personal = listRepository.save(ReminderList.builder()
                .name("개인").color("#007AFF").icon("heart").displayOrder(0).build());
        ReminderList work = listRepository.save(ReminderList.builder()
                .name("업무").color("#FF3B30").icon("briefcase").displayOrder(1).build());
        ReminderList shopping = listRepository.save(ReminderList.builder()
                .name("쇼핑").color("#34C759").icon("cart").displayOrder(2).build());

        reminderRepository.save(Reminder.builder()
                .title("운동하기").notes("30분 조깅").dueDate(LocalDate.now()).dueTime(LocalTime.of(7, 0))
                .priority(Priority.HIGH).flagged(true).displayOrder(0).list(personal).build());
        reminderRepository.save(Reminder.builder()
                .title("책 읽기").notes("클린 코드 3장").dueDate(LocalDate.now().plusDays(1))
                .priority(Priority.MEDIUM).displayOrder(1).list(personal).build());
        reminderRepository.save(Reminder.builder()
                .title("병원 예약").dueDate(LocalDate.now().plusDays(3))
                .priority(Priority.LOW).displayOrder(2).list(personal).build());

        reminderRepository.save(Reminder.builder()
                .title("프로젝트 보고서 작성").notes("금요일까지").dueDate(LocalDate.now())
                .priority(Priority.HIGH).flagged(true).displayOrder(0).list(work).build());
        reminderRepository.save(Reminder.builder()
                .title("팀 미팅 준비").dueDate(LocalDate.now()).dueTime(LocalTime.of(14, 0))
                .priority(Priority.MEDIUM).displayOrder(1).list(work).build());
        reminderRepository.save(Reminder.builder()
                .title("이메일 정리").priority(Priority.NONE).displayOrder(2).list(work).build());

        reminderRepository.save(Reminder.builder()
                .title("우유").displayOrder(0).list(shopping).build());
        reminderRepository.save(Reminder.builder()
                .title("계란").displayOrder(1).list(shopping).build());
        reminderRepository.save(Reminder.builder()
                .title("식빵").displayOrder(2).list(shopping).build());
    }
}
