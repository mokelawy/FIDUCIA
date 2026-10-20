import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { ORDER_STATUSES, ORDER_STATUS_LABEL } from "@/lib/catalog";
import type { OrderStatus } from "@/lib/catalog";
import { buildCustomerMessage, whatsappLink } from "@/lib/whatsapp";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type ItemRow = Database["public"]["Tables"]["order_items"]["Row"];

const ghost = "label-xs h-9 border border-border px-4 transition-colors hover:border-ink";
const money = (n: number) => `${Number(n).toLocaleString("en-US")} ج.م`;

export function OrdersPanel({
  orders,
  items,
  onStatusChange,
}: {
  orders: OrderRow[];
  items: ItemRow[];
  onStatusChange: (id: string, status: string) => Promise<void>;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  const itemsByOrder = useMemo(() => {
    const map: Record<string, ItemRow[]> = {};
    for (const it of items) (map[it.order_id] ??= []).push(it);
    return map;
  }, [items]);

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="serif-title text-2xl">الطلبات ({orders.length})</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`${ghost} ${filter === "all" ? "border-ink" : ""}`}
            onClick={() => setFilter("all")}
          >
            الكل
          </button>
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              className={`${ghost} ${filter === s ? "border-ink" : ""}`}
              onClick={() => setFilter(s)}
            >
              {ORDER_STATUS_LABEL[s].ar}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {visible.map((o) => {
          const orderItems = itemsByOrder[o.id] ?? [];
          const expanded = open === o.id;
          return (
            <div key={o.id} className="border border-border">
              <div className="flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-[150px] flex-1">
                  <p className="text-sm">
                    {o.order_number} — {o.customer_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {o.customer_phone} · {new Date(o.created_at).toLocaleString("ar-EG")}
                  </p>
                </div>
                <p className="text-sm">{money(o.total)}</p>
                <select
                  className="h-9 border border-border bg-transparent px-3 text-sm outline-none focus:border-ink"
                  value={o.status}
                  onChange={(e) => void onStatusChange(o.id, e.target.value)}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_LABEL[s].ar}
                    </option>
                  ))}
                </select>
                <a
                  className={ghost}
                  href={whatsappLink(
                    o.customer_phone,
                    buildCustomerMessage({
                      orderNumber: o.order_number,
                      customerName: o.customer_name,
                      total: Number(o.total),
                    }),
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="mr-1 inline h-3 w-3" /> واتساب
                </a>
                <button className={ghost} onClick={() => setOpen(expanded ? null : o.id)}>
                  {expanded ? "إخفاء" : "التفاصيل"}
                </button>
              </div>

              {expanded && (
                <div className="grid gap-6 border-t border-border p-4 text-sm sm:grid-cols-2">
                  <div className="space-y-1 text-muted-foreground">
                    <p className="label-xs text-foreground">بيانات العميل</p>
                    <p>الاسم: {o.customer_name}</p>
                    <p>الهاتف: {o.customer_phone}</p>
                    <p>المحافظة: {o.governorate}</p>
                    <p>المدينة / المنطقة: {o.city}</p>
                    <p>العنوان: {o.address}</p>
                    {o.notes && <p>ملاحظات: {o.notes}</p>}
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="label-xs text-foreground">المنتجات</p>
                    {orderItems.map((it) => (
                      <p key={it.id}>
                        {it.product_name} — {it.color} / {it.size} × {it.quantity} ={" "}
                        {money(Number(it.price) * it.quantity)}
                      </p>
                    ))}
                    <p className="border-t border-border pt-2">الإجمالي الفرعي: {money(o.subtotal)}</p>
                    <p>الشحن: {money(o.shipping)}</p>
                    <p className="text-foreground">الإجمالي: {money(o.total)}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {visible.length === 0 && <p className="text-sm text-muted-foreground">لا توجد طلبات.</p>}
      </div>
    </div>
  );
}
