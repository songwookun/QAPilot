"use client";

import { useState } from "react";

type TabKey = "main" | "notice" | "faq" | "mypage";

const tabs: { key: TabKey; label: string }[] = [
  { key: "main", label: "메인" },
  { key: "notice", label: "공지사항" },
  { key: "faq", label: "FAQ" },
  { key: "mypage", label: "마이페이지" },
];

const notices = [
  { id: 1, title: "[공지] 서비스 정기 점검 안내 (3/15)", date: "2026-03-10", important: true },
  { id: 2, title: "[공지] 개인정보 처리방침 변경 안내", date: "2026-03-08", important: true },
  { id: 3, title: "[이벤트] 봄맞이 출석 체크 이벤트", date: "2026-03-05", important: false },
  { id: 4, title: "[업데이트] v2.1.0 업데이트 안내", date: "2026-03-01", important: false },
  { id: 5, title: "[공지] 2월 이용약관 변경 안내", date: "2026-02-25", important: false },
];

const faqs = [
  { q: "비밀번호를 잊었어요. 어떻게 하나요?", a: "로그인 화면의 '비밀번호 찾기'를 클릭하여 등록된 이메일로 재설정 링크를 받을 수 있습니다." },
  { q: "회원 탈퇴는 어떻게 하나요?", a: "마이페이지 > 설정 > 회원 탈퇴에서 진행할 수 있습니다." },
  { q: "결제 수단을 변경하고 싶어요.", a: "마이페이지 > 결제 관리에서 결제 수단을 추가/변경할 수 있습니다." },
];

export default function PortalMock() {
  const [activeTab, setActiveTab] = useState<TabKey>("main");
  // 의도적 버그: 공지사항 탭 클릭 시 실제로는 메인 화면이 보임
  const [displayTab, setDisplayTab] = useState<TabKey>("main");

  function handleTabClick(key: TabKey) {
    setActiveTab(key);
    if (key === "notice") {
      // 의도적 버그: 공지사항 탭을 눌러도 displayTab이 "main"으로 설정됨
      setDisplayTab("main");
    } else {
      setDisplayTab(key);
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl border bg-white shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b bg-gray-900 px-6 py-3 rounded-t-xl">
        <span className="text-lg font-bold text-white">MyPortal</span>
        <span className="text-sm text-gray-400">홍길동님 환영합니다</span>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="min-h-[400px] p-6">
        {/* 메인 화면 */}
        {displayTab === "main" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">대시보드</h3>
              <p className="mt-1 text-sm text-gray-500">오늘의 주요 소식을 확인하세요.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="mt-1 text-xs text-blue-500">새 알림</p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-2xl font-bold text-green-600">5</p>
                <p className="mt-1 text-xs text-green-500">진행중</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">28</p>
                <p className="mt-1 text-xs text-purple-500">완료</p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="text-sm font-semibold text-gray-700">최근 활동</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  프로젝트 A 리뷰 완료
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  월간 보고서 제출
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  팀 미팅 참여
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* 공지사항 */}
        {displayTab === "notice" && (
          <div>
            <h3 className="text-lg font-bold text-gray-900">공지사항</h3>
            <div className="mt-4 divide-y rounded-lg border">
              {notices.map((n) => (
                <div key={n.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    {n.important && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">중요</span>
                    )}
                    <span className="text-sm text-gray-800">{n.title}</span>
                  </div>
                  <span className="text-xs text-gray-400">{n.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {displayTab === "faq" && (
          <div>
            <h3 className="text-lg font-bold text-gray-900">자주 묻는 질문</h3>
            <div className="mt-4 space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <p className="text-sm font-semibold text-gray-800">Q. {faq.q}</p>
                  <p className="mt-2 text-sm text-gray-600">A. {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 마이페이지 */}
        {displayTab === "mypage" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">마이페이지</h3>
            <div className="rounded-lg border p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-gray-500">
                  홍
                </div>
                <div>
                  <p className="font-semibold text-gray-900">홍길동</p>
                  <p className="text-sm text-gray-500">hong@example.com</p>
                  <p className="text-xs text-gray-400">가입일: 2025-01-15</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="rounded-lg border p-3 text-left text-sm hover:bg-gray-50">
                <span className="font-medium text-gray-700">내 활동 내역</span>
              </button>
              <button className="rounded-lg border p-3 text-left text-sm hover:bg-gray-50">
                <span className="font-medium text-gray-700">설정</span>
              </button>
              <button className="rounded-lg border p-3 text-left text-sm hover:bg-gray-50">
                <span className="font-medium text-gray-700">결제 관리</span>
              </button>
              <button className="rounded-lg border p-3 text-left text-sm hover:bg-gray-50">
                <span className="font-medium text-gray-700">고객센터</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="text-sm font-semibold text-yellow-800">힌트</h3>
        <p className="mt-1 text-xs text-yellow-700">
          이 목업에는 의도적인 버그가 포함되어 있습니다. 기획서의 요구사항/예외사항과 비교하며 테스트해보세요.
        </p>
      </div>
    </div>
  );
}
