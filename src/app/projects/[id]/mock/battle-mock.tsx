"use client";

import { useState } from "react";

interface CharacterStats {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
}

interface BattleLog {
  turn: number;
  actor: string;
  action: string;
  damage: number;
  detail: string;
}

const INITIAL_PLAYER: CharacterStats = {
  name: "기사",
  hp: 500,
  maxHp: 500,
  attack: 80,
  defense: 30,
};

const INITIAL_ENEMY: CharacterStats = {
  name: "드래곤",
  hp: 800,
  maxHp: 800,
  attack: 60,
  defense: 20,
};

export default function BattleMock() {
  const [player, setPlayer] = useState<CharacterStats>({ ...INITIAL_PLAYER });
  const [enemy, setEnemy] = useState<CharacterStats>({ ...INITIAL_ENEMY });
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [turn, setTurn] = useState(1);
  const [gameOver, setGameOver] = useState<string | null>(null);

  function addLog(log: BattleLog) {
    setLogs((prev) => [log, ...prev]);
  }

  function handleAttack() {
    if (gameOver) return;

    // 기획: 기본 공격력 + 최대 공격력의 10%까지 추가 랜덤 데미지
    // 의도적 버그: 20%를 곱해서 추가 데미지가 기획보다 2배 높음
    const bonusDamage = Math.floor(Math.random() * player.attack * 0.2);
    const totalDamage = player.attack + bonusDamage;
    const actualDamage = Math.max(1, totalDamage - enemy.defense);

    const newEnemyHp = Math.max(0, enemy.hp - actualDamage);

    addLog({
      turn,
      actor: player.name,
      action: "공격",
      damage: actualDamage,
      detail: `기본 ${player.attack} + 추가 ${bonusDamage} - 방어 ${enemy.defense} = ${actualDamage} 데미지`,
    });

    setEnemy({ ...enemy, hp: newEnemyHp });

    if (newEnemyHp <= 0) {
      setGameOver("승리! 적을 쓰러뜨렸습니다!");
      return;
    }

    // 적 턴
    enemyTurn(newEnemyHp);
  }

  function handleDefend() {
    if (gameOver) return;

    // 기획: 방어 시 받는 데미지 = 적 공격력 - 내 방어력
    // 의도적 버그: 방어력을 절반만 적용함 (defense / 2)
    const incomingDamage = Math.max(1, enemy.attack - Math.floor(player.defense / 2));

    const newPlayerHp = Math.max(0, player.hp - incomingDamage);

    addLog({
      turn,
      actor: player.name,
      action: "방어",
      damage: incomingDamage,
      detail: `적 공격 ${enemy.attack} - 방어 적용 → ${incomingDamage} 데미지 받음`,
    });

    setPlayer({ ...player, hp: newPlayerHp });

    if (newPlayerHp <= 0) {
      setGameOver("패배... 체력이 모두 소진되었습니다.");
      return;
    }

    setTurn((t) => t + 1);
  }

  function enemyTurn(currentEnemyHp: number) {
    // 적은 항상 일반 공격
    const enemyBonus = Math.floor(Math.random() * enemy.attack * 0.1);
    const enemyTotal = enemy.attack + enemyBonus;
    const enemyActualDamage = Math.max(1, enemyTotal - player.defense);

    const newPlayerHp = Math.max(0, player.hp - enemyActualDamage);

    addLog({
      turn,
      actor: enemy.name,
      action: "공격",
      damage: enemyActualDamage,
      detail: `기본 ${enemy.attack} + 추가 ${enemyBonus} - 방어 ${player.defense} = ${enemyActualDamage} 데미지`,
    });

    setPlayer({ ...player, hp: newPlayerHp });
    setEnemy({ ...enemy, hp: currentEnemyHp });

    if (newPlayerHp <= 0) {
      setGameOver("패배... 체력이 모두 소진되었습니다.");
      return;
    }

    setTurn((t) => t + 1);
  }

  function resetBattle() {
    setPlayer({ ...INITIAL_PLAYER });
    setEnemy({ ...INITIAL_ENEMY });
    setLogs([]);
    setTurn(1);
    setGameOver(null);
  }

  const playerHpPercent = (player.hp / player.maxHp) * 100;
  const enemyHpPercent = (enemy.hp / enemy.maxHp) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* 전투 상태 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 플레이어 */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-blue-700">{player.name}</h3>
            <span className="text-xs text-gray-400">플레이어</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">HP</span>
              <span className="font-mono font-semibold">{player.hp} / {player.maxHp}</span>
            </div>
            <div className="mt-1 h-4 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded bg-red-50 px-3 py-2 text-center">
              <span className="text-xs text-red-400">공격력</span>
              <p className="font-bold text-red-600">{player.attack}</p>
            </div>
            <div className="rounded bg-blue-50 px-3 py-2 text-center">
              <span className="text-xs text-blue-400">방어력</span>
              <p className="font-bold text-blue-600">{player.defense}</p>
            </div>
          </div>
        </div>

        {/* 적 */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-red-700">{enemy.name}</h3>
            <span className="text-xs text-gray-400">적</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">HP</span>
              <span className="font-mono font-semibold">{enemy.hp} / {enemy.maxHp}</span>
            </div>
            <div className="mt-1 h-4 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-red-500 transition-all duration-300"
                style={{ width: `${enemyHpPercent}%` }}
              />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded bg-red-50 px-3 py-2 text-center">
              <span className="text-xs text-red-400">공격력</span>
              <p className="font-bold text-red-600">{enemy.attack}</p>
            </div>
            <div className="rounded bg-blue-50 px-3 py-2 text-center">
              <span className="text-xs text-blue-400">방어력</span>
              <p className="font-bold text-blue-600">{enemy.defense}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 턴 / 게임오버 */}
      <div className="text-center">
        {gameOver ? (
          <div className="space-y-2">
            <p className={`text-lg font-bold ${gameOver.startsWith("승리") ? "text-green-600" : "text-red-600"}`}>
              {gameOver}
            </p>
            <button
              onClick={resetBattle}
              className="rounded-lg bg-gray-800 px-6 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              다시 시작
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">턴 {turn} - 행동을 선택하세요</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleAttack}
                className="rounded-lg bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-700 transition"
              >
                공격
              </button>
              <button
                onClick={handleDefend}
                className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"
              >
                방어
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 전투 로그 */}
      <div className="rounded-xl border bg-gray-900 shadow-sm">
        <div className="border-b border-gray-700 px-4 py-2">
          <h4 className="text-sm font-semibold text-gray-300">전투 로그</h4>
        </div>
        <div className="max-h-[250px] overflow-auto p-4">
          {logs.length === 0 ? (
            <p className="text-center text-sm text-gray-600">아직 전투가 시작되지 않았습니다.</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div key={i} className="text-sm">
                  <span className="text-gray-500">[턴 {log.turn}]</span>{" "}
                  <span className={log.actor === player.name ? "text-blue-400" : "text-red-400"}>
                    {log.actor}
                  </span>{" "}
                  <span className="text-gray-400">{log.action}</span>{" "}
                  <span className="font-bold text-yellow-400">-{log.damage}</span>
                  <p className="pl-4 text-xs text-gray-600">{log.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 스탯 참고표 */}
      <div className="rounded-lg border bg-white p-4 text-xs text-gray-500">
        <p className="font-semibold text-gray-700">데미지 공식 (기획서 기준)</p>
        <ul className="mt-2 space-y-1">
          <li>- 공격: 기본 공격력 + 랜덤 추가 데미지(최대 공격력의 10%) - 상대 방어력</li>
          <li>- 방어: 상대 공격력 - 내 방어력 = 받는 데미지</li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="text-sm font-semibold text-yellow-800">힌트</h3>
        <p className="mt-1 text-xs text-yellow-700">
          이 목업에는 의도적인 버그가 포함되어 있습니다. 기획서의 데미지 공식과 실제 전투 로그를 비교하며 테스트해보세요.
        </p>
      </div>
    </div>
  );
}
