# QAPilot

> QA 실무 학습 플랫폼 — 기획서 분석부터 버그 리포트까지, QA 전체 흐름을 직접 경험하세요.

## 기획 의도

QA 준비생은 이론은 공부해도 **실제 QA 프로세스를 끝까지 경험할 기회가 적습니다.**

QAPilot은 실제 서비스와 유사한 목업(Mock)에 **의도적 버그**를 심어두고, 사용자가 직접 테스트 케이스를 작성하고, 버그를 찾고, 리포트를 발급하는 **QA 실무 전체 흐름**을 학습할 수 있는 플랫폼입니다.

정답을 맞히는 채점형 서비스가 아닌, **실무형 문서 작성 습관과 QA 프로세스 흐름을 익히는 학습 플랫폼**입니다.

## 학습 흐름

```
기획서 분석 → TC 작성 → 테스트 진행 → 버그 리포트 → QA 결과 확인
```

1. **기획서 분석** — 프로젝트의 기획서를 읽고 요구사항과 예외사항을 파악합니다.
2. **TC 작성** — 기획서 기반으로 테스트 케이스를 작성합니다.
3. **테스트 진행** — 의도적 버그가 포함된 목업을 직접 조작하며 TC를 확인합니다.
4. **버그 리포트** — 발견한 버그를 실무 양식 그대로 리포트로 작성합니다.
5. **QA 결과** — 전체 QA 결과를 대시보드로 확인하고, 리포트를 다운로드할 수 있습니다.

## 주요 기능

- 웹 / 앱 / 게임 카테고리별 학습 프로젝트 (초급 ~ 고급)
- 의도적 버그가 포함된 인터랙티브 목업 9종
- TC(테스트 케이스) / CL(체크리스트) 작성 및 관리
- 실무 양식의 버그 리포트 작성 (우선순위, 재현경로, 상태관리)
- QA 결과 대시보드 및 정답 확인 (스포일러)
- QA 리포트 텍스트 파일 다운로드 (포트폴리오 활용)
- 최근 활동 피드 및 일일 QA 팁

## 학습 프로젝트 목록

| 카테고리 | 프로젝트 | 난이도 |
|---------|---------|--------|
| 웹 | 로그인 기능 | 초급 |
| 웹 | 장바구니 기능 | 중급 |
| 웹 | 회원가입 기능 | 초급 |
| 웹 | 포털 사이트 | 중급 |
| 앱 | 할 일 관리 앱 | 중급 |
| 앱 | 모바일 송금 앱 | 고급 |
| 게임 | 게임 상점 구매 | 초급 |
| 게임 | 인벤토리 정렬 | 중급 |
| 게임 | RPG 전투 밸런스 | 고급 |

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Form | React Hook Form + Zod |
| Deploy | Vercel |

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                    # 랜딩 페이지
│   ├── auth/
│   │   ├── login/page.tsx          # 로그인
│   │   └── signup/page.tsx         # 회원가입
│   └── projects/
│       ├── page.tsx                # 프로젝트 목록
│       ├── project-list.tsx        # 카테고리 토글 + 카드 목록
│       └── [id]/
│           ├── page.tsx            # 프로젝트 상세 (탭 구조)
│           ├── tc-cl-tab.tsx       # TC/CL 작성
│           ├── bug-tab.tsx         # 버그 리포트
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
│   └── supabase/                   # Supabase 클라이언트 설정
└── types/
    └── database.ts                 # DB 타입 정의
```

## 로컬 실행

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local에 Supabase URL과 Anon Key 입력

# 개발 서버 실행
npm run dev
```

## 환경 변수

| 변수명 | 설명 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key |

## 라이선스

MIT
