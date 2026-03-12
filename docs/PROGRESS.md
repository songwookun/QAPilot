# QAPilot 개발 진행 현황

## 완료된 작업

### Phase 0 - 기획 & 설계
- [x] PRD 작성 (PRD.md)
- [x] DB 스키마 설계 (DB_SCHEMA.md)
- [x] 전체 테이블 SQL DDL 완성 (6개 테이블)
- [x] Enum 타입, 인덱스, RLS 정책, 트리거 정의

### Phase 1 - 프로젝트 세팅 & 기본 화면
- [x] Next.js 16 + TypeScript + Tailwind CSS 프로젝트 생성
- [x] Supabase 연동 (client / server / middleware)
- [x] 인증 미들웨어 (비로그인 시 /auth/login 리디렉트)
- [x] 회원가입 / 로그인 / 로그아웃
- [x] 회원가입 시 users 테이블 자동 insert (DB 트리거)
- [x] 학습 프로젝트 목록 (카드형, 카테고리/난이도 뱃지)
- [x] 프로젝트 상세 페이지 (탭 구조)
- [x] 기획서 탭 (jsonb 기반 기능/요구사항/예외사항 표시)
- [x] 시드 데이터 5개 프로젝트 + 5개 기획서

### Phase 2 - TC 작성
- [x] TC 테이블 엑셀 형태 (대분류/중분류/소분류/요약/확인/비고)
- [x] 셀 클릭 인라인 편집 (Enter 저장, Esc 취소)
- [x] 확인 드롭다운 (Test/OK/Fail) + 색상
- [x] 행 추가 / 삭제
- [x] CL(체크리스트) 제거 - TC만 사용
- [x] TC 탭에서 기획서 사이드 패널 (접기/펼치기)

### Phase 3 - 테스트 실행
- [x] 테스트 실행 탭 UI
- [x] TC 선택 → Actual Result 입력 → PASS/FAIL/BLOCKED 기록
- [x] 실행 기록 테이블 (관련 TC, 결과, 버전, 실행일시)
- [x] 통계 바 (전체/PASS/FAIL/BLOCKED 카운트)
- [x] 실행 기록 삭제

### 테스트 대상 목업 (5개 전부 완료)
- [x] 웹 로그인 기능 목업 (의도적 버그 포함)
- [x] 쇼핑몰 장바구니 목업 (의도적 버그 포함)
- [x] 모바일 회원가입 목업 (의도적 버그 포함)
- [x] 게임 상점 구매 목업 (의도적 버그 포함)
- [x] 인벤토리 정렬 목업 (의도적 버그 포함)
- [x] 테스트 대상 탭에서 TC 사이드 패널 (화면 분할)

### UI 개선
- [x] 프로젝트 카드 색상 Linear/Notion 스타일로 변경
- [x] 카테고리/난이도 뱃지 디자인 개선

---

## 남은 작업

### Phase 4 - 버그 리포트
- [x] 버그 리포트 탭 UI
- [x] 버그 작성 폼 (우선순위, 담당자, 이슈내용, 재현경로, 발생률, 기대결과 등)
- [x] Bug ID 자동 생성 (BUG-001)
- [x] 버그 목록 테이블
- [x] 버그 상태 관리 (Open → In Progress → Fixed → Retest → Closed)
- [x] 테스트 실행에서 FAIL 시 "버그 발급" 버튼 연동
- [x] 관련 TC 자동 연결

### Phase 5 - QA 결과 요약
- [x] QA 결과 탭 UI
- [x] 전체 TC 수 / PASS / FAIL / BLOCKED 수
- [x] 생성된 버그 수 / 상태별 버그 수
- [x] 최근 테스트 기록
- [x] 최근 버그 기록

### 추가 개선 (선택)
- [ ] 랜딩 페이지 (/) 디자인
- [ ] 프로젝트 상세 헤더 디자인 개선
- [ ] 탭 전환 시 로딩 상태
- [ ] 반응형 (모바일 대응)
- [ ] Vercel 배포
- [ ] 에러 처리 고도화
- [ ] 회원가입 시 닉네임 저장 확인

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| 백엔드 | Next.js Route Handlers, Supabase SDK |
| DB | Supabase Postgres |
| 인증 | Supabase Auth (이메일/비밀번호, 인증 없이) |
| 배포 | Vercel (예정) |

## 주요 파일 구조

```
src/
├── app/
│   ├── auth/login/page.tsx        # 로그인
│   ├── auth/signup/page.tsx       # 회원가입
│   ├── projects/page.tsx          # 프로젝트 목록
│   ├── projects/[id]/
│   │   ├── page.tsx               # 프로젝트 상세 (탭 라우팅)
│   │   ├── tc-cl-tab.tsx          # TC 탭 (엑셀 형태 + 기획서 패널)
│   │   ├── test-run-tab.tsx       # 테스트 실행 탭
│   │   └── mock/
│   │       ├── index.tsx          # 목업 탭 (TC 사이드 패널)
│   │       ├── login-mock.tsx     # 로그인 목업
│   │       ├── cart-mock.tsx      # 장바구니 목업
│   │       ├── signup-mock.tsx    # 회원가입 목업
│   │       ├── game-store-mock.tsx # 게임 상점 목업
│   │       └── inventory-mock.tsx # 인벤토리 목업
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # 클라이언트용 Supabase
│   │   ├── server.ts              # 서버용 Supabase
│   │   ├── middleware.ts          # 세션 갱신
│   │   └── actions.ts            # 서버 액션 (login/signup/logout)
│   └── utils.ts
├── types/
│   └── database.ts               # DB 타입 정의
├── middleware.ts                  # 인증 미들웨어
└── hooks/                        # (아직 미사용)
```
