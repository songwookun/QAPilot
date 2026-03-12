"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import type { TestCase, TcStatus } from "@/types/database";

const LoginMock = dynamic(() => import("./login-mock"));
const CartMock = dynamic(() => import("./cart-mock"));
const SignupMock = dynamic(() => import("./signup-mock"));
const GameStoreMock = dynamic(() => import("./game-store-mock"));
const InventoryMock = dynamic(() => import("./inventory-mock"));
const PortalMock = dynamic(() => import("./portal-mock"));
const TodoMock = dynamic(() => import("./todo-mock"));
const BattleMock = dynamic(() => import("./battle-mock"));
const TransferMock = dynamic(() => import("./transfer-mock"));

const mockMap: Record<string, React.ComponentType> = {
  "11111111-1111-1111-1111-111111111111": LoginMock,
  "22222222-2222-2222-2222-222222222222": CartMock,
  "33333333-3333-3333-3333-333333333333": SignupMock,
  "44444444-4444-4444-4444-444444444444": GameStoreMock,
  "55555555-5555-5555-5555-555555555555": InventoryMock,
  "66666666-6666-6666-6666-666666666666": PortalMock,
  "77777777-7777-7777-7777-777777777777": TodoMock,
  "88888888-8888-8888-8888-888888888888": BattleMock,
  "99999999-9999-9999-9999-999999999999": TransferMock,
};

const statusOptions: TcStatus[] = ["Test", "OK", "Fail"];
const statusColor: Record<TcStatus, string> = {
  Test: "bg-yellow-400 text-black",
  OK: "bg-green-500 text-white",
  Fail: "bg-red-500 text-white",
};

function TcSidePanel({
  projectId,
  userId,
  initialTestCases,
}: {
  projectId: string;
  userId: string;
  initialTestCases: TestCase[];
}) {
  const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("test_cases")
      .select("*")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .order("tc_number", { ascending: true });
    setTestCases((data as TestCase[]) ?? []);
  }, [projectId, userId]);

  async function updateStatus(id: string, status: TcStatus) {
    const supabase = createClient();
    await supabase.from("test_cases").update({ status }).eq("id", id);
    refresh();
  }

  if (testCases.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        TC를 먼저 작성해주세요
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="sticky top-0 bg-gray-100 font-medium text-gray-700">
            <th className="border-r px-2 py-2 text-center">No.</th>
            <th className="border-r px-2 py-2 text-left">대분류</th>
            <th className="border-r px-2 py-2 text-left">중분류</th>
            <th className="border-r px-2 py-2 text-left">요약</th>
            <th className="px-2 py-2 text-center">확인</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((tc) => (
            <tr key={tc.id} className="border-t hover:bg-gray-50/50">
              <td className="border-r px-2 py-1.5 text-center text-gray-500">{tc.tc_number}</td>
              <td className="border-r px-2 py-1.5 text-gray-600">{tc.major_category || "-"}</td>
              <td className="border-r px-2 py-1.5 text-gray-600">{tc.medium_category || "-"}</td>
              <td className="border-r px-2 py-1.5 text-gray-700">{tc.summary || "-"}</td>
              <td className="px-1 py-1.5 text-center">
                <select
                  value={tc.status}
                  onChange={(e) => updateStatus(tc.id, e.target.value as TcStatus)}
                  className={`w-full cursor-pointer rounded px-1 py-0.5 text-[10px] font-bold ${statusColor[tc.status as TcStatus]}`}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MockTab({
  projectId,
  userId,
  initialTestCases,
}: {
  projectId: string;
  userId?: string;
  initialTestCases?: TestCase[];
}) {
  const [showTc, setShowTc] = useState(true);
  const MockComponent = mockMap[projectId];

  if (!MockComponent) {
    return <div className="text-gray-400">이 프로젝트의 테스트 대상 화면이 준비되지 않았습니다.</div>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2">
          <p className="text-xs text-blue-700">
            화면을 직접 조작하며 TC 항목을 하나씩 확인하세요.
          </p>
        </div>
        {userId && initialTestCases && (
          <button
            onClick={() => setShowTc(!showTc)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              showTc ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {showTc ? "TC 패널 숨기기" : "TC 패널 보기"}
          </button>
        )}
      </div>

      <div className={`flex gap-4 ${showTc && userId ? "" : ""}`}>
        {/* 목업 영역 */}
        <div className={`${showTc && userId ? "flex-1" : "w-full"}`}>
          <MockComponent />
        </div>

        {/* TC 사이드 패널 */}
        {showTc && userId && initialTestCases && (
          <div className="w-[380px] shrink-0 rounded-lg border bg-white shadow-sm">
            <div className="border-b bg-gray-50 px-3 py-2">
              <h3 className="text-sm font-semibold text-gray-700">TC 목록</h3>
            </div>
            <div className="h-[600px]">
              <TcSidePanel
                projectId={projectId}
                userId={userId}
                initialTestCases={initialTestCases}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
