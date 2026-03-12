"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TestCase, TcStatus, Spec, SpecFeature } from "@/types/database";

const statusOptions: TcStatus[] = ["Test", "OK", "Fail"];

const statusColor: Record<TcStatus, string> = {
  Test: "bg-yellow-400 text-black",
  OK: "bg-green-500 text-white",
  Fail: "bg-red-500 text-white",
};

interface EditingCell {
  id: string;
  field: keyof TestCase;
}

// ─── 기획서 패널 ───

function SpecPanel({ spec }: { spec: Spec }) {
  const [openFeatures, setOpenFeatures] = useState<Set<number>>(new Set([0]));

  const features: SpecFeature[] = spec.content?.features ?? [];

  function toggleFeature(index: number) {
    setOpenFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">{spec.title}</h4>
        {spec.version && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
            {spec.version}
          </span>
        )}
      </div>

      {features.map((feature, index) => (
        <div key={index} className="rounded-md border">
          <button
            onClick={() => toggleFeature(index)}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>{feature.name}</span>
            <span className="text-xs text-gray-400">
              {openFeatures.has(index) ? "▲" : "▼"}
            </span>
          </button>

          {openFeatures.has(index) && (
            <div className="border-t px-3 py-2 text-xs">
              <p className="text-gray-500">{feature.description}</p>

              {feature.requirements.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-gray-600">요구사항</p>
                  <ul className="mt-1 space-y-0.5">
                    {feature.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-gray-600">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feature.exceptions.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-gray-600">예외사항</p>
                  <ul className="mt-1 space-y-0.5">
                    {feature.exceptions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-gray-600">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-orange-500" />
                        {exc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feature.notes && (
                <div className="mt-2">
                  <p className="font-medium text-gray-600">참고</p>
                  <p className="mt-0.5 text-gray-500">{feature.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── TC 테이블 ───

export default function TcTab({
  projectId,
  userId,
  initialTestCases,
  spec,
}: {
  projectId: string;
  userId: string;
  initialTestCases: TestCase[];
  spec?: Spec | null;
}) {
  const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showSpec, setShowSpec] = useState(true);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

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

  async function addRow() {
    const supabase = createClient();
    const nextNumber = testCases.length > 0
      ? Math.max(...testCases.map((tc) => tc.tc_number)) + 1
      : 1;

    const { error } = await supabase.from("test_cases").insert({
      project_id: projectId,
      user_id: userId,
      tc_number: nextNumber,
      major_category: "",
      medium_category: "",
      minor_category: "",
      summary: "",
      status: "Test",
      note: "",
    });
    if (error) {
      alert("행 추가 실패: " + error.message);
      return;
    }
    refresh();
  }

  async function deleteRow(id: string) {
    if (!confirm("이 행을 삭제하시겠습니까?")) return;
    const supabase = createClient();
    await supabase.from("test_cases").delete().eq("id", id);
    refresh();
  }

  function startEdit(tc: TestCase, field: keyof TestCase) {
    if (field === "status") return;
    setEditingCell({ id: tc.id, field });
    setEditValue(String(tc[field] ?? ""));
  }

  async function saveEdit() {
    if (!editingCell) return;
    const supabase = createClient();
    await supabase
      .from("test_cases")
      .update({ [editingCell.field]: editValue })
      .eq("id", editingCell.id);
    setEditingCell(null);
    refresh();
  }

  async function updateStatus(id: string, status: TcStatus) {
    const supabase = createClient();
    await supabase.from("test_cases").update({ status }).eq("id", id);
    refresh();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    }
    if (e.key === "Escape") {
      setEditingCell(null);
    }
  }

  function renderCell(tc: TestCase, field: keyof TestCase) {
    const isEditing = editingCell?.id === tc.id && editingCell?.field === field;
    const value = String(tc[field] ?? "");

    if (isEditing) {
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          className="w-full border-0 bg-blue-50 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    }

    return (
      <div
        onClick={() => startEdit(tc, field)}
        className="min-h-[28px] cursor-text px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
      >
        {value || <span className="text-gray-300">-</span>}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Test Case</h3>
        <div className="flex gap-2">
          {spec && (
            <button
              onClick={() => setShowSpec(!showSpec)}
              className={`rounded-md px-3 py-2 text-xs font-medium ${
                showSpec ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {showSpec ? "기획서 숨기기" : "기획서 보기"}
            </button>
          )}
          <button
            onClick={addRow}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + 행 추가
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* TC 테이블 */}
        <div className="flex-1 overflow-x-auto">
          <div className="rounded-lg border shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm font-medium text-gray-700">
                  <th className="w-12 border-r px-2 py-2.5 text-center">No.</th>
                  <th className="w-[120px] border-r px-2 py-2.5 text-left">대분류</th>
                  <th className="w-[120px] border-r px-2 py-2.5 text-left">중분류</th>
                  <th className="w-[100px] border-r px-2 py-2.5 text-left">소분류</th>
                  <th className="min-w-[250px] border-r px-2 py-2.5 text-left">요약</th>
                  <th className="w-[80px] border-r px-2 py-2.5 text-center">확인</th>
                  <th className="min-w-[150px] border-r px-2 py-2.5 text-left">비고</th>
                  <th className="w-10 px-2 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {testCases.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                      행 추가 버튼을 눌러 TC를 작성하세요
                    </td>
                  </tr>
                ) : (
                  testCases.map((tc) => (
                    <tr key={tc.id} className="border-t hover:bg-gray-50/50">
                      <td className="border-r px-2 py-1 text-center text-sm font-medium text-gray-500">
                        {tc.tc_number}
                      </td>
                      <td className="border-r p-0">{renderCell(tc, "major_category")}</td>
                      <td className="border-r p-0">{renderCell(tc, "medium_category")}</td>
                      <td className="border-r p-0">{renderCell(tc, "minor_category")}</td>
                      <td className="border-r p-0">{renderCell(tc, "summary")}</td>
                      <td className="border-r px-1 py-1 text-center">
                        <select
                          value={tc.status}
                          onChange={(e) => updateStatus(tc.id, e.target.value as TcStatus)}
                          className={`w-full cursor-pointer rounded px-1.5 py-0.5 text-xs font-bold ${statusColor[tc.status as TcStatus]}`}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="border-r p-0">{renderCell(tc, "note")}</td>
                      <td className="px-1 py-1 text-center">
                        <button
                          onClick={() => deleteRow(tc.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="삭제"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            셀을 클릭하면 바로 편집할 수 있습니다. Enter로 저장, Esc로 취소.
          </div>
        </div>

        {/* 기획서 사이드 패널 */}
        {showSpec && spec && (
          <div className="w-[340px] shrink-0 rounded-lg border bg-white shadow-sm">
            <div className="border-b bg-gray-50 px-3 py-2">
              <h3 className="text-sm font-semibold text-gray-700">기획서</h3>
            </div>
            <div className="h-[600px] overflow-auto p-3">
              <SpecPanel spec={spec} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
