# QASupport 개발 진행 현황

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
- [x] 회원가입 페이지 개인정보 미사용 안내 문구 추가
- [x] 로그인 페이지 학습용 아이디 안내 문구 추가
- [x] 학습 프로젝트 목록 (카테고리 토글 + 카드형)
- [x] 프로젝트 상세 페이지 (탭 구조)
- [x] 기획서 탭 (jsonb 기반 기능/요구사항/예외사항 표시)
- [x] 시드 데이터 9개 프로젝트 + 9개 기획서

### Phase 2 - TC 작성
- [x] TC 테이블 엑셀 형태 (대분류/중분류/소분류/요약/확인/비고)
- [x] 셀 클릭 인라인 편집 (Enter 저장, Esc 취소)
- [x] 확인 드롭다운 (Test/OK/Fail) + 색상
- [x] 행 추가 / 삭제
- [x] CL(체크리스트) 제거 - TC만 사용
- [x] TC 탭에서 기획서 사이드 패널 (접기/펼치기)

### Phase 3 - 테스트 진행
- [x] 테스트 진행 탭 (목업 + TC 사이드 패널)
- [x] 의도적 버그가 포함된 인터랙티브 목업 9종
- [x] 각 목업에 힌트 텍스트 표시

### Phase 4 - 버그 리포트
- [x] 버그 리포트 탭 UI
- [x] 버그 작성 폼 (우선순위, 담당자, 이슈내용, 재현경로, 발생률, 기대결과 등)
- [x] Bug ID 자동 생성 (BUG-001)
- [x] 버그 목록 테이블 + 클릭 상세 보기
- [x] 버그 상태 관리 (Open → In Progress → Fixed → Retest → Closed)
- [x] 상태별 통계 바
- [x] 관련 TC 자동 연결

### Phase 5 - QA 결과 요약
- [x] QA 결과 대시보드 (TC 현황, 테스트 실행, 버그 현황)
- [x] 프로그레스 바 시각화
- [x] 최근 테스트 기록 / 최근 버그 기록
- [x] 정답 확인 (스포일러 방식) - 의도적 버그 목록 + 힌트
- [x] QA 리포트 텍스트 파일 다운로드 (포트폴리오 활용)

### 테스트 대상 목업 (9개)
- [x] 웹 로그인 기능 (초급) - 의도적 버그 포함
- [x] 장바구니 기능 (중급) - 의도적 버그 포함
- [x] 회원가입 기능 (초급) - 의도적 버그 포함
- [x] 포털 사이트 (중급) - 의도적 버그 포함
- [x] 할 일 관리 앱 (중급) - 의도적 버그 포함
- [x] 모바일 송금 앱 (고급) - 의도적 버그 포함
- [x] 게임 상점 구매 (초급) - 의도적 버그 포함
- [x] 인벤토리 정렬 (중급) - 의도적 버그 포함
- [x] RPG 전투 밸런스 (고급) - 의도적 버그 포함

### UI / UX 개선
- [x] 프로젝트 목록 카테고리 토글 (웹/앱/게임)
- [x] 프로젝트 카드에 진행률 표시 (TC/버그 개수)
- [x] 최근 활동 피드 (TC 작성, 버그 등록 내역)
- [x] 일일 QA 팁 (QA_REAL_WORLD_TIPS.md 기반, 날짜별 로테이션)
- [x] 랜딩 페이지 반응형 디자인
- [x] 랜딩 페이지 PC 환경 권장 안내 문구

### 배포
- [x] GitHub 레포지토리 생성 (public)
- [x] Vercel 배포 완료 (https://qa-support.vercel.app)
- [x] Google Search Console 등록 및 소유권 인증

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| 백엔드 | Next.js Server Components, Supabase SDK |
| DB | Supabase Postgres |
| 인증 | Supabase Auth (이메일/비밀번호, 인증 없이) |
| 폼 | React Hook Form + Zod |
| 배포 | Vercel |

## 주요 파일 구조

```
src/
├── app/
│   ├── page.tsx                    # 랜딩 페이지 (반응형)
│   ├── layout.tsx                  # 루트 레이아웃 + 메타데이터
│   ├── globals.css
│   ├── auth/
│   │   ├── login/page.tsx          # 로그인
│   │   └── signup/page.tsx         # 회원가입
│   └── projects/
│       ├── page.tsx                # 프로젝트 목록 (서버)
│       ├── project-list.tsx        # 카테고리 토글 + 카드 (클라이언트)
│       └── [id]/
│           ├── page.tsx            # 프로젝트 상세 (탭 구조)
│           ├── tc-cl-tab.tsx       # TC 작성 탭
│           ├── bug-tab.tsx         # 버그 리포트 탭
│           ├── result-tab.tsx      # QA 결과 대시보드
│           └── mock/
│               ├── index.tsx       # 목업 라우터
│               ├── login-mock.tsx
│               ├── cart-mock.tsx
│               ├── signup-mock.tsx
│               ├── portal-mock.tsx
│               ├── todo-mock.tsx
│               ├── transfer-mock.tsx
│               ├── game-store-mock.tsx
│               ├── inventory-mock.tsx
│               └── battle-mock.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # 클라이언트용 Supabase
│   │   ├── server.ts              # 서버용 Supabase
│   │   ├── middleware.ts          # 세션 갱신
│   │   └── actions.ts            # 서버 액션 (login/signup/logout)
│   └── utils.ts
├── types/
│   └── database.ts               # DB 타입 정의
└── middleware.ts                  # 인증 미들웨어
```
