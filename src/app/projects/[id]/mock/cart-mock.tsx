"use client";

import { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  soldOut: boolean;
}

const initialProducts: CartItem[] = [
  { id: 1, name: "무선 키보드", price: 45000, quantity: 0, stock: 10, soldOut: false },
  { id: 2, name: "게이밍 마우스", price: 32000, quantity: 0, stock: 3, soldOut: false },
  { id: 3, name: "USB 허브", price: 15000, quantity: 0, stock: 0, soldOut: true },
  { id: 4, name: "모니터 받침대", price: 28000, quantity: 0, stock: 50, soldOut: false },
];

export default function CartMock() {
  const [products] = useState(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  function addToCart(product: CartItem) {
    if (product.soldOut) {
      showToast("품절된 상품입니다");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= 99) {
          showToast("최대 수량(99개)을 초과할 수 없습니다");
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name}이(가) 장바구니에 담겼습니다`);
  }

  function updateQuantity(id: number, newQty: number) {
    if (newQty <= 0) {
      // [의도적 버그] 0 이하 입력 시 확인 팝업 없이 바로 삭제됨
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    const item = cart.find((i) => i.id === id);
    if (item && newQty > item.stock) {
      // 재고 초과 시 자동 조정
      newQty = item.stock;
      showToast(`재고 수량(${item.stock}개)으로 조정되었습니다`);
    }

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  }

  function deleteItem(id: number) {
    if (!confirm("이 상품을 삭제하시겠습니까?")) return;
    setCart((prev) => prev.filter((item) => item.id !== id));
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function deleteSelected() {
    if (selectedItems.size === 0) return;
    if (!confirm(`${selectedItems.size}개 상품을 삭제하시겠습니까?`)) return;
    setCart((prev) => prev.filter((item) => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
  }

  function deleteAll() {
    // [의도적 버그] 전체 삭제 시 확인 팝업이 뜨지 않음
    setCart([]);
    setSelectedItems(new Set());
  }

  function toggleSelect(id: number) {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* 토스트 */}
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-md bg-gray-800 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* 상품 목록 */}
      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">상품 목록</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">{product.price.toLocaleString()}원</p>
                {product.soldOut && <span className="text-xs text-red-500">품절</span>}
              </div>
              <button
                onClick={() => addToCart(product)}
                disabled={product.soldOut}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
              >
                담기
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 장바구니 */}
      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">
            장바구니 <span className="ml-1 text-sm font-normal text-blue-600">({cartCount})</span>
          </h2>
          {cart.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={deleteSelected}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-200"
              >
                선택 삭제
              </button>
              <button
                onClick={deleteAll}
                className="rounded-md bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:bg-red-100"
              >
                전체 삭제
              </button>
            </div>
          )}
        </div>

        {cart.length === 0 ? (
          <p className="mt-6 text-center text-sm text-gray-400">장바구니가 비어있습니다</p>
        ) : (
          <div className="mt-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-md border p-3">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="h-4 w-4"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{(item.price * item.quantity).toLocaleString()}원</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-7 w-7 rounded border text-sm hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                    className="h-7 w-12 rounded border text-center text-sm"
                    min={0}
                  />
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-7 w-7 rounded border text-sm hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}

            <div className="border-t pt-3 text-right">
              <span className="text-sm text-gray-500">합계: </span>
              <span className="text-lg font-bold">{totalPrice.toLocaleString()}원</span>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="text-sm font-semibold text-yellow-800">힌트</h3>
        <p className="mt-1 text-xs text-yellow-700">
          이 목업에는 의도적인 버그가 포함되어 있습니다. 기획서의 요구사항/예외사항과 비교하며 테스트해보세요.
        </p>
      </div>
    </div>
  );
}
