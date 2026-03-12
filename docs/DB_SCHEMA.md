# QAPilot Database Schema

## 1. 개요

본 문서는 QAPilot QA 학습 플랫폼의 데이터베이스 구조를 정의한다.

DB는 Supabase(PostgreSQL)를 사용하며 다음 데이터를 관리한다.

- 사용자
- 학습 프로젝트
- 기획서
- Test Case
- 테스트 실행 기록
- 버그 리포트

초기 MVP에서는 파일 업로드 기능은 제외한다.

---

## 2. 테이블 목록

1. users
2. learning_projects
3. specs
4. test_cases
5. test_runs
6. bugs

---

## 3. ER 관계 요약

```
users (1) ──── (N) test_cases
users (1) ──── (N) test_runs
users (1) ──── (N) bugs

learning_projects (1) ──── (N) specs
learning_projects (1) ──── (N) test_cases
learning_projects (1) ──── (N) test_runs
learning_projects (1) ──── (N) bugs

test_cases (1) ──── (N) test_runs
test_cases (1) ──── (N) bugs
```

---

## 4. Enum 타입 정의

```sql
create type project_category as enum ('웹', '앱', '게임');
create type project_difficulty as enum ('초급', '중급', '고급');
create type run_status as enum ('PASS', 'FAIL', 'BLOCKED');
create type bug_priority as enum ('Low', 'Medium', 'High', 'Critical');
create type assignee_type as enum ('기획', '개발');
create type bug_status as enum ('Open', 'In Progress', 'Fixed', 'Retest', 'Closed');
create type occurrence_rate as enum ('항상 발생', '간헐적 발생', '1회 발생');
```

---

## 5. users

사용자 정보 테이블

Supabase Auth의 user id를 사용한다.

| column | type | nullable | description |
|--------|------|----------|-------------|
| id | uuid | PK | 사용자 ID (Auth UID) |
| email | text | NOT NULL | 사용자 이메일 |
| nickname | text | NULL | 사용자 닉네임 |
| created_at | timestamptz | NOT NULL | 생성 시간 |

### SQL

```sql
create table users (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    nickname text,
    created_at timestamptz default now() not null
);
```

---

## 6. learning_projects

학습용 프로젝트 테이블

관리자가 등록하며, 사용자는 목록에서 선택하여 학습을 시작한다.

| column | type | nullable | description |
|--------|------|----------|-------------|
| id | uuid | PK | 프로젝트 ID |
| title | text | NOT NULL | 프로젝트명 |
| category | project_category | NOT NULL | 카테고리 (웹/앱/게임) |
| difficulty | project_difficulty | NOT NULL | 난이도 (초급/중급/고급) |
| summary | text | NULL | 프로젝트 설명 |
| is_published | boolean | NOT NULL | 게시 여부 |
| created_at | timestamptz | NOT NULL | 생성 시간 |

### SQL

```sql
create table learning_projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    category project_category not null,
    difficulty project_difficulty not null,
    summary text,
    is_published boolean default false not null,
    created_at timestamptz default now() not null
);
```

---

## 7. specs

기획서 테이블

프로젝트당 1개의 기획서를 가진다. 기획서 내용은 JSON으로 저장한다.

| column | type | nullable | description |
|--------|------|----------|-------------|
| id | uuid | PK | 기획서 ID |
| project_id | uuid | FK, NOT NULL | 소속 프로젝트 |
| title | text | NOT NULL | 기획서 제목 |
| version | text | NULL | 버전 정보 (예: v1.0.0) |
| content | jsonb | NOT NULL | 기획서 본문 (기능명, 요구사항, 예외사항 등) |
| created_at | timestamptz | NOT NULL | 생성 시간 |

### SQL

```sql
create table specs (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references learning_projects(id) on delete cascade,
    title text not null,
    version text,
    content jsonb not null default '{}',
    created_at timestamptz default now() not null
);

create index idx_specs_project_id on specs(project_id);
```

---

## 8. test_cases

테스트 케이스 테이블 (엑셀 스프레드시트 형식)

사용자가 프로젝트별로 직접 작성한다. 대분류/중분류/소분류로 TC를 분류한다.

| column | type | nullable | description |
|--------|------|----------|-------------|
| id | uuid | PK | TC ID |
| project_id | uuid | FK, NOT NULL | 소속 프로젝트 |
| user_id | uuid | FK, NOT NULL | 작성자 |
| tc_number | integer | NOT NULL | TC 번호 (행 번호) |
| major_category | text | NOT NULL | 대분류 |
| medium_category | text | NOT NULL | 중분류 |
| minor_category | text | NOT NULL | 소분류 |
| summary | text | NOT NULL | 요약 (테스트 항목) |
| status | text | NOT NULL | 확인 상태 (OK / Not-test / re-edit) |
| note | text | NOT NULL | 비고 |
| created_at | timestamptz | NOT NULL | 생성 시간 |
| updated_at | timestamptz | NOT NULL | 수정 시간 |

### SQL

```sql
create table test_cases (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references learning_projects(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    tc_number integer not null,
    major_category text not null default '',
    medium_category text not null default '',
    minor_category text not null default '',
    summary text not null,
    status text not null default 'Not-test',
    note text not null default '',
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index idx_test_cases_project_user on test_cases(project_id, user_id);
```

---

## 9. test_runs

테스트 실행 기록 테이블

작성한 TC를 기준으로 실행 결과를 기록한다.

| column | type | nullable | description |
|--------|------|----------|-------------|
| id | uuid | PK | 실행 ID |
| project_id | uuid | FK, NOT NULL | 소속 프로젝트 |
| user_id | uuid | FK, NOT NULL | 실행자 |
| test_case_id | uuid | FK, NOT NULL | 관련 TC |
| actual_result | text | NOT NULL | 실제 결과 |
| run_status | run_status | NOT NULL | 실행 결과 (PASS/FAIL/BLOCKED) |
| build_version | text | NULL | 테스트 빌드 버전 |
| executed_at | timestamptz | NOT NULL | 실행 일시 |
| created_at | timestamptz | NOT NULL | 생성 시간 |

### SQL

```sql
create table test_runs (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references learning_projects(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    test_case_id uuid not null references test_cases(id) on delete cascade,
    actual_result text not null,
    run_status run_status not null,
    build_version text,
    executed_at timestamptz default now() not null,
    created_at timestamptz default now() not null
);

create index idx_test_runs_project_user on test_runs(project_id, user_id);
create index idx_test_runs_test_case on test_runs(test_case_id);
```

---

## 10. bugs

버그 리포트 테이블

FAIL 건에 대해 버그를 발급하고 상태를 관리한다.

| column | type | nullable | description |
|--------|------|----------|-------------|
| id | uuid | PK | 버그 ID |
| project_id | uuid | FK, NOT NULL | 소속 프로젝트 |
| user_id | uuid | FK, NOT NULL | 작성자 |
| related_test_case_id | uuid | FK, NULL | 관련 TC (선택) |
| bug_code | text | NOT NULL | 버그 코드 (예: BUG-001) |
| priority | bug_priority | NOT NULL | 우선순위 |
| assignee_type | assignee_type | NOT NULL | 담당자 유형 (기획/개발) |
| status | bug_status | NOT NULL | 상태 |
| issue_summary | text | NOT NULL | 이슈 내용 |
| reproduce_steps | text | NOT NULL | 재현 경로 |
| actual_result | text | NOT NULL | 이슈 현상 |
| occurrence_rate | occurrence_rate | NOT NULL | 발생률 |
| build_version | text | NULL | 발생 버전 |
| expected_result | text | NOT NULL | 기대 결과 |
| created_at | timestamptz | NOT NULL | 생성 시간 |
| updated_at | timestamptz | NOT NULL | 수정 시간 |

### SQL

```sql
create table bugs (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references learning_projects(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    related_test_case_id uuid references test_cases(id) on delete set null,
    bug_code text not null,
    priority bug_priority not null default 'Medium',
    assignee_type assignee_type not null default '개발',
    status bug_status not null default 'Open',
    issue_summary text not null,
    reproduce_steps text not null,
    actual_result text not null,
    occurrence_rate occurrence_rate not null default '항상 발생',
    build_version text,
    expected_result text not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    unique(project_id, user_id, bug_code)
);

create index idx_bugs_project_user on bugs(project_id, user_id);
create index idx_bugs_status on bugs(status);
create index idx_bugs_related_tc on bugs(related_test_case_id);
```

---

## 11. RLS (Row Level Security) 정책

### 원칙

- `learning_projects`, `specs`: 모든 인증 사용자가 읽기 가능 (is_published = true)
- `test_cases`, `test_runs`, `bugs`: 본인 데이터만 CRUD 가능

---

## 12. updated_at 자동 갱신 트리거

```sql
create or replace function update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trg_test_cases_updated_at
    before update on test_cases
    for each row execute function update_updated_at();

create trigger trg_bugs_updated_at
    before update on bugs
    for each row execute function update_updated_at();
```
