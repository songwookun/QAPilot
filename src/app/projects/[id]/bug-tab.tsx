"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  TestCase,
  Bug,
  BugPriority,
  AssigneeType,
  BugStatus,
  OccurrenceRate,
} from "@/types/database";

const priorityOptions: BugPriority[] = ["Low", "Medium", "High", "Critical"];
const assigneeOptions: AssigneeType[] = ["기획", "개발"];
const statusOptions: BugStatus[] = ["Open", "In Progress", "Fixed", "Retest", "Closed"];
const occurrenceOptions: OccurrenceRate[] = ["항상 발생", "간헐적 발생", "1회 발생"];

const priorityColor: Record<BugPriority, string> = {
  Low: "bg-gray-100 text-gray-700",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
};

const statusColor: Record<BugStatus, string> = {
  Open: "bg-red-500 text-white",
  "In Progress": "bg-yellow-500 text-white",
  Fixed: "bg-blue-500 text-white",
  Retest: "bg-purple-500 text-white",
  Closed: "bg-gray-400 text-white",
};

interface BugTabProps {
  projectId: string;
  userId: string;
  initialTestCases: TestCase[];
  initialBugs: Bug[];
  prefillTestCaseId?: string | null;
}

export default function BugTab({
  projectId,
  userId,
  initialTestCases,
  initialBugs,
  prefillTestCaseId,
}: BugTabProps) {
  const [testCases] = useState<TestCase[]>(initialTestCases);
  const [bugs, setBugs] = useState<Bug[]>(initialBugs);
  const [showForm, setShowForm] = useState(!!prefillTestCaseId);
  const [editingBug, setEditingBug] = useState<Bug | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("bugs")
      .select("*")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setBugs((data as Bug[]) ?? []);
  }, [projectId, userId]);

  async function getNextBugCode(): Promise<string> {
    const supabase = createClient();
    const { data } = await supabase
      .from("bugs")
      .select("bug_code")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (!data || data.length === 0) return "BUG-001";

    const lastCode = data[0].bug_code;
    const num = parseInt(lastCode.replace("BUG-", ""), 10);
    return `BUG-${String(num + 1).padStart(3, "0")}`;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    const bugCode = await getNextBugCode();
    const relatedTcId = form.get("related_test_case_id") as string;

    const { error: insertError } = await supabase.from("bugs").insert({
      project_id: projectId,
      user_id: userId,
      related_test_case_id: relatedTcId || null,
      bug_code: bugCode,
      priority: form.get("priority") as BugPriority,
      assignee_type: form.get("assignee_type") as AssigneeType,
      status: "Open" as BugStatus,
      issue_summary: form.get("issue_summary") as string,
      reproduce_steps: form.get("reproduce_steps") as string,
      actual_result: form.get("actual_result") as string,
      occurrence_rate: form.get("occurrence_rate") as OccurrenceRate,
      build_version: (form.get("build_version") as string) || null,
      expected_result: form.get("expected_result") as string,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setShowForm(false);
      refresh();
    }
    setLoading(false);
  }

  async function handleStatusChange(bugId: string, newStatus: BugStatus) {
    const supabase = createClient();
    await supabase.from("bugs").update({ status: newStatus }).eq("id", bugId);
    refresh();
  }

  async function deleteBug(id: string) {
    if (!confirm("이 버그 리포트를 삭제하시겠습니까?")) return;
    const supabase = createClient();
    await supabase.from("bugs").delete().eq("id", id);
    refresh();
  }

  function getTcLabel(tcId: string | null) {
    if (!tcId) return "-";
    const tc = testCases.find((t) => t.id === tcId);
    if (!tc) return "알 수 없음";
    return `#${tc.tc_number} ${tc.summary || tc.major_category || ""}`.trim();
  }

  // 통계
  const openCount = bugs.filter((b) => b.status === "Open").length;
  const inProgressCount = bugs.filter((b) => b.status === "In Progress").length;
  const fixedCount = bugs.filter((b) => b.status === "Fixed").length;
  const retestCount = bugs.filter((b) => b.status === "Retest").length;
  const closedCount = bugs.filter((b) => b.status === "Closed").length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">버그 리포트</h3>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingBug(null);
          }}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          {showForm ? "취소" : "+ 버그 등록"}
        </button>
      </div>

      {/* 통계 */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3">
          <span className="text-sm text-gray-500">전체</span>
          <span className="text-lg font-bold">{bugs.length}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-500">Open</span>
          <span className="text-lg font-bold text-red-600">{openCount}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-gray-500">In Progress</span>
          <span className="text-lg font-bold text-yellow-600">{inProgressCount}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-500">Fixed</span>
          <span className="text-lg font-bold text-blue-600">{fixedCount}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-purple-500" />
          <span className="text-sm text-gray-500">Retest</span>
          <span className="text-lg font-bold text-purple-600">{retestCount}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-gray-400" />
          <span className="text-sm text-gray-500">Closed</span>
          <span className="text-lg font-bold text-gray-600">{closedCount}</span>
        </div>
      </div>

      {/* 버그 등록 폼 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-lg border bg-white p-5">
          <h4 className="font-semibold">새 버그 등록</h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">관련 TC (선택)</label>
              <select
                name="related_test_case_id"
                defaultValue={prefillTestCaseId ?? ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">없음</option>
                {testCases.map((tc) => (
                  <option key={tc.id} value={tc.id}>
                    #{tc.tc_number} {tc.major_category} &gt; {tc.medium_category} - {tc.summary}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">우선순위</label>
              <select
                name="priority"
                defaultValue="Medium"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">담당자 유형</label>
              <select
                name="assignee_type"
                defaultValue="개발"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {assigneeOptions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">발생률</label>
              <select
                name="occurrence_rate"
                defaultValue="항상 발생"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {occurrenceOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">발생 버전</label>
              <input
                name="build_version"
                placeholder="예: v1.0.0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">이슈 내용</label>
            <input
              name="issue_summary"
              required
              placeholder="버그를 요약해서 작성하세요"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">재현 경로</label>
            <textarea
              name="reproduce_steps"
              required
              rows={3}
              placeholder="1. 로그인 페이지 접속&#10;2. 이메일 입력&#10;3. 비밀번호 입력 후 로그인 버튼 클릭"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">이슈 현상 (Actual Result)</label>
            <textarea
              name="actual_result"
              required
              rows={2}
              placeholder="실제 발생한 현상을 작성하세요"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">기대 결과 (Expected Result)</label>
            <textarea
              name="expected_result"
              required
              rows={2}
              placeholder="정상 동작 시 기대되는 결과를 작성하세요"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "저장 중..." : "버그 등록"}
          </button>
        </form>
      )}

      {/* 버그 상세 보기 */}
      {editingBug && (
        <div className="mb-6 rounded-lg border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-red-600">{editingBug.bug_code}</span>
              <span className={`rounded px-2 py-0.5 text-xs font-bold ${priorityColor[editingBug.priority]}`}>
                {editingBug.priority}
              </span>
              <span className={`rounded px-2 py-0.5 text-xs font-bold ${statusColor[editingBug.status]}`}>
                {editingBug.status}
              </span>
            </div>
            <button
              onClick={() => setEditingBug(null)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              닫기
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">이슈 내용: </span>
              <span>{editingBug.issue_summary}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">관련 TC: </span>
              <span>{getTcLabel(editingBug.related_test_case_id)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">담당자: </span>
              <span>{editingBug.assignee_type}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">발생률: </span>
              <span>{editingBug.occurrence_rate}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">발생 버전: </span>
              <span>{editingBug.build_version || "-"}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">재현 경로:</span>
              <pre className="mt-1 whitespace-pre-wrap rounded bg-gray-50 p-3 text-gray-600">{editingBug.reproduce_steps}</pre>
            </div>
            <div>
              <span className="font-medium text-gray-700">이슈 현상:</span>
              <pre className="mt-1 whitespace-pre-wrap rounded bg-gray-50 p-3 text-gray-600">{editingBug.actual_result}</pre>
            </div>
            <div>
              <span className="font-medium text-gray-700">기대 결과:</span>
              <pre className="mt-1 whitespace-pre-wrap rounded bg-gray-50 p-3 text-gray-600">{editingBug.expected_result}</pre>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="font-medium text-gray-700">상태 변경:</span>
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    handleStatusChange(editingBug.id, s);
                    setEditingBug({ ...editingBug, status: s });
                  }}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                    editingBug.status === s
                      ? statusColor[s]
                      : "border border-gray-300 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 버그 목록 테이블 */}
      {bugs.length === 0 ? (
        <p className="text-sm text-gray-400">등록된 버그가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm font-medium text-gray-700">
                <th className="w-[100px] border-r px-3 py-2.5 text-left">Bug ID</th>
                <th className="border-r px-3 py-2.5 text-left">이슈 내용</th>
                <th className="w-[80px] border-r px-3 py-2.5 text-center">우선순위</th>
                <th className="w-[70px] border-r px-3 py-2.5 text-center">담당</th>
                <th className="w-[100px] border-r px-3 py-2.5 text-center">상태</th>
                <th className="border-r px-3 py-2.5 text-left">관련 TC</th>
                <th className="w-[130px] border-r px-3 py-2.5 text-center">등록일</th>
                <th className="w-10 px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {bugs.map((bug) => (
                <tr
                  key={bug.id}
                  className="cursor-pointer border-t hover:bg-gray-50/50"
                  onClick={() => {
                    setEditingBug(bug);
                    setShowForm(false);
                  }}
                >
                  <td className="border-r px-3 py-2 text-sm font-mono font-semibold text-red-600">
                    {bug.bug_code}
                  </td>
                  <td className="border-r px-3 py-2 text-sm">{bug.issue_summary}</td>
                  <td className="border-r px-3 py-2 text-center">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${priorityColor[bug.priority]}`}>
                      {bug.priority}
                    </span>
                  </td>
                  <td className="border-r px-3 py-2 text-center text-sm">{bug.assignee_type}</td>
                  <td className="border-r px-3 py-2 text-center">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${statusColor[bug.status]}`}>
                      {bug.status}
                    </span>
                  </td>
                  <td className="border-r px-3 py-2 text-sm text-gray-500">
                    {getTcLabel(bug.related_test_case_id)}
                  </td>
                  <td className="border-r px-3 py-2 text-center text-sm text-gray-500">
                    {new Date(bug.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBug(bug.id);
                      }}
                      className="text-gray-400 hover:text-red-600"
                      title="삭제"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
