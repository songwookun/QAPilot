"use client";

import { useState } from "react";

type SortKey = "name" | "grade" | "acquiredAt" | "quantity";
type SortOrder = "asc" | "desc";
type Category = "전체" | "장비" | "소비" | "재료" | "기타";

interface InventoryItem {
  id: number;
  name: string;
  grade: number;
  category: Category;
  quantity: number;
  acquiredAt: string;
}

const initialItems: InventoryItem[] = [
  { id: 1, name: "전설의 검", grade: 5, category: "장비", quantity: 1, acquiredAt: "2026-03-01" },
  { id: 2, name: "체력 포션", grade: 1, category: "소비", quantity: 50, acquiredAt: "2026-03-10" },
  { id: 3, name: "마나 포션", grade: 1, category: "소비", quantity: 30, acquiredAt: "2026-03-10" },
  { id: 4, name: "철광석", grade: 2, category: "재료", quantity: 15, acquiredAt: "2026-03-05" },
  { id: 5, name: "수호의 방패", grade: 4, category: "장비", quantity: 1, acquiredAt: "2026-03-08" },
  { id: 6, name: "이동 속도 부츠", grade: 3, category: "장비", quantity: 1, acquiredAt: "2026-03-02" },
  { id: 7, name: "나무 조각", grade: 1, category: "재료", quantity: 99, acquiredAt: "2026-03-03" },
  { id: 8, name: "열쇠", grade: 2, category: "기타", quantity: 3, acquiredAt: "2026-03-09" },
];

const gradeLabel = ["", "일반", "고급", "희귀", "영웅", "전설"];
const gradeColor = ["", "text-gray-600", "text-green-600", "text-blue-600", "text-purple-600", "text-orange-600"];

export default function InventoryMock() {
  const [items] = useState<InventoryItem[]>(initialItems);
  const [sortKey, setSortKey] = useState<SortKey>("acquiredAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filter, setFilter] = useState<Category>("전체");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }

  function getSorted(list: InventoryItem[]) {
    return [...list].sort((a, b) => {
      let cmp = 0;

      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "grade":
          cmp = a.grade - b.grade;
          break;
        case "quantity":
          // [의도적 버그] 수량순 정렬이 반대로 동작함
          cmp = b.quantity - a.quantity;
          if (sortOrder === "desc") cmp = a.quantity - b.quantity;
          return cmp;
        case "acquiredAt":
          cmp = a.acquiredAt.localeCompare(b.acquiredAt);
          break;
      }

      // 동일 조건 시 획득일 2차 정렬
      if (cmp === 0 && sortKey !== "acquiredAt") {
        cmp = a.acquiredAt.localeCompare(b.acquiredAt);
      }

      return sortOrder === "asc" ? cmp : -cmp;
    });
  }

  const filtered = filter === "전체" ? items : items.filter((item) => item.category === filter);
  const sorted = getSorted(filtered);

  const categories: Category[] = ["전체", "장비", "소비", "재료", "기타"];
  const categoryCounts: Record<string, number> = {};
  categories.forEach((cat) => {
    categoryCounts[cat] = cat === "전체" ? items.length : items.filter((i) => i.category === cat).length;
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* 필터 */}
      <div className="flex items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat} ({categoryCounts[cat]})
          </button>
        ))}
        {filter !== "전체" && (
          <button
            onClick={() => setFilter("전체")}
            className="ml-2 text-xs text-gray-400 hover:text-gray-600"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* 정렬 + 현재 정렬 기준 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">정렬:</span>
          {(
            [
              { key: "name", label: "이름순" },
              { key: "grade", label: "등급순" },
              { key: "acquiredAt", label: "획득일순" },
              { key: "quantity", label: "수량순" },
            ] as { key: SortKey; label: string }[]
          ).map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSort(opt.key)}
              disabled={filtered.length === 0}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                sortKey === opt.key
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              } disabled:opacity-50`}
            >
              {opt.label} {sortKey === opt.key && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400">
          {filtered.length}개 아이템
        </span>
      </div>

      {/* 인벤토리 테이블 */}
      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm font-medium text-gray-700">
              <th className="border-r px-3 py-2.5 text-left">아이템명</th>
              <th className="w-[80px] border-r px-3 py-2.5 text-center">등급</th>
              <th className="w-[80px] border-r px-3 py-2.5 text-center">분류</th>
              <th className="w-[60px] border-r px-3 py-2.5 text-center">수량</th>
              <th className="w-[100px] px-3 py-2.5 text-center">획득일</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                  해당 카테고리에 아이템이 없습니다
                </td>
              </tr>
            ) : (
              sorted.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50/50">
                  <td className="border-r px-3 py-2 text-sm font-medium">{item.name}</td>
                  <td className={`border-r px-3 py-2 text-center text-xs font-bold ${gradeColor[item.grade]}`}>
                    {gradeLabel[item.grade]}
                  </td>
                  <td className="border-r px-3 py-2 text-center text-xs text-gray-500">{item.category}</td>
                  <td className="border-r px-3 py-2 text-center text-sm">{item.quantity}</td>
                  <td className="px-3 py-2 text-center text-xs text-gray-400">{item.acquiredAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="text-sm font-semibold text-yellow-800">힌트</h3>
        <p className="mt-1 text-xs text-yellow-700">
          이 목업에는 의도적인 버그가 포함되어 있습니다. 기획서의 요구사항/예외사항과 비교하며 정렬/필터링을 테스트해보세요.
        </p>
      </div>
    </div>
  );
}
