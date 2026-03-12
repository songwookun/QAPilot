import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-xl font-bold">QAPilot</span>
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <Link
                href="/projects"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                프로젝트 목록
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 sm:px-4"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:px-4"
                >
                  시작하기
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-20">
        <div className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-700">
          QA 실무 학습 플랫폼
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          QA, 직접 해봐야<br />실력이 됩니다
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500 sm:mt-5 sm:text-lg">
          실제 서비스와 유사한 목업에서 버그를 찾고, TC를 작성하고,
          버그 리포트를 발급하는 QA 실무 전체 흐름을 경험하세요.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center">
          <Link
            href={user ? "/projects" : "/auth/signup"}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition sm:w-auto"
          >
            무료로 시작하기
          </Link>
          <a
            href="#how-it-works"
            className="w-full rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 transition sm:w-auto"
          >
            어떻게 진행되나요?
          </a>
        </div>
        <p className="mt-4 text-[11px] text-gray-400">
          원활한 학습을 위해 PC 환경에서의 이용을 권장합니다.
        </p>
      </section>

      {/* 학습 흐름 */}
      <section id="how-it-works" className="border-t bg-white py-12 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            QA 실무, 이렇게 학습해요
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            실무와 동일한 흐름으로 단계별로 진행합니다
          </p>

          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "기획서 분석",
                desc: "프로젝트의 기획서를 읽고 요구사항과 예외사항을 파악합니다.",
                color: "bg-blue-600",
              },
              {
                step: "02",
                title: "TC 작성",
                desc: "기획서 기반으로 테스트 케이스를 작성합니다. 대분류/중분류/소분류로 체계적으로 정리하세요.",
                color: "bg-indigo-600",
              },
              {
                step: "03",
                title: "테스트 진행",
                desc: "의도적 버그가 포함된 목업을 직접 조작하며 TC를 하나씩 확인합니다.",
                color: "bg-violet-600",
              },
              {
                step: "04",
                title: "버그 리포트",
                desc: "발견한 버그를 리포트로 작성합니다. 우선순위, 재현경로, 기대결과까지 실무 양식 그대로.",
                color: "bg-purple-600",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border bg-gray-50 p-5 sm:p-6">
                <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${item.color} text-xs font-bold text-white`}>
                  {item.step}
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900 sm:mt-4">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500 sm:mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 프로젝트 카테고리 소개 */}
      <section className="border-t py-12 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            다양한 분야의 QA를 경험하세요
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            웹, 앱, 게임 등 실무에서 만날 수 있는 프로젝트들을 준비했습니다
          </p>

          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6">
            <div className="rounded-xl border bg-white p-5 text-center sm:p-6">
              <span className="text-3xl sm:text-4xl">🌐</span>
              <h3 className="mt-2 text-base font-semibold text-gray-900 sm:mt-3">웹</h3>
              <p className="mt-1.5 text-sm text-gray-500 sm:mt-2">로그인, 장바구니, 포털 등 웹 서비스 QA</p>
            </div>
            <div className="rounded-xl border bg-white p-5 text-center sm:p-6">
              <span className="text-3xl sm:text-4xl">📱</span>
              <h3 className="mt-2 text-base font-semibold text-gray-900 sm:mt-3">앱</h3>
              <p className="mt-1.5 text-sm text-gray-500 sm:mt-2">회원가입, 할일 관리, 송금 등 모바일 앱 QA</p>
            </div>
            <div className="rounded-xl border bg-white p-5 text-center sm:p-6">
              <span className="text-3xl sm:text-4xl">🎮</span>
              <h3 className="mt-2 text-base font-semibold text-gray-900 sm:mt-3">게임</h3>
              <p className="mt-1.5 text-sm text-gray-500 sm:mt-2">상점, 인벤토리, 전투 밸런스 등 게임 QA</p>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 */}
      <section className="border-t bg-white py-12 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            QAPilot만의 특징
          </h2>
          <div className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-3 sm:gap-8">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <span className="text-xl">🐛</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 sm:mt-4">의도적 버그</h3>
              <p className="mt-1.5 text-sm text-gray-500 sm:mt-2">
                각 목업에 실무에서 발생할 수 있는 버그가 숨겨져 있어요
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <span className="text-xl">📋</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 sm:mt-4">실무 양식</h3>
              <p className="mt-1.5 text-sm text-gray-500 sm:mt-2">
                TC, 버그 리포트 모두 현업에서 쓰는 양식 그대로
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 sm:mt-4">QA 리포트</h3>
              <p className="mt-1.5 text-sm text-gray-500 sm:mt-2">
                내 QA 결과를 리포트로 저장하고 포트폴리오에 활용하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t px-4 py-12 text-center sm:py-20">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          지금 바로 QA를 시작해보세요
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          회원가입 후 바로 프로젝트를 선택하고 학습을 시작할 수 있습니다
        </p>
        <Link
          href={user ? "/projects" : "/auth/signup"}
          className="mt-6 inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"
        >
          무료로 시작하기
        </Link>
      </section>

      {/* 푸터 */}
      <footer className="border-t bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-xs text-gray-400">QAPilot - QA 실무 학습 플랫폼</p>
          <p className="mt-1 text-[11px] text-gray-300">
            원활한 학습을 위해 PC 환경에서의 이용을 권장합니다.
          </p>
        </div>
      </footer>
    </main>
  );
}
