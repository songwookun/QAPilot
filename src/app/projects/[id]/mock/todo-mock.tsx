"use client";

import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: "높음" | "중간" | "낮음";
}

const priorityColor = {
  높음: "bg-red-100 text-red-700",
  중간: "bg-yellow-100 text-yellow-700",
  낮음: "bg-gray-100 text-gray-600",
};

let nextId = 5;

const initialTodos: Todo[] = [
  { id: 1, text: "회의 자료 준비", completed: false, priority: "높음" },
  { id: 2, text: "이메일 확인", completed: true, priority: "중간" },
  { id: 3, text: "보고서 작성", completed: false, priority: "높음" },
  { id: 4, text: "팀 점심 예약", completed: true, priority: "낮음" },
];

export default function TodoMock() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Todo["priority"]>("중간");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  function addTodo() {
    if (!input.trim()) return;
    setTodos([...todos, { id: nextId++, text: input.trim(), completed: false, priority }]);
    setInput("");
  }

  function toggleTodo(id: number) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id: number) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  // 의도적 버그: 완료 삭제가 '미완료' 항목을 삭제함
  function clearCompleted() {
    setTodos(todos.filter((t) => t.completed));  // 버그: completed가 true인 것만 남김 (반대)
  }

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  // 의도적 버그: 완료 카운트에 미완료 항목 수를 표시
  const completedCount = todos.filter((t) => !t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white shadow-sm">
      {/* 헤더 */}
      <div className="rounded-t-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <h2 className="text-lg font-bold text-white">할 일 관리</h2>
        <p className="mt-0.5 text-sm text-purple-200">
          완료: {completedCount} / {totalCount}
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="border-b p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="할 일을 입력하세요"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Todo["priority"])}
            className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
          >
            <option value="높음">높음</option>
            <option value="중간">중간</option>
            <option value="낮음">낮음</option>
          </select>
          <button
            onClick={addTodo}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            추가
          </button>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex border-b">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 text-xs font-medium transition ${
              filter === f
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {f === "all" ? "전체" : f === "active" ? "진행중" : "완료"}
          </button>
        ))}
      </div>

      {/* 할일 목록 */}
      <div className="max-h-[350px] divide-y overflow-auto">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">
            항목이 없습니다.
          </div>
        ) : (
          filtered.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                  todo.completed
                    ? "border-purple-500 bg-purple-500"
                    : "border-gray-300 hover:border-purple-400"
                }`}
              >
                {todo.completed && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 text-sm ${
                  todo.completed ? "text-gray-400 line-through" : "text-gray-800"
                }`}
              >
                {todo.text}
              </span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${priorityColor[todo.priority]}`}>
                {todo.priority}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-300 hover:text-red-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* 하단 */}
      <div className="flex items-center justify-between border-t px-4 py-3">
        <span className="text-xs text-gray-400">
          {todos.filter((t) => !t.completed).length}개 남음
        </span>
        <button
          onClick={clearCompleted}
          className="text-xs text-red-500 hover:text-red-700"
        >
          완료 항목 삭제
        </button>
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
