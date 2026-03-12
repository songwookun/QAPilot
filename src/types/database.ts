// Enum 타입 정의
export type ProjectCategory = "웹" | "앱" | "게임";
export type ProjectDifficulty = "초급" | "중급" | "고급";
export type TcStatus = "Test" | "OK" | "Fail";
export type RunStatus = "PASS" | "FAIL" | "BLOCKED";
export type BugPriority = "Low" | "Medium" | "High" | "Critical";
export type AssigneeType = "기획" | "개발";
export type BugStatus = "Open" | "In Progress" | "Fixed" | "Retest" | "Closed";
export type OccurrenceRate = "항상 발생" | "간헐적 발생" | "1회 발생";

// 테이블 타입 정의
export interface User {
  id: string;
  email: string;
  nickname: string | null;
  created_at: string;
}

export interface LearningProject {
  id: string;
  title: string;
  category: ProjectCategory;
  difficulty: ProjectDifficulty;
  summary: string | null;
  is_published: boolean;
  created_at: string;
}

export interface SpecFeature {
  name: string;
  description: string;
  requirements: string[];
  exceptions: string[];
  notes: string;
}

export interface SpecContent {
  features: SpecFeature[];
}

export interface Spec {
  id: string;
  project_id: string;
  title: string;
  version: string | null;
  content: SpecContent;
  created_at: string;
}

export interface TestCase {
  id: string;
  project_id: string;
  user_id: string;
  tc_number: number;
  major_category: string;
  medium_category: string;
  minor_category: string;
  summary: string;
  status: TcStatus;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface TestRun {
  id: string;
  project_id: string;
  user_id: string;
  test_case_id: string;
  actual_result: string;
  run_status: RunStatus;
  build_version: string | null;
  executed_at: string;
  created_at: string;
}

export interface Bug {
  id: string;
  project_id: string;
  user_id: string;
  related_test_case_id: string | null;
  bug_code: string;
  priority: BugPriority;
  assignee_type: AssigneeType;
  status: BugStatus;
  issue_summary: string;
  reproduce_steps: string;
  actual_result: string;
  occurrence_rate: OccurrenceRate;
  build_version: string | null;
  expected_result: string;
  created_at: string;
  updated_at: string;
}
