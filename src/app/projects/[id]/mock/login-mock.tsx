"use client";

import { useState } from "react";

export default function LoginMock() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [failCount, setFailCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (locked) {
      setMessage({ type: "error", text: "30초 후 다시 시도해주세요." });
      return;
    }

    // [의도적 버그] 이메일 미입력 시 메시지가 출력되지 않음
    if (!email) {
      // 버그: 메시지 없이 return
      return;
    }

    if (!password) {
      setMessage({ type: "error", text: "비밀번호를 입력해주세요" });
      return;
    }

    // 이메일 형식 검증
    if (!email.includes("@")) {
      setMessage({ type: "error", text: "올바른 이메일 형식을 입력해주세요" });
      return;
    }

    // 비밀번호 8자 이상
    if (password.length < 8) {
      setMessage({ type: "error", text: "비밀번호는 8자 이상이어야 합니다" });
      return;
    }

    // 테스트 계정
    if (email === "test@test.com" && password === "password123") {
      setLoggedIn(true);
      setMessage({ type: "success", text: "로그인 성공!" });
      setFailCount(0);
      return;
    }

    // 로그인 실패
    const newFailCount = failCount + 1;
    setFailCount(newFailCount);

    // [의도적 버그] 5회 실패 시 잠금이 걸리지만 카운트 표시가 안 됨
    if (newFailCount >= 5) {
      setLocked(true);
      setMessage({ type: "error", text: "30초 대기 후 다시 시도해주세요." });
      setTimeout(() => {
        setLocked(false);
        setFailCount(0);
      }, 30000);
      return;
    }

    // [의도적 버그] 존재하지 않는 계정일 때 잘못된 메시지 출력
    setMessage({ type: "error", text: "비밀번호가 일치하지 않습니다" });
  }

  function handleLogout() {
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    setMessage(null);
  }

  if (loggedIn) {
    return (
      <div className="mx-auto max-w-sm space-y-4 rounded-lg border bg-white p-8 text-center">
        <h2 className="text-xl font-bold">메인 페이지</h2>
        <p className="text-gray-500">환영합니다, {email}님!</p>
        <button
          onClick={handleLogout}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <h2 className="text-center text-xl font-bold">로그인</h2>
        <p className="mt-1 text-center text-sm text-gray-500">테스트 계정: test@test.com / password123</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={locked}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            로그인
          </button>
        </form>
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
