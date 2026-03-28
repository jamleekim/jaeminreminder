# 개발 계획: Apple Reminders Web Clone

> 단순한 기능부터 점진적으로 완성도를 높여가는 방식으로 진행한다.
> 각 Phase 완료 시 동작하는 상태를 유지한다 (항상 실행 가능한 앱).

---

## 기술 스택 상세

### Backend

| 항목 | 기술 | 비고 |
|------|------|------|
| Framework | Spring Boot 4.0.3 | WebMVC (REST API) |
| Language | Java 25 | |
| ORM | Spring Data JPA | JpaRepository 기반 |
| Database | H2 (인메모리) | 개발 편의, H2 Console 활성화 |
| DTO 매핑 | Record 기반 DTO | Java Record로 간결하게 |
| Validation | Jakarta Validation | `@NotBlank`, `@NotNull` 등 |
| Lombok | Lombok | Entity boilerplate 제거 |
| Build | Gradle (Kotlin DSL) | 기존 설정 유지 |
| Port | `8080` | |

### Frontend

| 항목 | 기술 | 비고 |
|------|------|------|
| Framework | Next.js 15 (App Router) | `create-next-app` 최신 |
| Language | TypeScript | strict 모드 |
| Styling | Tailwind CSS 4 | Apple 디자인 재현 |
| HTTP Client | fetch (내장) | Next.js rewrites로 `/api` 프록시 |
| State 관리 | React state + Context | 외부 라이브러리 없이 시작 |
| Drag & Drop | @dnd-kit | 리마인더/리스트 정렬 |
| Icons | Lucide React | 경량 아이콘 라이브러리 |
| Port | `3000` | |

### 프로젝트 구조

```
reminder/
├── src/main/java/jaemin/ai/jaeminreminder/
│   ├── entity/          # JPA Entity
│   ├── repository/      # Spring Data Repository
│   ├── service/         # 비즈니스 로직
│   ├── controller/      # REST Controller
│   └── dto/             # Request/Response DTO
├── src/main/resources/
│   └── application.properties
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js App Router (pages, layout)
│   │   ├── components/  # UI 컴포넌트
│   │   ├── lib/         # API client, 유틸
│   │   └── types/       # TypeScript 타입 정의
│   ├── package.json
│   └── tailwind.config.ts
├── spec.md
├── plan.md
└── build.gradle.kts
```

---

## Phase 1 — Backend API (기본 CRUD)

> 목표: 리스트와 리마인더의 기본 CRUD API를 완성한다.

### 1.1 프로젝트 설정

- [ ] `application.properties` 설정 (H2 콘솔, JPA DDL auto, JSON 날짜 포맷)
- [ ] CORS 설정 (`http://localhost:3000` 허용)

### 1.2 Entity

- [ ] `ReminderList` Entity — id, name, color, icon, displayOrder, createdAt, updatedAt
- [ ] `Reminder` Entity — id, title, notes, dueDate, dueTime, priority(Enum), flagged, completed, completedAt, displayOrder, list(ManyToOne), createdAt, updatedAt
- [ ] `Priority` Enum — NONE, LOW, MEDIUM, HIGH
- [ ] `@PrePersist` / `@PreUpdate`로 createdAt, updatedAt 자동 설정

### 1.3 Repository

- [ ] `ReminderListRepository` — findAllByOrderByDisplayOrderAsc
- [ ] `ReminderRepository` — findByListIdOrderByDisplayOrderAsc, 스마트 리스트 쿼리 메서드들

### 1.4 Service

- [ ] `ReminderListService` — CRUD + reorder
- [ ] `ReminderService` — CRUD + complete 토글 + flag 토글 + reorder

### 1.5 Controller & DTO

- [ ] `ReminderListController` — GET/POST/PUT/DELETE `/api/lists`, PATCH `/api/lists/reorder`
- [ ] `ReminderController` — GET/POST/PUT/DELETE `/api/reminders`, PATCH complete/flag/reorder
- [ ] 스마트 리스트 엔드포인트: `/api/reminders/today`, `/scheduled`, `/all`, `/completed`, `/flagged`
- [ ] 검색: GET `/api/reminders/search?q=`
- [ ] Request/Response DTO (Java Record)

### 1.6 검증

- [ ] H2 Console로 데이터 확인
- [ ] curl 또는 HTTP client로 API 동작 테스트

---

## Phase 2 — Frontend 셋업 + 사이드바 + 리스트 조회

> 목표: Next.js 프로젝트를 구성하고, 사이드바와 리스트 선택까지 동작하게 한다.

### 2.1 Next.js 프로젝트 초기화

- [ ] `create-next-app` — TypeScript, Tailwind CSS, App Router, src 디렉토리
- [ ] `next.config.ts`에 API 프록시 rewrites 설정 (`/api/**` → `http://localhost:8080/api/**`)
- [ ] 글로벌 스타일: Apple 폰트 스택, 기본 색상 변수 (CSS custom properties)
- [ ] TypeScript 타입 정의 (`ReminderList`, `Reminder`, `Priority`)

### 2.2 레이아웃 뼈대

- [ ] Root Layout — 사이드바 (280px 고정) + 컨텐츠 영역
- [ ] 사이드바 컴포넌트 — 스크롤 독립, 하단 고정 버튼 영역

### 2.3 사이드바 — 스마트 리스트 카드

- [ ] 2x2 + 1 카드 그리드 구현
- [ ] 각 카드에 아이콘 + 카운트 + 라벨 표시
- [ ] 카드 색상 적용 (spec 5.2 참조)
- [ ] 카드 클릭 시 해당 스마트 리스트 선택 상태

### 2.4 사이드바 — 내 리스트

- [ ] API에서 리스트 목록 fetch (`GET /api/lists`)
- [ ] 리스트 행: 색상 원형 아이콘 + 이름 + 카운트
- [ ] 선택된 리스트 하이라이트

### 2.5 리마인더 목록 (읽기 전용)

- [ ] 선택된 리스트의 리마인더 fetch & 렌더링
- [ ] 리마인더 행: 체크 원 + 제목 + 부가 정보 + 깃발 아이콘
- [ ] 리스트 헤더 (리스트 이름, 색상 적용)
- [ ] 빈 상태 UI

---

## Phase 3 — 리마인더 CRUD + 디테일 패널

> 목표: 리마인더를 생성, 수정, 삭제, 완료/깃발 토글할 수 있다.

### 3.1 인라인 리마인더 추가

- [ ] 목록 하단 `+ 새로운 리마인더` 버튼
- [ ] 클릭 시 인라인 입력 행 표시 (체크 원 + 텍스트 input)
- [ ] Enter로 저장 (POST API), Escape로 취소

### 3.2 완료 / 깃발 토글

- [ ] 체크 원 클릭 → 완료 토글 (PATCH API)
- [ ] 완료 시 취소선 + 회색 처리
- [ ] 깃발 아이콘 클릭 → 깃발 토글 (PATCH API)

### 3.3 디테일 패널

- [ ] 리마인더 클릭 시 우측 디테일 패널 열기
- [ ] 제목 / 메모 편집 (자유 입력)
- [ ] 마감일 / 마감 시간 설정 (토글 + date/time input)
- [ ] 우선순위 선택 (없음 / ! / !! / !!!)
- [ ] 깃발 토글
- [ ] 소속 리스트 변경 (드롭다운)
- [ ] 삭제 버튼 (빨간색)
- [ ] 자동 저장 (debounce 500ms)

### 3.4 리마인더 삭제

- [ ] 디테일 패널 삭제 버튼 → DELETE API
- [ ] 삭제 후 디테일 패널 닫기, 목록에서 제거

---

## Phase 4 — 리스트 CRUD + 스마트 리스트

> 목표: 사용자가 리스트를 만들고 관리할 수 있고, 스마트 리스트가 동작한다.

### 4.1 리스트 생성 모달

- [ ] `+ 리스트 추가` 클릭 → 중앙 모달
- [ ] 리스트 이름 입력
- [ ] 12색 프리셋 색상 선택 (spec 5.10 팔레트)
- [ ] 아이콘 선택 그리드
- [ ] 상단 원형 미리보기 (선택한 색상 + 아이콘)
- [ ] 완료 → POST API로 생성

### 4.2 리스트 편집 / 삭제

- [ ] 리스트 우클릭 컨텍스트 메뉴 (이름 변경, 색상 변경, 삭제)
- [ ] 편집 시 생성 모달 재활용 (PUT API)
- [ ] 삭제 확인 다이얼로그 → DELETE API

### 4.3 스마트 리스트 동작

- [ ] 오늘: `GET /api/reminders/today`
- [ ] 예정: `GET /api/reminders/scheduled`
- [ ] 전체: `GET /api/reminders/all`
- [ ] 완료됨: `GET /api/reminders/completed`
- [ ] 깃발 표시: `GET /api/reminders/flagged`
- [ ] 스마트 리스트 카드의 카운트 실시간 반영
- [ ] 스마트 리스트 뷰에서 리마인더 소속 리스트 표시 (리스트 이름 + 색상 태그)

### 4.4 검색

- [ ] 사이드바 상단 검색 바 구현
- [ ] 입력 시 debounce 300ms → `GET /api/reminders/search?q=`
- [ ] 검색 결과를 리스트별로 그룹핑하여 표시
- [ ] 매칭 텍스트 하이라이트

---

## Phase 5 — 드래그 앤 드롭 + 정렬

> 목표: 리마인더와 리스트의 순서를 드래그로 변경할 수 있다.

### 5.1 리마인더 정렬

- [ ] `@dnd-kit` 설치 및 설정
- [ ] 리마인더 목록 내 드래그 앤 드롭 정렬
- [ ] 드롭 시 `PATCH /api/reminders/reorder` 호출
- [ ] 드래그 중 그림자 + 기울어짐 효과

### 5.2 리스트 정렬

- [ ] 사이드바 내 리스트 드래그 앤 드롭
- [ ] 드롭 시 `PATCH /api/lists/reorder` 호출

---

## Phase 6 — 다크모드 + 애니메이션 + 마무리

> 목표: Apple Reminders 수준의 비주얼 완성도를 달성한다.

### 6.1 다크모드

- [ ] `prefers-color-scheme: dark` 미디어 쿼리 적용
- [ ] Tailwind `dark:` variant로 모든 컴포넌트 대응
- [ ] 배경, 텍스트, 구분선, 카드 색상 (spec 5.12 참조)
- [ ] 프리셋 색상 Dark 값 전환

### 6.2 애니메이션

- [ ] 완료 애니메이션: 원 채움 → 체크마크 → 페이드아웃 + 슬라이드업
- [ ] 삭제 애니메이션: 좌로 슬라이드아웃 + 페이드
- [ ] 디테일 패널 슬라이드-인/아웃 (200ms ease)
- [ ] 리스트 전환 크로스페이드 (150ms)
- [ ] 모달 페이드 + 스케일 (0.95 → 1.0)
- [ ] 사이드바 카드 hover brightness 효과

### 6.3 반응형 대응

- [ ] 태블릿 (< 1024px): 사이드바 오버레이 + 토글 버튼
- [ ] 모바일 (< 768px): 사이드바 → 목록 → 디테일 단계별 네비게이션
- [ ] 터치 영역 최소 44px 보장

### 6.4 마무리

- [ ] 컨텍스트 메뉴 (리마인더 행 우클릭)
- [ ] 키보드 단축키 (Enter로 추가, Delete로 삭제, Escape로 패널 닫기)
- [ ] 에러 처리 (API 실패 시 토스트 알림)
- [ ] 로딩 상태 (스켈레톤 UI)
- [ ] 초기 데이터 시딩 (앱 첫 실행 시 샘플 리스트/리마인더 생성)
