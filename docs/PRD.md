# QA 학습용 실습 플랫폼 PRD

## 1. 프로젝트 개요

### 1-1. 프로젝트명
QATrain (가칭)

### 1-2. 한 줄 설명
QA 준비생이 기획서를 기반으로 TC/CL을 작성하고, 테스트를 수행한 뒤, 실패 건에 대해 버그 리포트를 발급하는 QA 실습용 웹 플랫폼

### 1-3. 프로젝트 목적
QA 준비생은 이론은 공부해도 실제 QA 프로세스를 끝까지 경험할 기회가 적다.
이 서비스는 아래 흐름을 직접 경험하게 하는 것을 목표로 한다.

기획서 확인
→ TC / CL 작성
→ 테스트 수행
→ PASS / FAIL 기록
→ 버그 리포트 발급
→ QA 결과 정리

이 서비스는 정답 채점형 플랫폼이 아니라,
실무형 문서 작성 습관과 QA 프로세스 흐름을 익히는 학습 플랫폼이다.

---

## 2. 목표 / 비목표

### 2-1. 목표
- QA 준비생이 실제에 가까운 QA workflow를 경험할 수 있게 한다.
- 기획서 기반으로 TC / CL을 직접 작성할 수 있게 한다.
- 테스트 결과를 PASS / FAIL / BLOCKED로 기록할 수 있게 한다.
- FAIL 발생 시 버그 리포트를 발급하는 흐름을 익히게 한다.
- 하나의 프로젝트 안에서 QA 문서와 결과를 관리할 수 있게 한다.

### 2-2. 비목표
- Jira 대체 서비스가 되는 것
- 실무 협업용 대규모 권한 시스템 제공
- GitHub 연동
- LLM 기반 자동 TC 생성
- 스크린샷 업로드
- 실시간 채팅 / 알림
- 개인 프로젝트 관리 모드

---

## 3. 타깃 사용자

### 3-1. 핵심 타깃
- 게임 QA 준비생
- SQA 준비생
- QA 직무 전환 준비 중인 사용자
- QA 포트폴리오를 만들고 싶은 사용자

### 3-2. 사용자 문제
- QA 실무 흐름을 어떻게 연습해야 할지 모름
- TC / CL을 어떤 형식으로 써야 할지 막막함
- 버그 리포트를 실제처럼 작성해본 경험이 부족함
- 포트폴리오에 “QA를 실제로 해봤다”는 흐름을 보여주기 어려움

---

## 4. 서비스 핵심 가치

이 서비스는 TC의 정답을 맞히는 플랫폼이 아니다.
대신 아래를 학습하게 한다.

- 기획서를 읽고 테스트 포인트를 정리하는 능력
- TC / CL을 형식에 맞게 작성하는 습관
- 테스트 결과를 기록하는 방식
- FAIL 발생 시 버그를 발급하는 QA 흐름
- QA 결과를 프로젝트 단위로 정리하는 습관

---

## 5. MVP 범위

### 5-1. 포함 기능
1. 회원가입 / 로그인
2. 학습용 프로젝트 목록
3. 기획서 조회
4. TC / CL 작성
5. 테스트 실행 기록
6. 버그 리포트 발급
7. 버그 상태 관리
8. 프로젝트별 QA 결과 확인

### 5-2. 제외 기능
1. LLM 기능
2. 스크린샷 업로드
3. 외부 GitHub 연동
4. 개인 프로젝트 생성 모드
5. 팀 협업 권한 세분화
6. 알림 기능
7. 코멘트 / 멘션
8. 관리자 페이지 고도화

---

## 6. 서비스 구조

### 6-1. 서비스 모드
현재 버전은 학습 모드만 제공한다.

### 6-2. 학습 흐름
사용자는 예시 기획서가 포함된 학습 프로젝트를 선택한다.
선택한 프로젝트에서 아래 순서로 학습한다.

1. 기획서 확인
2. TC / CL 작성
3. 테스트 수행
4. 테스트 결과 저장
5. FAIL 건을 버그로 발급
6. 프로젝트별 QA 결과 확인

---

## 7. 핵심 화면 구성

### 7-1. 로그인 화면
목적:
- 사용자 인증

기능:
- 이메일 로그인
- 회원가입
- 로그아웃

---

### 7-2. 학습 프로젝트 목록 화면
목적:
- 사용자가 학습용 QA 프로젝트를 선택

구성:
- 프로젝트 카드 목록
- 프로젝트명
- 카테고리 (웹 / 앱 / 게임)
- 난이도
- 설명
- 시작하기 버튼

예시 프로젝트:
- 웹 로그인 기능 QA
- 쇼핑몰 장바구니 QA
- 모바일 회원가입 QA
- 게임 상점 구매 QA
- 인벤토리 정렬 QA

---

### 7-3. 프로젝트 상세 화면
목적:
- 선택한 프로젝트의 전체 QA 흐름 진입

탭 구성:
- 기획서
- TC / CL
- 테스트 실행
- 버그 리포트
- QA 결과

---

### 7-4. 기획서 탭
목적:
- QA 기준이 되는 요구사항 확인

구성:
- 기능명
- 기능 설명
- 요구사항
- 예외사항
- 버전 정보
- 참고 메모

예시:
- 로그인 기능
- 이메일 형식 검증 필요
- 비밀번호 8자 이상
- 오류 시 메시지 출력

---

### 7-5. TC / CL 탭
목적:
- 사용자 직접 QA 문서를 작성

#### TC 기본 필드
- TC ID
- 기능명
- 테스트 목적
- 사전 조건
- 테스트 단계
- 기대 결과
- 우선순위
- 비고

#### CL 기본 필드
- CL ID
- 카테고리
- 확인 항목
- 기대 기준
- 비고

정책:
- 정답 채점은 하지 않음
- 사용자가 형식에 맞게 자유 작성
- 저장 / 수정 / 삭제 가능

---

### 7-6. 테스트 실행 탭
목적:
- 작성한 TC를 기준으로 실제 테스트 결과 기록

구성:
- 관련 TC 선택
- 테스트 대상 기능명
- Actual Result 입력
- 결과 선택
  - PASS
  - FAIL
  - BLOCKED
- 실행자
- 실행일시
- 버전

동작:
- FAIL 선택 시 “버그 발급” 버튼 활성화

---

### 7-7. 버그 리포트 탭
목적:
- FAIL 건을 실제 이슈처럼 관리

#### 버그 리포트 템플릿
- Bug ID (자동 생성)
- 우선순위
- 담당자
- 상태
- 이슈 내용
- 재현 경로
- 이슈 현상
- 발생률
- 발생 버전
- 기대 결과
- 작성자
- 생성일시

#### 드롭다운 정의
우선순위:
- Low
- Medium
- High
- Critical

담당자:
- 기획
- 개발

상태:
- Open
- In Progress
- Fixed
- Retest
- Closed

발생률:
- 항상 발생
- 간헐적 발생
- 1회 발생

#### 버그 리포트 입력 예시
우선 순위: High
담당자: 개발
이슈 내용: 로그인 실패 시 오류 메시지가 출력되지 않음

재현 경로:
1. 로그인 페이지 진입
2. 이메일 입력
3. 잘못된 비밀번호 입력
4. 로그인 버튼 클릭

이슈 현상:
오류 메시지가 출력되지 않고 화면 변화가 없음

발생률:
항상 발생

발생 버전:
v1.0.0

기대 결과:
잘못된 비밀번호 입력 시 오류 메시지가 출력되어야 함

---

### 7-8. QA 결과 탭
목적:
- 프로젝트 전체 테스트 결과를 요약 확인

구성:
- 전체 TC 수
- PASS 수
- FAIL 수
- BLOCKED 수
- 생성된 버그 수
- 상태별 버그 수
- 최근 테스트 기록
- 최근 버그 기록

---

## 8. 사용자 흐름

### 8-1. 기본 학습 흐름
1. 회원가입 또는 로그인
2. 학습 프로젝트 선택
3. 기획서 탭에서 요구사항 확인
4. TC / CL 탭에서 문서 작성
5. 테스트 실행 탭에서 결과 기록
6. FAIL이면 버그 리포트 발급
7. QA 결과 탭에서 전체 상태 확인

### 8-2. FAIL → 버그 발급 흐름
1. 테스트 실행에서 FAIL 선택
2. 버그 발급 버튼 클릭
3. 관련 TC 정보 일부 자동 연결
4. 버그 리포트 템플릿 작성
5. 저장 후 버그 목록에 등록

---

## 9. 기술 스택

### 9-1. 프론트엔드
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

선정 이유:
- 화면 중심 SaaS MVP에 적합
- Vercel 배포 친화적
- 폼이 많은 서비스 구조에 유리
- 타입 안정성과 생산성을 동시에 확보 가능

### 9-2. 백엔드
- Next.js Route Handlers
- Supabase SDK

선정 이유:
- 별도 FastAPI 서버 없이도 MVP API 구현 가능
- 프론트와 백을 한 저장소에서 관리 가능
- 학습용 플랫폼 규모에서는 서버 분리보다 생산성이 중요

### 9-3. 데이터베이스
- Supabase Postgres

### 9-4. 인증
- Supabase Auth

### 9-5. 배포
- Vercel

---

## 10. 시스템 아키텍처

### 10-1. 구조
브라우저
→ Next.js 프론트엔드
→ Next.js Route Handlers
→ Supabase (Auth + Postgres)

### 10-2. 상세 설명
- 사용자는 Vercel에 배포된 Next.js 앱에 접속
- 프론트는 화면 렌더링과 사용자 입력을 처리
- API 요청은 Next.js Route Handlers에서 처리
- 실제 데이터는 Supabase Postgres에 저장
- 인증은 Supabase Auth를 사용
- 초기 버전에서는 파일 업로드 없음

---

## 11. DB 최소 설계

### 11-1. users
- id
- email
- nickname
- created_at

### 11-2. learning_projects
- id
- title
- category
- difficulty
- summary
- is_published
- created_at

### 11-3. specs
- id
- project_id
- title
- version
- content
- created_at

### 11-4. test_cases
- id
- project_id
- user_id
- tc_code
- feature_name
- purpose
- precondition
- steps
- expected_result
- priority
- note
- created_at
- updated_at

### 11-5. checklists
- id
- project_id
- user_id
- cl_code
- category
- check_item
- expected_standard
- note
- created_at
- updated_at

### 11-6. test_runs
- id
- project_id
- user_id
- test_case_id
- actual_result
- run_status
- build_version
- executed_at
- created_at

run_status 값:
- PASS
- FAIL
- BLOCKED

### 11-7. bugs
- id
- project_id
- user_id
- related_test_case_id
- bug_code
- priority
- assignee_type
- status
- issue_summary
- reproduce_steps
- actual_result
- occurrence_rate
- build_version
- expected_result
- created_at
- updated_at

assignee_type 값:
- 기획
- 개발

status 값:
- Open
- In Progress
- Fixed
- Retest
- Closed

---

## 12. API 초안

### Auth
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout

### Learning Projects
- GET /api/projects
- GET /api/projects/:id

### Specs
- GET /api/projects/:id/spec

### Test Cases
- GET /api/projects/:id/test-cases
- POST /api/projects/:id/test-cases
- PATCH /api/test-cases/:id
- DELETE /api/test-cases/:id

### Checklists
- GET /api/projects/:id/checklists
- POST /api/projects/:id/checklists
- PATCH /api/checklists/:id
- DELETE /api/checklists/:id

### Test Runs
- GET /api/projects/:id/test-runs
- POST /api/projects/:id/test-runs

### Bugs
- GET /api/projects/:id/bugs
- POST /api/projects/:id/bugs
- PATCH /api/bugs/:id
- DELETE /api/bugs/:id

### QA Summary
- GET /api/projects/:id/summary

---

## 13. 권한 정책

### 13-1. 사용자 권한
- 본인이 작성한 TC / CL / 테스트 결과 / 버그만 수정 가능
- 학습 프로젝트와 기획서는 읽기 가능
- 다른 사용자의 작성물은 볼 수 없음

### 13-2. 관리자 권한
- 학습 프로젝트 생성 / 수정 / 게시
- 기획서 등록 / 수정
- 기본 데이터 관리

---

## 14. UI / UX 원칙

### 14-1. 핵심 원칙
- 복잡한 지라 느낌보다 가볍고 직관적일 것
- 탭 이동만으로 전체 QA 흐름이 이해될 것
- 문서형 서비스이므로 입력 경험이 편해야 할 것
- 초보자도 필드 의미를 바로 이해할 수 있어야 할 것

### 14-2. 디자인 방향
- 실무 툴 느낌의 깔끔한 대시보드
- 과한 색상보다 명확한 상태 색상 중심
- PASS / FAIL / BLOCKED / BUG 상태 강조
- 폼 중심 레이아웃
- 모바일보다 데스크톱 우선

---

## 15. 성공 기준

### 15-1. 제품 관점
- 사용자가 기획서부터 버그 리포트까지 한 사이클을 끝낼 수 있음
- 학습 프로젝트 1개를 완료했을 때 QA 흐름을 이해했다고 느낄 수 있음
- TC 작성, 테스트 기록, 버그 발급이 자연스럽게 이어짐

### 15-2. MVP 관점
- 로그인 가능
- 학습 프로젝트 목록 진입 가능
- 기획서 조회 가능
- TC / CL 작성 가능
- 테스트 실행 기록 가능
- FAIL → 버그 발급 가능
- QA 결과 요약 확인 가능

---

## 16. 개발 우선순위

### Phase 1
- 프로젝트 기본 세팅
- Auth
- 학습 프로젝트 목록
- 기획서 탭

### Phase 2
- TC / CL 작성 기능
- DB 저장
- 수정 / 삭제

### Phase 3
- 테스트 실행 탭
- PASS / FAIL / BLOCKED 저장

### Phase 4
- 버그 리포트 발급
- 버그 상태 관리

### Phase 5
- QA 결과 요약 화면
- 마감 다듬기

---

## 17. 추후 확장 가능 기능
- 스크린샷 업로드
- GitHub 연동
- 개인 프로젝트 모드
- 템플릿 복제 기능
- QA 리포트 export
- 커뮤니티 공유 기능
- 멘토 피드백 모드