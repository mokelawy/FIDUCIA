import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/catalog";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"] & {
  shipped_at?: string | null;
  delivered_at?: string | null;
};
type ItemRow = Database["public"]["Tables"]["order_items"]["Row"];

const money = (n: number) => `${Number(n).toLocaleString("en-US")} ج.م`;
const fmt = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" }) : "—";

const FLOW: OrderStatus[] = ["new", "confirmed", "preparing", "shipped", "delivered"];

const STEP_STYLE: Record<OrderStatus, string> = {
  new: "bg-blue-500",
  confirmed: "bg-amber-500",
  preparing: "bg-violet-500",
  shipped: "bg-orange-500",
  delivered: "bg-emerald-600",
  cancelled: "bg-red-600",
};

function TrackingBar({ order }: { order: OrderRow }) {
  if (order.status === "cancelled") {
    return (
      <div className="mt-4 flex items-center gap-3 border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/40 dark:bg-red-950/30">
        <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
        <p className="text-sm text-red-700 dark:text-red-400">تم إلغاء هذا الطلب</p>
      </div>
    );
  }
  const current = FLOW.indexOf(order.status as OrderStatus);
  return (
    <div className="mt-5">
      <div className="relative flex items-center justify-between">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
        <div
          className="absolute start-0 top-1/2 h-0.5 -translate-y-1/2 bg-ink transition-all duration-700"
          style={{ width: `${(current / (FLOW.length - 1)) * 100}%` }}
        />
        {FLOW.map((s, i) => {
          const done = i <= current;
          const active = i === current;
          return (
            <div key={s} className="relative z-10 flex flex-col items-center gap-2">
              <span
                className={`block h-3.5 w-3.5 rounded-full border-2 transition-all duration-500 ${
                  done ? `${STEP_STYLE[s]} border-transparent` : "border-border bg-background"
                } ${active ? "scale-125 ring-4 ring-ink/10" : ""}`}
              />
              <span
                className={`text-[11px] transition-colors ${
                  active ? "font-medium text-foreground" : "text-muted-foreground"
                }`}
              >
                {ORDER_STATUS_LABEL[s].ar}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TrackingPanel({ orders, items }: { orders: OrderRow[]; items: ItemRow[] }) {
  const [filter, setFilter] = useState<"active" | OrderStatus>("active");

  const visible =
    filter === "active"
      ? orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled")
      : orders.filter((o) => o.status === filter);

  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  return (
    <div className="space-y-6">
      <h2 className="serif-title text-2xl">متابعة الطلبات</h2>

      <div className="flex flex-wrap gap-2">
        <button
          className={`label-xs h-9 border px-4 transition-colors ${filter === "active" ? "border-ink" : "border-border hover:border-ink"}`}
          onClick={() => setFilter("active")}
        >
          قيد التنفيذ
        </button>
        {(["delivered", "cancelled"] as const).map((s) => (
          <button
            key={s}
            className={`label-xs h-9 border px-4 transition-colors ${filter === s ? "border-ink" : "border-border hover:border-ink"}`}
            onClick={() => setFilter(s)}
          >
            {ORDER_STATUS_LABEL[s].ar} ({count(s)})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((o) => {
          const qty = items
            .filter((it) => it.order_id === o.id)
            .reduce((sum, it) => sum + it.quantity, 0);
          return (
            <div key={o.id} className="border border-border p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <p className="text-sm">
                  {o.order_number} — {o.customer_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {qty} قطعة · {money(o.total)}
                </p>
                <span
                  className={`ms-auto inline-flex items-center gap-2 px-3 py-1 text-xs text-white ${STEP_STYLE[o.status as OrderStatus] ?? "bg-muted"}`}
                >
                  {ORDER_STATUS_LABEL[o.status as OrderStatus]?.ar ?? o.status}
                </span>
              </div>

              <TrackingBar order={o} />

              <div className="mt-5 grid gap-3 border-t border-border pt-4 text-xs text-muted-foreground sm:grid-cols-3">
                <p>
                  <span className="label-xs block text-foreground">تاريخ الطلب</span>
                  <span className="mt-1 block">{fmt(o.created_at)}</span>
                </p>
                <p>
                  <span className="label-xs block text-foreground">تاريخ الشحن</span>
                  <span className="mt-1 block">{fmt(o.shipped_at)}</span>
                </p>
                <p>
                  <span className="label-xs block text-foreground">تاريخ التسليم</span>
                  <span className="mt-1 block">{fmt(o.delivered_at)}</span>
                </p>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <p className="text-sm text-muted-foreground">لا توجد طلبات في هذه القائمة.</p>
        )}
      </div>
    </div>
  );
}
