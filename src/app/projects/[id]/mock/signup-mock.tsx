"use client";

import { useState } from "react";

export default function SignupMock() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [registered, setRegistered] = useState(false);

  const takenEmails = ["test@test.com", "admin@test.com"];

  function validateEmail(value: string) {
    setEmail(value);
    setEmailChecked(false);
    if (value && !value.includes("@")) {
      setEmailError("올바른 이메일 형식을 입력해주세요");
    } else {
      setEmailError("");
    }
  }

  function checkEmailDuplicate() {
    if (!email || !email.includes("@")) {
      setEmailError("올바른 이메일 형식을 입력해주세요");
      return;
    }
    if (takenEmails.includes(email)) {
      setEmailError("이미 사용 중인 이메일입니다");
      setEmailChecked(false);
    } else {
      setEmailError("");
      setEmailChecked(true);
    }
  }

  function validatePassword(value: string) {
    setPassword(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    if (value && (value.length < 8 || !hasLetter || !hasNumber)) {
      setPasswordError("비밀번호는 8자 이상, 영문+숫자 조합이어야 합니다");
    } else {
      setPasswordError("");
    }
  }

  function validateNickname(value: string) {
    setNickname(value);
    // [의도적 버그] 닉네임 10자 초과해도 에러가 안 뜸
    if (value && value.length < 2) {
      setNicknameError("닉네임은 2자 이상이어야 합니다");
    } else {
      setNicknameError("");
    }
  }

  const passwordMatch = password && passwordConfirm && password === passwordConfirm;
  const passwordMismatch = passwordConfirm && password !== passwordConfirm;

  // [의도적 버그] 이메일 중복 확인 안 해도 가입 버튼이 활성화됨
  const canSubmit =
    email &&
    password &&
    passwordConfirm &&
    nickname &&
    !emailError &&
    !passwordError &&
    !nicknameError &&
    passwordMatch;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!canSubmit) return;

    setRegistered(true);
    setMessage({ type: "success", text: "회원가입이 완료되었습니다!" });
  }

  if (registered) {
    return (
      <div className="mx-auto max-w-sm rounded-lg border bg-white p-8 text-center">
        <h2 className="text-xl font-bold">가입 완료</h2>
        <p className="mt-2 text-gray-500">환영합니다, {nickname}님!</p>
        <button
          onClick={() => {
            setRegistered(false);
            setEmail("");
            setPassword("");
            setPasswordConfirm("");
            setNickname("");
            setEmailChecked(false);
            setMessage(null);
          }}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          처음으로
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <h2 className="text-center text-xl font-bold">회원가입</h2>
        <p className="mt-1 text-center text-xs text-gray-400">모바일 회원가입 목업</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="block flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={checkEmailDuplicate}
                className="shrink-0 rounded-md bg-gray-200 px-3 py-2 text-xs hover:bg-gray-300"
              >
                중복 확인
              </button>
            </div>
            {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
            {emailChecked && <p className="mt-1 text-xs text-green-500">사용 가능한 이메일입니다</p>}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              placeholder="8자 이상, 영문+숫자"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {passwordError && <p className="mt-1 text-xs text-red-500">{passwordError}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {passwordMatch && <p className="mt-1 text-xs text-green-500">비밀번호가 일치합니다</p>}
            {passwordMismatch && <p className="mt-1 text-xs text-red-500">비밀번호가 일치하지 않습니다</p>}
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => validateNickname(e.target.value)}
              placeholder="2~10자"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {nicknameError && <p className="mt-1 text-xs text-red-500">{nicknameError}</p>}
          </div>

          {message && (
            <p className={`text-sm ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
          >
            회원가입
          </button>
        </form>
      </div>

      <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="text-sm font-semibold text-yellow-800">힌트</h3>
        <p className="mt-1 text-xs text-yellow-700">
          이 목업에는 의도적인 버그가 포함되어 있습니다. 기획서의 요구사항/예외사항과 비교하며 테스트해보세요.
          이미 사용 중인 이메일: test@test.com, admin@test.com
        </p>
      </div>
    </div>
  );
}
