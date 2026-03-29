# Fix: 코드 리뷰 발견 사항

> 코드 리뷰에서 발견된 문제를 우선순위별로 정리한다. 완료 시 `[x]`로 변경.

---

## 높음 (버그)

### Backend

- [x] `DefaultReminderListService:38` — displayOrder 중복: `repository.count()` 대신 최대 displayOrder 조회 후 +1
- [x] `DefaultReminderService:44` — displayOrder 계산 오류: `countByListIdAndCompletedFalse` 대신 리스트 내 전체 리마인더 기준으로 계산
- [x] `DefaultReminderListService:58` — 리스트 삭제 시 소속 리마인더 cascade 삭제 미처리 (FK 제약 위반 가능)

### Frontend

- [x] `page.tsx:84-98` — 검색 시 경쟁 조건: 빠른 타이핑 시 이전 응답이 최신 덮어씀 (AbortController 또는 요청 ID 비교 필요)
- [x] `DetailPanel.tsx` — listId 변경 시 save() 의존성에 누락 → API 호출 안 됨
- [x] `ReminderListView.tsx:37-38` — DnD handleDragEnd에서 findIndex가 -1 반환 시 미처리
- [x] `InlineAdd.tsx:58` — onBlur 시 항상 제출 → 취소(Escape) 의도 무시됨

---

## 중간 (안정성 / 정확성)

### Backend

- [x] `DefaultReminderService:92`, `DefaultReminderListService:65` — reorder() 존재하지 않는 ID 포함 시 부분 성공 문제 (사전 검증 필요)
- [x] `ReminderRepository:25` — 검색 쿼리 와일드카드(`%`, `_`) 이스케이핑 미흡
- [x] `ReminderResponse.from()` — N+1 쿼리: `entity.getList()` 호출로 리마인더 목록 조회 시 리스트마다 추가 쿼리 (`@EntityGraph` 또는 join fetch 필요)
- [x] `Reminder.java` — `@ManyToOne`에 cascade 삭제 미설정 (`@OnDelete(CASCADE)` 또는 서비스 레벨 처리)
- [x] `GlobalExceptionHandler` — `ConstraintViolationException`, `IllegalArgumentException` 등 누락된 예외 타입 처리
- [x] DTO 검증 부족 — `ReminderListRequest.color` HEX 형식, `ReminderRequest.notes` 최대 길이, `dueDate` 과거 날짜 허용 여부

### Frontend

- [x] `page.tsx` — 상태 13개 과다: Context API로 분리하여 Props Drilling 해소
- [x] `api.ts:5-10` — 에러 처리: 서버 에러 메시지 손실, 타입화된 ApiError 클래스 필요
- [x] `page.tsx:106` — `refresh()` 함수가 `Promise.all()` 미사용으로 3개 API 순차 호출
- [x] `ContextMenu.tsx:33` — 뷰포트 경계 벗어남 처리 없음 (화면 끝 근처에서 잘림)
- [x] `MyLists.tsx`, `ReminderListView.tsx` — DnD 로직 중복: 재사용 가능한 Hook 추출

---

## 낮음 (개선 / 품질)

### Backend

- [ ] `WebConfig.java:15` — `allowedHeaders("*")` 과도 개방 → `Content-Type` 등 명시적 제한
- [ ] 전반 — SLF4J 로깅 부재 (서비스, 컨트롤러)
- [ ] 전반 — 페이지네이션 미지원 (대량 데이터 시 성능 저하)
- [ ] `Reminder.java`, `ReminderList.java` — `@Getter` 전체 노출 대신 필요 필드만 공개 고려
- [ ] `ReorderRequest` — 중복 ID 검사 없음

### Frontend

- [ ] 접근성(a11y) — 버튼/입력에 `aria-label` 전반 부재 (ReminderRow, DetailPanel, SearchBar, ListModal)
- [ ] 접근성 — `ListModal`에 `role="dialog"`, `aria-modal="true"` 누락
- [ ] 접근성 — DnD 키보드 센서(`@dnd-kit/keyboard`) 미사용
- [ ] `SortableReminderRow.tsx` — 다크모드에서 드래그 그림자 색상 부적절
- [ ] `Toast.tsx` — 다중 토스트 미지원 (큐 또는 동시 표시)
- [ ] `constants.ts` vs `globals.css` — 색상 정의 이중 관리, 단일화 필요
- [ ] `SmartListCard.tsx:22` — CSS 변수 타입 강제 캐스트 (`as React.CSSProperties`)

---

## 아키텍처 / 공통

- [ ] openapi.yml 수동 관리 → Swagger 자동 생성 고려
- [ ] 동시성 제어 미흡 (낙관적 잠금 등)
- [ ] 테스트 — displayOrder 중복 시나리오, 리스트 삭제 후 리마인더 조회, reorder 잘못된 ID 등 엣지 케이스 보강
