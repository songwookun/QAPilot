"use client";

import { useState } from "react";

interface GameItem {
  id: number;
  name: string;
  price: number;
  description: string;
  unique: boolean;
}

interface PurchaseLog {
  id: number;
  itemName: string;
  price: number;
  date: string;
}

const shopItems: GameItem[] = [
  { id: 1, name: "체력 포션", price: 100, description: "HP를 50 회복합니다", unique: false },
  { id: 2, name: "마나 포션", price: 150, description: "MP를 30 회복합니다", unique: false },
  { id: 3, name: "전설의 검", price: 5000, description: "공격력 +50", unique: true },
  { id: 4, name: "수호의 방패", price: 3000, description: "방어력 +30", unique: true },
  { id: 5, name: "이동 속도 부츠", price: 800, description: "이동속도 +10%", unique: true },
];

const MAX_INVENTORY = 5;

export default function GameStoreMock() {
  const [gold, setGold] = useState(10000);
  const [inventory, setInventory] = useState<string[]>([]);
  const [purchaseLogs, setPurchaseLogs] = useState<PurchaseLog[]>([]);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [logIdCounter, setLogIdCounter] = useState(1);

  function showMsg(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  function buyItem(item: GameItem) {
    // 재화 부족
    if (gold < item.price) {
      showMsg("error", "재화가 부족합니다");
      return;
    }

    // 중복 불가 아이템 체크
    if (item.unique && inventory.includes(item.name)) {
      showMsg("error", "이미 보유한 아이템입니다");
      return;
    }

    // [의도적 버그] 인벤토리 가득 참 체크가 구매 후에 이루어짐
    setGold((prev) => prev - item.price);
    setInventory((prev) => [...prev, item.name]);

    const newLog: PurchaseLog = {
      id: logIdCounter,
      itemName: item.name,
      price: item.price,
      date: new Date().toLocaleString("ko-KR"),
    };
    setPurchaseLogs((prev) => [newLog, ...prev]);
    setLogIdCounter((prev) => prev + 1);

    // 인벤토리 초과 체크 (버그: 이미 추가된 후)
    if (inventory.length + 1 > MAX_INVENTORY) {
      // [의도적 버그] 인벤토리 초과해도 안내만 뜨고 아이템은 이미 추가됨
      showMsg("error", "인벤토리가 가득 찼습니다!");
      return;
    }

    showMsg("success", `${item.name}을(를) 구매했습니다!`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* 메시지 */}
      {message && (
        <div className={`fixed right-4 top-4 z-50 rounded-md px-4 py-2 text-sm text-white shadow-lg ${
          message.type === "error" ? "bg-red-600" : "bg-green-600"
        }`}>
          {message.text}
        </div>
      )}

      {/* 상태 바 */}
      <div className="flex items-center justify-between rounded-lg border bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">골드:</span>
          <span className="text-lg font-bold text-yellow-600">{gold.toLocaleString()} G</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">인벤토리:</span>
          <span className="text-sm font-medium">{inventory.length} / {MAX_INVENTORY}</span>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="rounded-md bg-gray-100 px-3 py-1.5 text-xs hover:bg-gray-200"
        >
          {showHistory ? "상점" : "구매 내역"}
        </button>
      </div>

      {showHistory ? (
        /* 구매 내역 */
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">구매 내역</h2>
          {purchaseLogs.length === 0 ? (
            <p className="mt-4 text-center text-sm text-gray-400">구매 내역이 없습니다</p>
          ) : (
            <div className="mt-4 space-y-2">
              {purchaseLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                  <span className="font-medium">{log.itemName}</span>
                  <span className="text-yellow-600">-{log.price.toLocaleString()} G</span>
                  <span className="text-gray-400">{log.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* 상점 */
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">상점</h2>
          <div className="mt-4 space-y-3">
            {shopItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`cursor-pointer rounded-md border p-4 transition hover:bg-gray-50 ${
                  selectedItem?.id === item.id ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {item.name}
                      {item.unique && <span className="ml-1 text-xs text-purple-500">[유니크]</span>}
                    </p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-600">{item.price.toLocaleString()} G</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        buyItem(item);
                      }}
                      className="mt-1 rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      구매
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 인벤토리 */}
      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">인벤토리</h2>
        {inventory.length === 0 ? (
          <p className="mt-4 text-center text-sm text-gray-400">보유 아이템이 없습니다</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {inventory.map((name, i) => (
              <span key={i} className="rounded-md bg-gray-100 px-3 py-1.5 text-sm">{name}</span>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="text-sm font-semibold text-yellow-800">힌트</h3>
        <p className="mt-1 text-xs text-yellow-700">
          이 목업에는 의도적인 버그가 포함되어 있습니다. 기획서의 요구사항/예외사항과 비교하며 테스트해보세요.
          초기 골드: 10,000G / 인벤토리 최대: 5칸
        </p>
      </div>
    </div>
  );
}
