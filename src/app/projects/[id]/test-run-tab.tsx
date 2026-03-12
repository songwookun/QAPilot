"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { TestCase, TestRun, RunStatus } from "@/types/database";

const statusOptions: RunStatus[] = ["PASS", "FAIL", "BLOCKED"];

const statusColor: Record<RunStatus, string> = {
  PASS: "bg-green-500 text-white",
  FAIL: "bg-red-500 text-white",
  BLOCKED: "bg-gray-500 text-white",
};

export default function TestRunTab({
  projectId,
  userId,
  initialTestCases,
  initialTestRuns,
}: {
  projectId: string;
  userId: string;
  initialTestCases: TestCase[];
  initialTestRuns: TestRun[];
}) {
  const router = useRouter();
  const [testCases] = useState<TestCase[]>(initialTestCases);
  const [testRuns, setTestRuns] = useState<TestRun[]>(initialTestRuns);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("test_runs")
      .select("*")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setTestRuns((data as TestRun[]) ?? []);
  }, [projectId, userId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error: insertError } = await supabase.from("test_runs").insert({
      project_id: projectId,
      user_id: userId,
      test_case_id: form.get("test_case_id") as string,
      actual_result: form.get("actual_result") as string,
      run_status: form.get("run_status") as RunStatus,
      build_version: (form.get("build_version") as string) || null,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      setShowForm(false);
      setLoading(false);
      refresh();
    }
  }

  async function deleteRun(id: string) {
    if (!confirm("이 실행 기록을 삭제하시겠습니까?")) return;
    const supabase = createClient();
    await supabase.from("test_runs").delete().eq("id", id);
    refresh();
  }

  function getTcLabel(tcId: string) {
    const tc = testCases.find((t) => t.id === tcId);
    if (!tc) return "알 수 없음";
    return `#${tc.tc_number} ${tc.summary || tc.major_category || ""}`.trim();
  }

  // 통계
  const passCount = testRuns.filter((r) => r.run_status === "PASS").length;
  const failCount = testRuns.filter((r) => r.run_status === "FAIL").length;
  const blockedCount = testRuns.filter((r) => r.run_status === "BLOCKED").length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">테스트 실행</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showForm ? "취소" : "+ 테스트 실행"}
        </button>
      </div>

      {/* 통계 */}
      <div className="mb-6 flex gap-4">
        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3">
          <span className="text-sm text-gray-500">전체</span>
          <span className="text-lg font-bold">{testRuns.length}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-500">PASS</span>
          <span className="text-lg font-bold text-green-600">{passCount}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-500">FAIL</span>
          <span className="text-lg font-bold text-red-600">{failCount}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-gray-500" />
          <span className="text-sm text-gray-500">BLOCKED</span>
          <span className="text-lg font-bold text-gray-600">{blockedCount}</span>
        </div>
      </div>

      {/* 실행 폼 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-lg border bg-white p-5">
          <h4 className="font-semibold">새 테스트 실행</h4>

          {testCases.length === 0 ? (
            <p className="text-sm text-gray-400">TC를 먼저 작성해주세요.</p>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">관련 TC</label>
                <select
                  name="test_case_id"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {testCases.map((tc) => (
                    <option key={tc.id} value={tc.id}>
                      #{tc.tc_number} {tc.major_category} &gt; {tc.medium_category} &gt; {tc.minor_category} - {tc.summary}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Actual Result</label>
                <textarea
                  name="actual_result"
                  required
                  rows={3}
                  placeholder="실제 테스트 결과를 입력하세요"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">결과</label>
                  <select
                    name="run_status"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">빌드 버전</label>
                  <input
                    name="build_version"
                    placeholder="예: v1.0.0"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "저장 중..." : "저장"}
              </button>
            </>
          )}
        </form>
      )}

      {/* 실행 기록 목록 */}
      {testRuns.length === 0 ? (
        <p className="text-sm text-gray-400">테스트 실행 기록이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm font-medium text-gray-700">
                <th className="border-r px-3 py-2.5 text-left">관련 TC</th>
                <th className="border-r px-3 py-2.5 text-left">Actual Result</th>
                <th className="w-[100px] border-r px-3 py-2.5 text-center">결과</th>
                <th className="w-[100px] border-r px-3 py-2.5 text-center">버전</th>
                <th className="w-[160px] border-r px-3 py-2.5 text-center">실행일시</th>
                <th className="w-10 px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {testRuns.map((run) => (
                <tr key={run.id} className="border-t hover:bg-gray-50/50">
                  <td className="border-r px-3 py-2 text-sm">{getTcLabel(run.test_case_id)}</td>
                  <td className="border-r px-3 py-2 text-sm">
                    <pre className="whitespace-pre-wrap">{run.actual_result}</pre>
                  </td>
                  <td className="border-r px-3 py-2 text-center">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${statusColor[run.run_status]}`}>
                      {run.run_status}
                    </span>
                  </td>
                  <td className="border-r px-3 py-2 text-center text-sm text-gray-500">
                    {run.build_version || "-"}
                  </td>
                  <td className="border-r px-3 py-2 text-center text-sm text-gray-500">
                    {new Date(run.executed_at).toLocaleString("ko-KR")}
                  </td>
                  <td className="px-2 py-2 text-center flex items-center gap-1">
                    {run.run_status === "FAIL" && (
                      <button
                        onClick={() =>
                          router.push(
                            `/projects/${projectId}?tab=bug&tc=${run.test_case_id}`
                          )
                        }
                        className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 hover:bg-red-200"
                        title="버그 발급"
                      >
                        버그 발급
                      </button>
                    )}
                    <button
                      onClick={() => deleteRun(run.id)}
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
