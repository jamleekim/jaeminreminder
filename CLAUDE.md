# 코딩 관례

## 프로젝트 구조

## Backend

## 테스트

- **기능 추가/수정 시 검증 테스트를 반드시 함께 작성**
- domain 엔티티 테스트: JPA 없이 순수 단위 테스트 (Spring context, DB 의존 금지)

## Git

- 커밋 메시지: 한국어, 작업의 의도가 드러나도록 작성
- Co-Authored-By 라인 포함

## 작업 기록

- 매 요청 처리 후 `conversation-log.md`에 요청 내용과 수행 작업을 번호순으로 추가

## 참고 문서

- spec.md: 기능 명세
- plan.md: 개발 계획
- tasks.md: 구현 테스크 체크리스트