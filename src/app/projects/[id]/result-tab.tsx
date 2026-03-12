"use client";

import { useState } from "react";
import type { TestCase, TestRun, Bug } from "@/types/database";

interface IntentionalBug {
  title: string;
  category: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  hint: string;
}

const intentionalBugs: Record<string, IntentionalBug[]> = {
  "11111111-1111-1111-1111-111111111111": [
    {
      title: "빈 이메일 입력 시 에러 메시지 미표시",
      category: "유효성 검증",
      severity: "Medium",
      description: "이메일을 입력하지 않고 로그인 버튼을 누르면, 에러 메시지 없이 아무 반응이 없습니다.",
      hint: "이메일 필드를 비워둔 채 로그인을 시도해보세요.",
    },
    {
      title: "로그인 실패 횟수 미표시",
      category: "UX",
      severity: "Medium",
      description: "5회 실패 시 계정이 잠기지만, 현재 실패 횟수가 사용자에게 표시되지 않아 몇 번 남았는지 알 수 없습니다.",
      hint: "틀린 비밀번호로 여러 번 로그인을 시도해보세요.",
    },
    {
      title: "로그인 실패 시 오해를 주는 에러 메시지",
      category: "로직",
      severity: "Medium",
      description: "존재하지 않는 계정으로 로그인해도 '비밀번호가 일치하지 않습니다'라고 표시되어, 계정 존재 여부를 구분할 수 없습니다.",
      hint: "등록되지 않은 이메일로 로그인을 시도해보세요.",
    },
  ],
  "22222222-2222-2222-2222-222222222222": [
    {
      title: "수량 0 입력 시 확인 없이 즉시 삭제",
      category: "UX",
      severity: "High",
      description: "상품 수량을 0이나 음수로 변경하면 확인 팝업 없이 해당 상품이 장바구니에서 바로 삭제됩니다.",
      hint: "상품 수량 입력란에 직접 0을 입력해보세요.",
    },
    {
      title: "'전체 삭제' 시 확인 팝업 없음",
      category: "UX",
      severity: "High",
      description: "'선택 삭제'는 확인 팝업이 있지만, '전체 삭제' 버튼은 확인 없이 즉시 장바구니를 비웁니다.",
      hint: "'전체 삭제'와 '선택 삭제' 버튼의 동작을 비교해보세요.",
    },
  ],
  "33333333-3333-3333-3333-333333333333": [
    {
      title: "닉네임 최대 길이 미검증",
      category: "유효성 검증",
      severity: "High",
      description: "닉네임 입력란에 '2~10자'라고 안내하지만, 실제로는 최대 길이 검증이 없어 10자를 초과해도 가입이 가능합니다.",
      hint: "매우 긴 닉네임을 입력해서 가입을 시도해보세요.",
    },
    {
      title: "이메일 중복 확인 없이 가입 가능",
      category: "보안",
      severity: "Critical",
      description: "이메일 중복 확인 버튼이 있지만, 중복 확인을 하지 않아도 가입 버튼이 활성화되어 그대로 가입할 수 있습니다.",
      hint: "이메일 중복 확인을 누르지 않고 바로 가입을 시도해보세요.",
    },
  ],
  "44444444-4444-4444-4444-444444444444": [
    {
      title: "인벤토리 초과 시 골드 차감 후 에러",
      category: "로직",
      severity: "Critical",
      description: "인벤토리가 가득 찬 상태에서 아이템을 구매하면, 골드가 먼저 차감된 후에야 인벤토리 초과 에러가 표시됩니다. 골드는 돌아오지 않습니다.",
      hint: "인벤토리를 가득 채운 뒤 아이템 구매를 시도해보세요.",
    },
  ],
  "55555555-5555-5555-5555-555555555555": [
    {
      title: "수량 정렬 순서 반대로 동작",
      category: "로직",
      severity: "Medium",
      description: "수량 기준 정렬 시 오름차순/내림차순이 반대로 동작합니다. 오름차순을 선택하면 내림차순으로 정렬됩니다.",
      hint: "수량 기준으로 오름차순/내림차순 정렬을 전환하며 결과를 확인해보세요.",
    },
  ],
  "66666666-6666-6666-6666-666666666666": [
    {
      title: "공지사항 탭 클릭 시 메인 화면이 표시됨",
      category: "기능",
      severity: "Critical",
      description: "상단 탭에서 '공지사항'을 클릭하면, 탭은 활성화 상태로 표시되지만 실제 콘텐츠는 메인 화면이 그대로 보입니다.",
      hint: "각 탭을 하나씩 클릭하며 콘텐츠가 올바르게 전환되는지 확인해보세요.",
    },
  ],
  "77777777-7777-7777-7777-777777777777": [
    {
      title: "완료 카운트가 미완료 수를 표시",
      category: "UI",
      severity: "High",
      description: "상단의 '완료: N / M' 표시에서 완료 수가 실제 완료된 항목 수가 아니라 미완료 항목 수를 보여줍니다.",
      hint: "할 일을 완료 처리한 후 상단의 완료 카운트가 정확한지 확인해보세요.",
    },
    {
      title: "'완료 항목 삭제' 시 미완료 항목이 삭제됨",
      category: "로직",
      severity: "Critical",
      description: "하단의 '완료 항목 삭제' 버튼을 누르면 완료된 항목이 아니라 미완료 항목이 삭제되고, 완료된 항목만 남습니다.",
      hint: "할 일 몇 개를 완료 처리한 후 '완료 항목 삭제' 버튼을 눌러보세요.",
    },
  ],
  "88888888-8888-8888-8888-888888888888": [
    {
      title: "공격 시 추가 데미지가 기획보다 2배 높음",
      category: "밸런스",
      severity: "Critical",
      description: "기획서에는 '최대 공격력의 10%까지 추가 랜덤 데미지'로 명시되어 있지만, 실제로는 20%가 적용되어 데미지가 기획보다 높습니다.",
      hint: "공격 시 전투 로그의 추가 데미지를 확인하고, 공격력의 10%를 초과하는지 여러 번 테스트해보세요.",
    },
    {
      title: "방어 시 방어력이 절반만 적용됨",
      category: "밸런스",
      severity: "Critical",
      description: "기획서에는 '상대 공격력 - 내 방어력 = 받는 데미지'로 명시되어 있지만, 실제로는 방어력의 50%만 적용되어 데미지를 더 많이 받습니다.",
      hint: "방어 버튼을 눌러 받는 데미지를 계산해보세요. 적 공격력 60 - 내 방어력 30 = 30이어야 합니다.",
    },
  ],
  "99999999-9999-9999-9999-999999999999": [
    {
      title: "수수료가 내 잔액에서 차감되지 않음",
      category: "금액 정확성",
      severity: "Critical",
      description: "5만원 송금 시 총 차감액은 50,500원(송금액 + 수수료 500원)이어야 하지만, 실제로는 50,000원만 차감됩니다. 수수료가 빠지지 않습니다.",
      hint: "5만원을 송금한 후 내 잔액이 정확히 949,500원인지 확인해보세요.",
    },
    {
      title: "상대방에게 수수료 포함 금액이 입금됨",
      category: "금액 정확성",
      severity: "Critical",
      description: "5만원을 보내면 상대방에게 50,000원만 입금되어야 하지만, 실제로는 수수료 포함 50,500원이 입금됩니다.",
      hint: "송금 후 상대방 잔액을 확인해보세요. 500,000 + 50,000 = 550,000원이어야 합니다.",
    },
    {
      title: "1일 송금 한도가 누적 체크되지 않음",
      category: "보안",
      severity: "High",
      description: "1일 한도 50만원은 누적 기준이어야 하지만, 건당 금액만 체크합니다. 30만원 + 30만원처럼 나눠서 보내면 한도를 초과해도 송금됩니다.",
      hint: "30만원을 2번 연속 송금해보세요. 두 번째는 한도 초과로 차단되어야 합니다.",
    },
  ],
};

const severityColor: Record<string, string> = {
  Low: "bg-gray-100 text-gray-700",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
};

interface ResultTabProps {
  projectId: string;
  projectTitle: string;
  testCases: TestCase[];
  testRuns: TestRun[];
  bugs: Bug[];
}

export default function ResultTab({ projectId, projectTitle, testCases, testRuns, bugs }: ResultTabProps) {
  // TC 통계
  const totalTc = testCases.length;

  // 테스트 실행 통계
  const passCount = testRuns.filter((r) => r.run_status === "PASS").length;
  const failCount = testRuns.filter((r) => r.run_status === "FAIL").length;
  const blockedCount = testRuns.filter((r) => r.run_status === "BLOCKED").length;
  const totalRuns = testRuns.length;
  const passRate = totalRuns > 0 ? Math.round((passCount / totalRuns) * 100) : 0;

  // 버그 통계
  const totalBugs = bugs.length;
  const openBugs = bugs.filter((b) => b.status === "Open").length;
  const inProgressBugs = bugs.filter((b) => b.status === "In Progress").length;
  const fixedBugs = bugs.filter((b) => b.status === "Fixed").length;
  const retestBugs = bugs.filter((b) => b.status === "Retest").length;
  const closedBugs = bugs.filter((b) => b.status === "Closed").length;

  // 우선순위별 버그
  const criticalBugs = bugs.filter((b) => b.priority === "Critical").length;
  const highBugs = bugs.filter((b) => b.priority === "High").length;

  // 최근 5개
  const recentRuns = testRuns.slice(0, 5);
  const recentBugs = bugs.slice(0, 5);

  function getTcLabel(tcId: string) {
    const tc = testCases.find((t) => t.id === tcId);
    if (!tc) return "알 수 없음";
    return `#${tc.tc_number} ${tc.summary || tc.major_category || ""}`.trim();
  }

  function handleSaveReport() {
    const now = new Date();
    const dateStr = now.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });

    const lines = [
      "========================================",
      "  QAPilot - QA 리포트",
      "========================================",
      "",
      `프로젝트: ${projectTitle}`,
      `작성일: ${dateStr}`,
      "",
      "--- TC 현황 ---",
      `전체 TC: ${totalTc}개`,
      "",
      "--- 테스트 실행 ---",
      `전체: ${totalRuns}건`,
      `PASS: ${passCount} / FAIL: ${failCount} / BLOCKED: ${blockedCount}`,
      `PASS율: ${passRate}%`,
      "",
      "--- 버그 현황 ---",
      `전체: ${totalBugs}건`,
      `Open: ${openBugs} / In Progress: ${inProgressBugs} / Fixed: ${fixedBugs} / Retest: ${retestBugs} / Closed: ${closedBugs}`,
      `Critical: ${criticalBugs} / High: ${highBugs}`,
      "",
      "--- 버그 목록 ---",
      ...bugs.map((b) => `[${b.bug_code}] ${b.priority} | ${b.status} | ${b.issue_summary}`),
      "",
      "========================================",
      "  Generated by QAPilot",
      "========================================",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `QA리포트_${projectTitle}_${dateStr.replace(/\. /g, "-").replace(".", "")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">QA 결과 요약</h3>
        <button
          onClick={handleSaveReport}
          className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          리포트 저장
        </button>
      </div>

      {/* 요약 카드 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TC 현황 */}
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">전체 TC</p>
          <p className="mt-1 text-3xl font-bold">{totalTc}</p>
        </div>

        {/* 테스트 실행 */}
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">테스트 실행</p>
          <p className="mt-1 text-3xl font-bold">{totalRuns}</p>
          <p className="mt-1 text-sm text-gray-400">
            PASS율 <span className="font-semibold text-green-600">{passRate}%</span>
          </p>
        </div>

        {/* 버그 */}
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">발견 버그</p>
          <p className="mt-1 text-3xl font-bold text-red-600">{totalBugs}</p>
          <p className="mt-1 text-sm text-gray-400">
            미해결 <span className="font-semibold text-red-500">{openBugs + inProgressBugs}</span>
          </p>
        </div>

        {/* 위험 버그 */}
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Critical / High</p>
          <p className="mt-1 text-3xl font-bold text-orange-600">{criticalBugs + highBugs}</p>
          <p className="mt-1 text-sm text-gray-400">
            Critical <span className="font-semibold text-red-600">{criticalBugs}</span> · High <span className="font-semibold text-orange-600">{highBugs}</span>
          </p>
        </div>
      </div>

      {/* 테스트 실행 결과 바 */}
      <div className="mb-8">
        <h4 className="mb-3 text-sm font-semibold text-gray-700">테스트 실행 결과</h4>
        {totalRuns === 0 ? (
          <p className="text-sm text-gray-400">실행 기록이 없습니다.</p>
        ) : (
          <>
            <div className="flex h-6 overflow-hidden rounded-full">
              {passCount > 0 && (
                <div
                  className="bg-green-500 transition-all"
                  style={{ width: `${(passCount / totalRuns) * 100}%` }}
                />
              )}
              {failCount > 0 && (
                <div
                  className="bg-red-500 transition-all"
                  style={{ width: `${(failCount / totalRuns) * 100}%` }}
                />
              )}
              {blockedCount > 0 && (
                <div
                  className="bg-gray-400 transition-all"
                  style={{ width: `${(blockedCount / totalRuns) * 100}%` }}
                />
              )}
            </div>
            <div className="mt-2 flex gap-6 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                PASS {passCount}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                FAIL {failCount}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-gray-400" />
                BLOCKED {blockedCount}
              </span>
            </div>
          </>
        )}
      </div>

      {/* 버그 상태 분포 */}
      <div className="mb-8">
        <h4 className="mb-3 text-sm font-semibold text-gray-700">버그 상태 분포</h4>
        {totalBugs === 0 ? (
          <p className="text-sm text-gray-400">등록된 버그가 없습니다.</p>
        ) : (
          <>
            <div className="flex h-6 overflow-hidden rounded-full">
              {openBugs > 0 && (
                <div className="bg-red-500 transition-all" style={{ width: `${(openBugs / totalBugs) * 100}%` }} />
              )}
              {inProgressBugs > 0 && (
                <div className="bg-yellow-500 transition-all" style={{ width: `${(inProgressBugs / totalBugs) * 100}%` }} />
              )}
              {fixedBugs > 0 && (
                <div className="bg-blue-500 transition-all" style={{ width: `${(fixedBugs / totalBugs) * 100}%` }} />
              )}
              {retestBugs > 0 && (
                <div className="bg-purple-500 transition-all" style={{ width: `${(retestBugs / totalBugs) * 100}%` }} />
              )}
              {closedBugs > 0 && (
                <div className="bg-gray-400 transition-all" style={{ width: `${(closedBugs / totalBugs) * 100}%` }} />
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-red-500" />Open {openBugs}</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-yellow-500" />In Progress {inProgressBugs}</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-blue-500" />Fixed {fixedBugs}</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-purple-500" />Retest {retestBugs}</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-gray-400" />Closed {closedBugs}</span>
            </div>
          </>
        )}
      </div>

      {/* 최근 기록 2열 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 최근 테스트 실행 */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-700">최근 테스트 실행</h4>
          {recentRuns.length === 0 ? (
            <p className="text-sm text-gray-400">실행 기록이 없습니다.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border shadow-sm">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="border-r px-3 py-2 text-left font-medium">TC</th>
                    <th className="w-[70px] border-r px-3 py-2 text-center font-medium">결과</th>
                    <th className="w-[120px] px-3 py-2 text-center font-medium">일시</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRuns.map((run) => (
                    <tr key={run.id} className="border-t">
                      <td className="border-r px-3 py-2">{getTcLabel(run.test_case_id)}</td>
                      <td className="border-r px-3 py-2 text-center">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${
                            run.run_status === "PASS"
                              ? "bg-green-500 text-white"
                              : run.run_status === "FAIL"
                              ? "bg-red-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {run.run_status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center text-gray-500">
                        {new Date(run.executed_at).toLocaleDateString("ko-KR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 최근 버그 */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-700">최근 버그</h4>
          {recentBugs.length === 0 ? (
            <p className="text-sm text-gray-400">등록된 버그가 없습니다.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border shadow-sm">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="w-[80px] border-r px-3 py-2 text-left font-medium">ID</th>
                    <th className="border-r px-3 py-2 text-left font-medium">이슈</th>
                    <th className="w-[90px] px-3 py-2 text-center font-medium">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBugs.map((bug) => (
                    <tr key={bug.id} className="border-t">
                      <td className="border-r px-3 py-2 font-mono font-semibold text-red-600">
                        {bug.bug_code}
                      </td>
                      <td className="border-r px-3 py-2">{bug.issue_summary}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${
                            bug.status === "Open"
                              ? "bg-red-500 text-white"
                              : bug.status === "In Progress"
                              ? "bg-yellow-500 text-white"
                              : bug.status === "Fixed"
                              ? "bg-blue-500 text-white"
                              : bug.status === "Retest"
                              ? "bg-purple-500 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                        >
                          {bug.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* 정답 확인 */}
      <AnswerSection projectId={projectId} foundBugCount={totalBugs} />
    </div>
  );
}

function AnswerSection({ projectId, foundBugCount }: { projectId: string; foundBugCount: number }) {
  const [revealed, setRevealed] = useState(false);
  const answers = intentionalBugs[projectId];

  if (!answers) return null;

  const totalAnswers = answers.length;

  return (
    <div className="mt-10">
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700">정답 확인</h4>
            <p className="mt-0.5 text-xs text-gray-400">
              이 프로젝트에는 <span className="font-bold text-red-500">{totalAnswers}개</span>의 의도적인 버그가 숨겨져 있습니다.
              {!revealed && " 먼저 직접 찾아본 후 정답을 확인해보세요."}
            </p>
          </div>
          <button
            onClick={() => setRevealed(!revealed)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              revealed
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
          >
            {revealed ? "정답 숨기기" : "정답 확인하기"}
          </button>
        </div>

        {!revealed && (
          <div className="px-5 py-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
              <span className="text-2xl">?</span>
            </div>
            <p className="text-sm text-gray-500">
              현재 <span className="font-bold">{foundBugCount}개</span>의 버그를 발견했습니다.
              {foundBugCount >= totalAnswers
                ? " 모든 버그를 찾은 것 같네요! 정답을 확인해보세요."
                : ` 아직 ${totalAnswers - foundBugCount}개 더 찾을 수 있을지도 모릅니다.`}
            </p>
          </div>
        )}

        {revealed && (
          <div className="divide-y">
            {answers.map((answer, index) => (
              <div key={index} className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                    {index + 1}
                  </span>
                  <h5 className="text-sm font-semibold text-gray-800">{answer.title}</h5>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${severityColor[answer.severity]}`}>
                    {answer.severity}
                  </span>
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                    {answer.category}
                  </span>
                </div>
                <p className="mt-2 pl-8 text-sm text-gray-600">{answer.description}</p>
                <p className="mt-1 pl-8 text-xs text-gray-400">
                  <span className="font-medium text-amber-600">Hint:</span> {answer.hint}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
