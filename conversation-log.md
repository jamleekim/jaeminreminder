# Conversation Log

> 세션 중 사용자 요청과 수행된 작업을 기록한다.

---

### 1. `git init`

- 작업: `/Users/jaemim.kim/workspace/reminder/` 디렉토리에 Git 저장소 초기화

---

### 2. Apple Reminder App의 Web버전을 개발하고 싶어. Backend는 Spring Boot, JPA/H2 API 서비스로, Frontend는 NextJS Latest로 개발. 우선 PRD를 prd.md에 정리해줘.

- 작업: `prd.md` 생성
- 내용: 기술 스택, 핵심 기능(리스트/리마인더 CRUD, 스마트 리스트, 검색), 데이터 모델, API 설계, UI 구성, 프로젝트 구조, 개발 순서, 제약사항 정리

---

### 3. UI/UX는 Apple Reminder App과 최대한 유사하게

- 작업: `prd.md`의 UI/UX 섹션을 대폭 확장
- 내용: 3-column 레이아웃 상세화, 스마트 리스트 카드 그리드, 리마인더 행 구조, 디테일 패널, 리스트 생성 모달, 검색, 컨텍스트 메뉴, 빈 상태, 애니메이션 명세, Apple 12색 팔레트(Light/Dark), 타이포그래피, 다크모드 스펙 추가

---

### 4. prd.md를 spec.md로 변경해줘. spec.md의 내용을 단순한 것부터 점점 기능을 추가하는 방식으로 phase를 구분해서 plan.md에 개발 계획을 넣어줘. 기술에 대한 내용도 넣어줘.

- 작업: `prd.md` → `spec.md` 이름 변경 (제목도 수정), `plan.md` 신규 생성
- 내용: 기술 스택 상세 (Backend/Frontend 라이브러리, 프로젝트 구조), 6단계 Phase별 개발 계획 — Phase 1(Backend CRUD) → Phase 2(Frontend 셋업+사이드바) → Phase 3(리마인더 CRUD+디테일) → Phase 4(리스트 CRUD+스마트리스트+검색) → Phase 5(드래그앤드롭) → Phase 6(다크모드+애니메이션+마무리)

---

### 5. 지금 세션에서 질문하는 내 문장들을 모두 별도 파일로 만들어서 추가해줘. 각 질문에 대해 어떤 작업이 이루어졌는지 간략하게 정리해주고. 이 뒤에 너랑 대화할때도 동일하게 기록이 되도록 해줘.

- 작업: `conversation-log.md` 생성
- 내용: 세션 내 모든 사용자 요청과 수행 작업을 번호순으로 기록. 이후 대화도 동일 형식으로 계속 추가 예정
