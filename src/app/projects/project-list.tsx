"use client";

import { useState } from "react";
import Link from "next/link";
import type { LearningProject, ProjectCategory } from "@/types/database";

const categories: { key: ProjectCategory; label: string; icon: string }[] = [
  { key: "웹", label: "웹", icon: "🌐" },
  { key: "앱", label: "앱", icon: "📱" },
  { key: "게임", label: "게임", icon: "🎮" },
];

const categoryStyle: Record<ProjectCategory, { active: string; inactive: string }> = {
  웹: {
    active: "border-indigo-500 bg-indigo-50 text-indigo-700",
    inactive: "border-gray-200 bg-white text-gray-500 hover:border-indigo-300 hover:text-indigo-600",
  },
  앱: {
    active: "border-cyan-500 bg-cyan-50 text-cyan-700",
    inactive: "border-gray-200 bg-white text-gray-500 hover:border-cyan-300 hover:text-cyan-600",
  },
  게임: {
    active: "border-violet-500 bg-violet-50 text-violet-700",
    inactive: "border-gray-200 bg-white text-gray-500 hover:border-violet-300 hover:text-violet-600",
  },
};

const categoryAccent: Record<ProjectCategory, string> = {
  웹: "group-hover:text-indigo-600",
  앱: "group-hover:text-cyan-600",
  게임: "group-hover:text-violet-600",
};

const difficultyColor: Record<string, string> = {
  초급: "border border-gray-200 bg-white text-gray-500",
  중급: "border border-amber-200 bg-amber-50 text-amber-600",
  고급: "border border-rose-200 bg-rose-50 text-rose-500",
};

const qaTips = [
  "정상 케이스보다 예외 케이스에서 버그가 더 많이 발생합니다.",
  "입력 필드가 있다면 공백, 특수문자, 매우 긴 문자열을 항상 테스트해보세요.",
  "숫자 제한이 있다면 항상 경계값(최소값, 최대값)을 확인하세요.",
  "버튼은 한 번만 누른다고 가정하지 말고 연속 클릭도 테스트하세요.",
  "같은 기능을 여러 번 반복 실행하면 예상하지 못한 버그가 발생할 수 있습니다.",
  "상태가 바뀌는 기능은 모든 상태에서 테스트해야 합니다.",
  "로그인, 결제, 저장 기능은 네트워크가 끊겼을 때도 확인해야 합니다.",
  "기능이 정상 동작하더라도 데이터가 제대로 저장되는지 확인해야 합니다.",
  "에러 메시지는 사용자에게 이해 가능한 문장인지 확인해야 합니다.",
  "기능을 테스트할 때는 항상 '사용자가 이상하게 사용하면 어떻게 될까?'를 생각하세요.",
  "QA는 UI가 아니라 시스템 동작을 검증하는 직무입니다.",
  "재현 경로가 명확하지 않은 버그 리포트는 개발자가 수정하기 어렵습니다.",
  "좋은 버그 리포트는 누구라도 동일하게 재현할 수 있어야 합니다.",
  "테스트 케이스는 기능을 이해하는 과정이기도 합니다.",
  "같은 기능이라도 다른 환경(브라우저, OS, 모바일)에서 결과가 달라질 수 있습니다.",
  "QA는 버그를 찾는 직무가 아니라 제품 품질을 지키는 직무입니다.",
  "버그를 발견했다면 왜 발생했는지 추측해보는 습관이 중요합니다.",
  "기능이 정상처럼 보여도 데이터 흐름이 잘못된 경우가 많습니다.",
  "작은 UI 오류라도 사용자 경험에 큰 영향을 줄 수 있습니다.",
  "QA의 가장 중요한 능력은 '의심하는 사고방식'입니다.",
];

interface ProgressData {
  tc: number;
  bugs: number;
}

export interface ActivityItem {
  type: "tc" | "bug";
  projectId: string;
  projectName: string;
  label: string;
  time: string;
}

export default function ProjectList({
  projects,
  progressMap,
  recentActivities,
}: {
  projects: LearningProject[];
  progressMap: Record<string, ProgressData>;
  recentActivities: ActivityItem[];
}) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | null>(null);

  if (projects.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-400">
        아직 등록된 프로젝트가 없습니다.
      </div>
    );
  }

  const grouped: Record<ProjectCategory, LearningProject[]> = {
    웹: projects.filter((p) => p.category === "웹"),
    앱: projects.filter((p) => p.category === "앱"),
    게임: projects.filter((p) => p.category === "게임"),
  };

  function toggleCategory(cat: ProjectCategory) {
    setActiveCategory((prev) => (prev === cat ? null : cat));
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  }

  // 랜덤 팁 (날짜 기반으로 하루에 하나)
  const todayIndex = new Date().getDate() % qaTips.length;
  const tip = qaTips[todayIndex];

  return (
    <div className="mt-8">
      {/* 최근 활동 */}
      {recentActivities.length > 0 && (
        <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700">최근 활동</h3>
          <div className="mt-3 space-y-2.5">
            {recentActivities.map((activity, i) => (
              <Link
                key={i}
                href={`/projects/${activity.projectId}?tab=${activity.type === "tc" ? "tc" : "bug"}`}
                className="flex items-start gap-3 rounded-lg px-2 py-1.5 transition hover:bg-gray-50"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                    activity.type === "tc" ? "bg-blue-500" : "bg-red-500"
                  }`}
                >
                  {activity.type === "tc" ? "T" : "B"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800">{activity.label}</p>
                  <p className="text-xs text-gray-400">
                    {activity.projectName} · {timeAgo(activity.time)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 카테고리 토글 */}
      <div className="flex gap-3">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          const count = grouped[cat.key].length;

          return (
            <button
              key={cat.key}
              onClick={() => toggleCategory(cat.key)}
              className={`flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition-all ${
                isActive
                  ? categoryStyle[cat.key].active
                  : categoryStyle[cat.key].inactive
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  isActive ? "bg-white/70" : "bg-gray-100 text-gray-400"
                }`}
              >
                {count}
              </span>
              <svg
                className={`ml-1 h-4 w-4 transition-transform ${isActive ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* 프로젝트 카드 목록 */}
      {activeCategory && grouped[activeCategory].length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grouped[activeCategory].map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group relative rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${difficultyColor[project.difficulty] ?? ""}`}
                >
                  {project.difficulty}
                </span>
              </div>
              <h3 className={`mt-3 text-base font-semibold text-gray-900 ${categoryAccent[project.category]}`}>
                {project.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500 line-clamp-2">
                {project.summary}
              </p>
              {(() => {
                const p = progressMap[project.id];
                if (!p) return null;
                return (
                  <div className="mt-3 flex gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      TC {p.tc}개
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      버그 {p.bugs}개
                    </span>
                  </div>
                );
              })()}
              <div className="mt-4 flex items-center text-sm font-medium text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100">
                시작하기
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}

      {activeCategory && grouped[activeCategory].length === 0 && (
        <div className="mt-5 rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400">
          이 카테고리에 등록된 프로젝트가 없습니다.
        </div>
      )}

      {/* QA 실무 팁 */}
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-lg">💡</span>
          <div>
            <h4 className="text-sm font-semibold text-amber-800">오늘의 QA 팁</h4>
            <p className="mt-1 text-sm text-amber-700">{tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
