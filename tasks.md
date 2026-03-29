# Tasks: Apple Reminders Web Clone

> 체크박스로 진행 상황을 추적한다. 완료 시 `[x]`로 변경.

---

## Phase 1 — Backend API (기본 CRUD)

### 1.1 프로젝트 설정
- [x] `application.properties` — H2 콘솔 활성화, JPA DDL auto-create, JSON 날짜 포맷
- [x] `WebConfig` — CORS 설정 (`http://localhost:3000` 허용)

### 1.2 Entity & Enum
- [x] `Priority` Enum (NONE, LOW, MEDIUM, HIGH)
- [x] `ReminderList` Entity (id, name, color, icon, displayOrder, createdAt, updatedAt)
- [x] `Reminder` Entity (id, title, notes, dueDate, dueTime, priority, flagged, completed, completedAt, displayOrder, list, createdAt, updatedAt)
- [x] createdAt, updatedAt — 생성자/변경 메서드에서 직접 설정

### 1.3 Repository
- [x] `ReminderListRepository` — findAllByOrderByDisplayOrderAsc
- [x] `ReminderRepository` — findByListId, findByCompleted, findByFlagged, findByDueDate, findByDueDateIsNotNull, 검색 쿼리

### 1.4 DTO (Java Record)
- [x] `ReminderListRequest` / `ReminderListResponse`
- [x] `ReminderRequest` / `ReminderResponse`
- [x] `ReorderRequest` (id 리스트 순서)

### 1.5 Service
- [x] `ReminderListService` — 생성, 조회(전체), 수정, 삭제(cascade), 순서 변경
- [x] `ReminderService` — 생성, 리스트별 조회, 수정, 삭제, 완료 토글, 깃발 토글, 순서 변경
- [x] `ReminderService` — 스마트 리스트 조회 (today, scheduled, all, completed, flagged)
- [x] `ReminderService` — 검색 (title, notes LIKE)

### 1.6 Controller
- [x] `ReminderListController` — GET `/api/lists`
- [x] `ReminderListController` — POST `/api/lists`
- [x] `ReminderListController` — PUT `/api/lists/{id}`
- [x] `ReminderListController` — DELETE `/api/lists/{id}`
- [x] `ReminderListController` — PATCH `/api/lists/reorder`
- [x] `ReminderController` — GET `/api/lists/{listId}/reminders`
- [x] `ReminderController` — POST `/api/lists/{listId}/reminders`
- [x] `ReminderController` — PUT `/api/reminders/{id}`
- [x] `ReminderController` — DELETE `/api/reminders/{id}`
- [x] `ReminderController` — PATCH `/api/reminders/{id}/complete`
- [x] `ReminderController` — PATCH `/api/reminders/{id}/flag`
- [x] `ReminderController` — PATCH `/api/reminders/reorder`
- [x] `ReminderController` — GET `/api/reminders/today`
- [x] `ReminderController` — GET `/api/reminders/scheduled`
- [x] `ReminderController` — GET `/api/reminders/all`
- [x] `ReminderController` — GET `/api/reminders/completed`
- [x] `ReminderController` — GET `/api/reminders/flagged`
- [x] `ReminderController` — GET `/api/reminders/search?q=`

### 1.7 검증
- [x] Gradle 빌드 성공 확인
- [x] 앱 기동 후 H2 Console 접속 확인
- [x] 주요 API 엔드포인트 curl 테스트 (리스트 CRUD, 리마인더 CRUD)

---

## Phase 2 — Frontend 셋업 + 사이드바 + 리스트 조회

### 2.1 프로젝트 초기화
- [x] `create-next-app` 실행 (TypeScript, Tailwind CSS, App Router, src/)
- [x] `next.config.ts` — rewrites 설정 (`/api/**` → `localhost:8080`)
- [x] 글로벌 CSS — Apple 폰트 스택, CSS custom properties (색상 팔레트)
- [x] `lucide-react` 설치

### 2.2 TypeScript 타입
- [x] `types/index.ts` — ReminderList, Reminder, Priority 타입 정의

### 2.3 API Client
- [x] `lib/api.ts` — fetch 래퍼 (리스트 API, 리마인더 API, 스마트 리스트 API)

### 2.4 레이아웃
- [x] Root Layout — 사이드바 (280px) + 컨텐츠 영역 flex 구조
- [x] `Sidebar` 컴포넌트 — 스크롤 독립, 하단 고정 영역

### 2.5 스마트 리스트 카드
- [x] `SmartListCard` 컴포넌트 — 원형 아이콘 + 카운트 + 라벨
- [x] `SmartListGrid` 컴포넌트 — 2x2 + 1 그리드 배치
- [x] 카드 색상 (오늘=파란, 예정=빨간, 전체=보라, 깃발=주황, 완료=회색)
- [x] 카드 클릭 → 선택 상태 관리

### 2.6 내 리스트 섹션
- [x] `MyLists` 컴포넌트 — API fetch → 리스트 목록 렌더링
- [x] 리스트 행: 색상 원형 + 이름 + 카운트
- [x] 선택된 리스트 배경 하이라이트
- [x] `+ 리스트 추가` 버튼 (하단 고정, Phase 4에서 동작 연결)

### 2.7 리마인더 목록 (읽기 전용)
- [x] `ReminderList` 컴포넌트 — 선택된 리스트/스마트리스트의 리마인더 표시
- [x] `ReminderRow` 컴포넌트 — 체크 원 + 제목 + 부가정보 + 깃발
- [x] 리스트 헤더 (이름, 색상 텍스트)
- [x] 들여쓰기 구분선 (Apple 스타일)
- [x] `EmptyState` 컴포넌트 — 리마인더 없을 때 안내

---

## Phase 3 — 리마인더 CRUD + 디테일 패널

### 3.1 인라인 추가
- [x] `+ 새로운 리마인더` 버튼 (리스트 색상 텍스트)
- [x] 클릭 시 인라인 입력 행 (체크 원 + text input)
- [x] Enter → POST API로 생성, 목록에 추가
- [x] Escape → 입력 취소

### 3.2 완료 토글
- [x] 체크 원 클릭 → PATCH `/api/reminders/{id}/complete`
- [x] 완료 시: 원 채움 + 체크마크, 제목 취소선, 텍스트 회색

### 3.3 깃발 토글
- [x] 깃발 아이콘 클릭 → PATCH `/api/reminders/{id}/flag`
- [x] flagged 시 주황색 깃발 표시

### 3.4 디테일 패널
- [x] `DetailPanel` 컴포넌트 — 우측 슬라이드-인 패널
- [x] 제목 편집 (input)
- [x] 메모 편집 (textarea)
- [x] 마감일 토글 + date input
- [x] 마감 시간 토글 + time input
- [x] 우선순위 선택 (없음 / ! / !! / !!!)
- [x] 깃발 토글 스위치
- [x] 소속 리스트 변경 (드롭다운)
- [x] 자동 저장 (debounce 500ms → PUT API)

### 3.5 삭제
- [x] 디테일 패널 하단 빨간 삭제 버튼
- [x] DELETE API 호출 → 패널 닫기 + 목록에서 제거

---

## Phase 4 — 리스트 CRUD + 스마트 리스트 + 검색

### 4.1 리스트 생성 모달
- [x] `ListModal` 컴포넌트 — 중앙 모달
- [x] 리스트 이름 텍스트 입력
- [x] 12색 프리셋 색상 선택 팔레트
- [x] 아이콘 선택 그리드
- [x] 상단 원형 미리보기 (색상 + 아이콘)
- [x] 취소 / 완료 버튼 → POST API

### 4.2 리스트 편집
- [x] 리스트 행 우클릭 → 컨텍스트 메뉴 (편집, 삭제)
- [x] 편집 클릭 → `ListModal` 재활용 (기존 값 채움) → PUT API

### 4.3 리스트 삭제
- [x] 삭제 클릭 → 확인 다이얼로그 ("리마인더도 함께 삭제됩니다")
- [x] 확인 → DELETE API → 사이드바에서 제거

### 4.4 스마트 리스트 연동
- [x] 오늘 카드 클릭 → `/api/reminders/today` fetch & 표시
- [x] 예정 카드 → `/api/reminders/scheduled`
- [x] 전체 카드 → `/api/reminders/all`
- [x] 완료됨 카드 → `/api/reminders/completed`
- [x] 깃발 카드 → `/api/reminders/flagged`
- [x] 각 카드 카운트 실시간 갱신
- [x] 스마트 리스트 뷰에서 리마인더에 소속 리스트 태그 표시

### 4.5 검색
- [x] 사이드바 상단 검색 바 (돋보기 아이콘 + input)
- [x] debounce 300ms → GET `/api/reminders/search?q=`
- [x] 검색 결과 리스트별 그룹핑 표시
- [ ] 매칭 텍스트 하이라이트
- [x] 결과 없음 상태 UI

---

## Phase 5 — 드래그 앤 드롭

### 5.1 셋업
- [x] `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` 설치

### 5.2 리마인더 정렬
- [x] 리마인더 목록에 DndContext + SortableContext 적용
- [x] 각 리마인더 행을 useSortable로 래핑
- [x] 드래그 중 그림자 + 기울어짐 시각 효과
- [x] 드롭 시 PATCH `/api/reminders/reorder` 호출

### 5.3 리스트 정렬
- [x] 사이드바 내 리스트 목록에 DndContext 적용
- [x] 드롭 시 PATCH `/api/lists/reorder` 호출

---

## Phase 6 — 다크모드 + 애니메이션 + 마무리

### 6.1 다크모드
- [ ] Tailwind `darkMode: 'media'` 설정
- [ ] 사이드바 다크 배경 (`#000000`)
- [ ] 컨텐츠 다크 배경 (`#1C1C1E`)
- [ ] 카드/모달 다크 배경 (`#2C2C2E`)
- [ ] 텍스트/구분선 다크 색상 적용
- [ ] 프리셋 색상 Light/Dark 값 분기

### 6.2 애니메이션
- [ ] 완료: 원 채움 → 체크마크 → 0.5초 후 페이드아웃 + 슬라이드업
- [ ] 삭제: 좌로 슬라이드아웃 + 페이드
- [ ] 디테일 패널: 우측 슬라이드-인/아웃 (200ms ease)
- [ ] 리스트 전환: 크로스페이드 (150ms)
- [ ] 모달: 페이드 + 스케일 (0.95 → 1.0)
- [ ] 스마트 리스트 카드: hover brightness 1.05

### 6.3 반응형
- [ ] 태블릿 (< 1024px): 사이드바 오버레이 + 햄버거 토글
- [ ] 모바일 (< 768px): 사이드바 → 목록 → 디테일 단계별 내비게이션
- [ ] 모든 터치 타겟 최소 44px 보장

### 6.4 마무리
- [ ] 리마인더 행 우클릭 컨텍스트 메뉴 (완료, 깃발, 삭제, 리스트 이동)
- [ ] 키보드 단축키 (Enter=추가, Delete=삭제, Escape=패널 닫기)
- [ ] API 실패 시 토스트 에러 알림
- [ ] 로딩 상태 스켈레톤 UI
- [ ] 초기 데이터 시딩 (첫 실행 시 샘플 리스트/리마인더 자동 생성)
