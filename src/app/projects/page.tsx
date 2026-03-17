import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/supabase/actions";
import type { LearningProject } from "@/types/database";
import ProjectList from "./project-list";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 모든 쿼리를 병렬로 실행
  const [
    { data: projects },
    { data: tcCounts },
    { data: bugCounts },
    { data: recentTcs },
    { data: recentBugs },
  ] = await Promise.all([
    supabase
      .from("learning_projects")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: true }),
    supabase
      .from("test_cases")
      .select("project_id")
      .eq("user_id", user.id),
    supabase
      .from("bugs")
      .select("project_id")
      .eq("user_id", user.id),
    supabase
      .from("test_cases")
      .select("project_id, summary, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("bugs")
      .select("project_id, bug_code, issue_summary, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const progressMap: Record<string, { tc: number; bugs: number }> = {};
  (tcCounts ?? []).forEach((row: { project_id: string }) => {
    if (!progressMap[row.project_id]) progressMap[row.project_id] = { tc: 0, bugs: 0 };
    progressMap[row.project_id].tc++;
  });
  (bugCounts ?? []).forEach((row: { project_id: string }) => {
    if (!progressMap[row.project_id]) progressMap[row.project_id] = { tc: 0, bugs: 0 };
    progressMap[row.project_id].bugs++;
  });

  // 프로젝트 ID → 이름 맵
  const projectNameMap: Record<string, string> = {};
  ((projects as LearningProject[]) ?? []).forEach((p) => {
    projectNameMap[p.id] = p.title;
  });

  type ActivityItem = { type: "tc" | "bug"; projectId: string; projectName: string; label: string; time: string };
  const activities: ActivityItem[] = [];

  (recentTcs ?? []).forEach((tc: { project_id: string; summary: string; created_at: string }) => {
    activities.push({
      type: "tc",
      projectId: tc.project_id,
      projectName: projectNameMap[tc.project_id] ?? "",
      label: `TC 작성: ${tc.summary || "새 테스트 케이스"}`,
      time: tc.created_at,
    });
  });

  (recentBugs ?? []).forEach((bug: { project_id: string; bug_code: string; issue_summary: string; created_at: string }) => {
    activities.push({
      type: "bug",
      projectId: bug.project_id,
      projectName: projectNameMap[bug.project_id] ?? "",
      label: `${bug.bug_code} 등록: ${bug.issue_summary}`,
      time: bug.created_at,
    });
  });

  // 시간순 정렬 후 최근 5개
  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  const recentActivities = activities.slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/projects" className="text-xl font-bold">
            QASupport
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">학습 프로젝트</h2>
        <p className="mt-1 text-sm text-gray-400">
          QA 실습을 시작할 프로젝트를 선택하세요
        </p>

        <ProjectList
          projects={(projects as LearningProject[]) ?? []}
          progressMap={progressMap}
          recentActivities={recentActivities}
        />
      </div>
    </main>
  );
}
