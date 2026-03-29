# 코딩 관례

## 프로젝트 구조

```
src/main/java/jaemin/ai/jaeminreminder/
├── domain/             # JPA Entity (비즈니스 로직 포함)
├── repository/         # Spring Data Repository
├── service/
│   ├── ports/inp/      # Service 인터페이스
│   └── Default*.java   # Service 구현체 (Default 접두사)
├── controller/         # REST Controller
└── dto/                # Request/Response DTO (Java Record)
```

## Backend

### Entity (domain 패키지)

- Lombok: `@Getter`, `@NoArgsConstructor(access = AccessLevel.PROTECTED)`, `@Builder`
- Setter 사용 금지 — 의미 있는 메서드명으로 상태 변경
- `createdAt`, `updatedAt`은 생성자/변경 메서드에서 직접 설정 (`@PrePersist`/`@PreUpdate` 사용 금지)

### Service

- 인터페이스: `service/ports/inp/` 패키지에 `XxxService`
- 구현체: `service/` 패키지에 `DefaultXxxService`
- `@Transactional(readOnly = true)` 클래스 레벨, 변경 메서드에 `@Transactional`

### DTO

- Java Record 사용

## 테스트

- **기능 추가/수정 시 검증 테스트를 반드시 함께 작성**
- domain 엔티티 테스트: JPA 없이 순수 단위 테스트 (Spring context, DB 의존 금지)
- Service 테스트: `@SpringBootTest` + `@Transactional` 통합 테스트 (Mock 사용 금지)
- `@DisplayName` 한국어, AssertJ 사용

## Git

- 커밋 메시지: 한국어, 작업의 의도가 드러나도록 작성
- Co-Authored-By 라인 포함

## 작업 기록

- 매 요청 처리 후 `conversation-log.md`에 요청 내용과 수행 작업을 번호순으로 추가

## 참고 문서

- spec.md: 기능 명세
- plan.md: 개발 계획
- tasks.md: 구현 테스크 체크리스트