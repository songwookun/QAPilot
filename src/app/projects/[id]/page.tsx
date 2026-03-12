import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/supabase/actions";
import type { LearningProject, Spec, SpecFeature, TestCase, TestRun, Bug } from "@/types/database";
import TcTab from "./tc-cl-tab";
import MockTab from "./mock";
import BugTab from "./bug-tab";
import ResultTab from "./result-tab";

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "spec", tc: prefillTcId } = await searchParams as { tab?: string; tc?: string };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: project } = await supabase
    .from("learning_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    redirect("/projects");
  }

  const { data: spec } = await supabase
    .from("specs")
    .select("*")
    .eq("project_id", id)
    .single();

  const { data: testCases } = await supabase
    .from("test_cases")
    .select("*")
    .eq("project_id", id)
    .eq("user_id", user.id)
    .order("tc_number", { ascending: true });

  const { data: testRuns } = await supabase
    .from("test_runs")
    .select("*")
    .eq("project_id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: bugs } = await supabase
    .from("bugs")
    .select("*")
    .eq("project_id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const typedProject = project as LearningProject;
  const typedSpec = spec as Spec | null;

  const tabs = [
    { key: "spec", label: "기획서" },
    { key: "tc", label: "TC" },
    { key: "mock", label: "테스트 진행" },
    { key: "bug", label: "버그 리포트" },
    { key: "result", label: "QA 결과" },
  ];

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

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* 프로젝트 헤더 */}
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            ← 목록
          </Link>
          <h2 className="text-2xl font-bold">{typedProject.title}</h2>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mt-6 flex gap-1 border-b">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={`/projects/${id}?tab=${t.key}`}
              className={`px-4 py-2.5 text-sm font-medium transition ${
                tab === t.key
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="mt-6">
          {tab === "spec" && <SpecTab spec={typedSpec} />}
          {tab === "mock" && (
            <MockTab
              projectId={id}
              userId={user.id}
              initialTestCases={(testCases as TestCase[]) ?? []}
            />
          )}
          {tab === "tc" && (
            <TcTab
              projectId={id}
              userId={user.id}
              initialTestCases={(testCases as TestCase[]) ?? []}
              spec={typedSpec}
            />
          )}
{tab === "bug" && (
            <BugTab
              projectId={id}
              userId={user.id}
              initialTestCases={(testCases as TestCase[]) ?? []}
              initialBugs={(bugs as Bug[]) ?? []}
              prefillTestCaseId={prefillTcId ?? null}
            />
          )}
          {tab === "result" && (
            <ResultTab
              projectId={id}
              projectTitle={typedProject.title}
              testCases={(testCases as TestCase[]) ?? []}
              testRuns={(testRuns as TestRun[]) ?? []}
              bugs={(bugs as Bug[]) ?? []}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function SpecTab({ spec }: { spec: Spec | null }) {
  if (!spec) {
    return <div className="text-gray-400">기획서가 등록되지 않았습니다.</div>;
  }

  const features: SpecFeature[] = spec.content?.features ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{spec.title}</h3>
        {spec.version && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {spec.version}
          </span>
        )}
      </div>

      {features.map((feature, index) => (
        <div
          key={index}
          className="rounded-lg border bg-white p-5 shadow-sm"
        >
          <h4 className="text-base font-semibold">{feature.name}</h4>
          <p className="mt-1 text-sm text-gray-500">{feature.description}</p>

          {feature.requirements.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700">요구사항</h5>
              <ul className="mt-2 space-y-1">
                {feature.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feature.exceptions.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700">예외사항</h5>
              <ul className="mt-2 space-y-1">
                {feature.exceptions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                    {exc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feature.notes && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700">참고</h5>
              <p className="mt-1 text-sm text-gray-500">{feature.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
