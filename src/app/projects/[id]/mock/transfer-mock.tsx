"use client";

import { useState } from "react";

interface Account {
  name: string;
  bank: string;
  number: string;
  balance: number;
}

interface Transaction {
  id: number;
  type: "send" | "receive";
  amount: number;
  fee: number;
  counterpart: string;
  balanceAfter: number;
  timestamp: string;
}

const FEE = 500; // 1만원 이상 송금 시 수수료
const DAILY_LIMIT = 500000; // 1일 한도 50만원

let txId = 1;

export default function TransferMock() {
  const [myAccount, setMyAccount] = useState<Account>({
    name: "홍길동",
    bank: "QA은행",
    number: "110-1234-5678",
    balance: 1000000,
  });

  const [receiverAccount, setReceiverAccount] = useState<Account>({
    name: "김철수",
    bank: "테스트은행",
    number: "220-9876-5432",
    balance: 500000,
  });

  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [showReceiver, setShowReceiver] = useState(false);

  function handleTransfer() {
    setError(null);
    setSuccess(null);

    const transferAmount = parseInt(amount, 10);

    if (!amount || isNaN(transferAmount) || transferAmount <= 0) {
      setError("올바른 금액을 입력해주세요.");
      return;
    }

    const fee = transferAmount >= 10000 ? FEE : 0;
    const totalDeduction = transferAmount + fee;

    // 잔액 부족 체크
    if (totalDeduction > myAccount.balance) {
      setError(`잔액이 부족합니다. (필요: ${totalDeduction.toLocaleString()}원, 잔액: ${myAccount.balance.toLocaleString()}원)`);
      return;
    }

    // 의도적 버그: 1일 한도 체크를 송금 금액만으로 체크 (누적 합산을 안 함)
    // 기획: dailyTotal + transferAmount > DAILY_LIMIT 이어야 함
    if (transferAmount > DAILY_LIMIT) {
      setError(`1일 송금 한도(${DAILY_LIMIT.toLocaleString()}원)를 초과했습니다.`);
      return;
    }

    // 의도적 버그: 내 계좌에서 수수료를 차감하지 않음
    // 기획: totalDeduction (금액 + 수수료)을 빼야 함
    const newMyBalance = myAccount.balance - transferAmount; // 버그: fee 미포함

    // 의도적 버그: 상대방에게 수수료 포함 금액이 입금됨
    // 기획: transferAmount만 입금해야 함
    const newReceiverBalance = receiverAccount.balance + transferAmount + fee; // 버그: fee 추가

    const now = new Date();
    const timeStr = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    setMyAccount({ ...myAccount, balance: newMyBalance });
    setReceiverAccount({ ...receiverAccount, balance: newReceiverBalance });
    setDailyTotal(dailyTotal + transferAmount);

    setTransactions([
      {
        id: txId++,
        type: "send",
        amount: transferAmount,
        fee,
        counterpart: receiverAccount.name,
        balanceAfter: newMyBalance,
        timestamp: timeStr,
      },
      ...transactions,
    ]);

    setSuccess(`${receiverAccount.name}님에게 ${transferAmount.toLocaleString()}원을 송금했습니다.${fee > 0 ? ` (수수료 ${fee.toLocaleString()}원)` : ""}`);
    setAmount("");
  }

  function quickAmount(value: number) {
    setAmount(String(value));
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      {/* 내 계좌 */}
      <div className="rounded-xl border bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-200">{myAccount.bank}</p>
            <p className="text-sm text-blue-100">{myAccount.number}</p>
          </div>
          <p className="text-xs text-blue-200">{myAccount.name}</p>
        </div>
        <div className="mt-4">
          <p className="text-xs text-blue-300">잔액</p>
          <p className="text-2xl font-bold">{myAccount.balance.toLocaleString()}원</p>
        </div>
        <div className="mt-2 text-xs text-blue-300">
          오늘 송금: {dailyTotal.toLocaleString()}원 / {DAILY_LIMIT.toLocaleString()}원
        </div>
      </div>

      {/* 받는 사람 */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">받는 사람</h3>
          <button
            onClick={() => setShowReceiver(!showReceiver)}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            {showReceiver ? "잔액 숨기기" : "잔액 보기"}
          </button>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
            {receiverAccount.name[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{receiverAccount.name}</p>
            <p className="text-xs text-gray-400">{receiverAccount.bank} {receiverAccount.number}</p>
          </div>
        </div>
        {showReceiver && (
          <div className="mt-3 rounded-lg bg-green-50 px-3 py-2">
            <p className="text-xs text-green-600">
              잔액: <span className="font-bold">{receiverAccount.balance.toLocaleString()}원</span>
            </p>
          </div>
        )}
      </div>

      {/* 송금 폼 */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700">송금 금액</h3>
        <div className="mt-3">
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                setAmount(v);
              }}
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-right text-xl font-bold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
          </div>
          <div className="mt-2 flex gap-2">
            {[10000, 30000, 50000, 100000].map((v) => (
              <button
                key={v}
                onClick={() => quickAmount(v)}
                className="flex-1 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                +{(v / 10000).toFixed(0)}만
              </button>
            ))}
          </div>
        </div>

        {/* 수수료 안내 */}
        {amount && parseInt(amount) >= 10000 && (
          <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>송금액</span>
              <span>{parseInt(amount).toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span>수수료</span>
              <span>{FEE.toLocaleString()}원</span>
            </div>
            <div className="mt-1 flex justify-between border-t pt-1 font-semibold text-gray-700">
              <span>총 차감액</span>
              <span>{(parseInt(amount) + FEE).toLocaleString()}원</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-600">
            {success}
          </div>
        )}

        <button
          onClick={handleTransfer}
          className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"
        >
          송금하기
        </button>
      </div>

      {/* 거래 내역 */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-3">
          <h3 className="text-sm font-semibold text-gray-700">거래 내역</h3>
        </div>
        <div className="max-h-[250px] divide-y overflow-auto">
          {transactions.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">거래 내역이 없습니다.</div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {tx.counterpart}에게 송금
                  </p>
                  <p className="text-xs text-gray-400">
                    {tx.timestamp}
                    {tx.fee > 0 && ` · 수수료 ${tx.fee.toLocaleString()}원`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">
                    -{tx.amount.toLocaleString()}원
                  </p>
                  <p className="text-xs text-gray-400">
                    잔액 {tx.balanceAfter.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 안내 */}
      <div className="rounded-lg border bg-white p-4 text-xs text-gray-500">
        <p className="font-semibold text-gray-700">송금 규칙 (기획서 기준)</p>
        <ul className="mt-2 space-y-1">
          <li>- 1만원 이상 송금 시 수수료 500원 부과</li>
          <li>- 총 차감액 = 송금액 + 수수료 (내 잔액에서 차감)</li>
          <li>- 상대방에게는 송금액만 입금 (수수료 제외)</li>
          <li>- 1일 송금 한도: 50만원 (누적)</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="text-sm font-semibold text-yellow-800">힌트</h3>
        <p className="mt-1 text-xs text-yellow-700">
          이 목업에는 의도적인 버그가 포함되어 있습니다. 기획서의 수수료/한도 규칙과 실제 금액 변동을 비교하며 테스트해보세요.
        </p>
      </div>
    </div>
  );
}
