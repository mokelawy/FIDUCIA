import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { OrdersPanel } from "@/components/admin/OrdersPanel";
import { ProductsPanel } from "@/components/admin/ProductsPanel";
import { TrackingPanel } from "@/components/admin/TrackingPanel";
import type { ProductRow, VariantRow } from "@/lib/catalog";
import type { Database } from "@/integrations/supabase/types";
import {
  adminDeleteProduct,
  adminGetSettings,
  adminListOrders,
  adminListProducts,
  adminSaveProduct,
  adminSaveSettings,
  adminSetProductActive,
  adminUpdateOrderStatus,
  claimAdminRole,
  getAdminStatus,
  type AdminProductInput,
} from "@/lib/admin.functions";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type ItemRow = Database["public"]["Tables"]["order_items"]["Row"];

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin — FIDUCIA" },
      { name: "description", content: "لوحة تحكم متجر FIDUCIA لإدارة المنتجات والطلبات." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin — FIDUCIA" },
      { property: "og:description", content: "لوحة تحكم متجر FIDUCIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const input =
  "h-11 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-ink";
const btn = "label-xs h-11 bg-ink px-6 text-ink-foreground transition-opacity hover:opacity-90";
const ghost = "label-xs h-11 border border-border px-5 transition-colors hover:border-ink";

function AdminPage() {
  const [session, setSession] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"products" | "orders" | "tracking" | "settings">("products");
  const [busy, setBusy] = useState(false);

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  const status = useServerFn(getAdminStatus);
  const claim = useServerFn(claimAdminRole);
  const listProductsFn = useServerFn(adminListProducts);
  const saveProductFn = useServerFn(adminSaveProduct);
  const deleteProductFn = useServerFn(adminDeleteProduct);
  const setActiveFn = useServerFn(adminSetProductActive);
  const listOrdersFn = useServerFn(adminListOrders);
  const updateStatusFn = useServerFn(adminUpdateOrderStatus);
  const getSettingsFn = useServerFn(adminGetSettings);
  const saveSettingsFn = useServerFn(adminSaveSettings);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(Boolean(s)));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(session === false ? false : null);
      return;
    }
    status()
      .then((r) => setIsAdmin(r.isAdmin))
      .catch(() => setIsAdmin(false));
  }, [session, status]);

  const refresh = useCallback(async () => {
    const [p, o, s] = await Promise.all([listProductsFn(), listOrdersFn(), getSettingsFn()]);
    setProducts(p.products);
    setVariants(p.variants);
    setOrders(o.orders);
    setItems(o.items);
    setSettings(s);
  }, [listProductsFn, listOrdersFn, getSettingsFn]);

  useEffect(() => {
    if (isAdmin) void refresh().catch((e: unknown) => toast.error(String(e)));
  }, [isAdmin, refresh]);

  if (session === null) {
    return <Shell><p className="text-sm text-muted-foreground">جاري التحميل…</p></Shell>;
  }

  if (!session) return <Shell><SignIn /></Shell>;

  if (isAdmin === null) {
    return <Shell><p className="text-sm text-muted-foreground">جاري التحقق…</p></Shell>;
  }

  if (!isAdmin) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          هذا الحساب ليس لديه صلاحية إدارة. لو أنت صاحب المتجر ولا يوجد أدمن بعد، اضغط الزر لتفعيل صلاحيتك.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            className={btn}
            onClick={async () => {
              try {
                const r = await claim();
                if (r.isAdmin) {
                  setIsAdmin(true);
                  toast.success("تم تفعيل صلاحية الأدمن");
                } else toast.error("يوجد أدمن بالفعل لهذا المتجر");
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "خطأ");
              }
            }}
          >
            تفعيل صلاحية الأدمن
          </button>
          <button className={ghost} onClick={() => void supabase.auth.signOut()}>
            تسجيل الخروج
          </button>
        </div>
      </Shell>
    );
  }

  const guard = async (fn: () => Promise<unknown>, msg: string) => {
    setBusy(true);
    try {
      await fn();
      await refresh();
      toast.success(msg);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {(["products", "orders", "tracking", "settings"] as const).map((t) => (
          <button
            key={t}
            className={`${ghost} ${tab === t ? "border-ink" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "products"
              ? "المنتجات"
              : t === "orders"
                ? "الطلبات"
                : t === "tracking"
                  ? "متابعة الطلبات"
                  : "الإعدادات"}
          </button>
        ))}
        <button className={`${ghost} ms-auto`} onClick={() => void supabase.auth.signOut()}>
          خروج
        </button>
      </div>

      {tab === "products" && (
        <ProductsPanel
          products={products}
          variants={variants}
          busy={busy}
          onSave={(p: AdminProductInput) => guard(() => saveProductFn({ data: p }), "تم حفظ المنتج")}
          onDelete={(id) => guard(() => deleteProductFn({ data: { id } }), "تم حذف المنتج")}
          onToggleActive={(id, active) =>
            guard(() => setActiveFn({ data: { id, active } }), active ? "تم إظهار المنتج" : "تم إخفاء المنتج")
          }
        />
      )}

      {tab === "orders" && (
        <OrdersPanel
          orders={orders}
          items={items}
          onStatusChange={(id, s) => guard(() => updateStatusFn({ data: { id, status: s } }), "تم تحديث الحالة")}
        />
      )}

      {tab === "tracking" && <TrackingPanel orders={orders} items={items} />}

      {tab === "settings" && (
        <SettingsPanel
          settings={settings}
          busy={busy}
          onSave={(next) => guard(() => saveSettingsFn({ data: { settings: next } }), "تم حفظ الإعدادات")}
        />
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-background py-14 sm:py-16">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <p className="eyebrow text-muted-foreground">FIDUCIA</p>
        <h1 className="serif-title mt-3 text-3xl sm:text-[2.5rem]">Admin</h1>
        <p className="arabic mt-1 mb-10 text-sm text-muted-foreground">لوحة التحكم</p>
        {children}
      </div>
    </section>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const fn =
      mode === "in"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    const { error } = await fn;
    setLoading(false);
    if (error) toast.error(error.message);
    else if (mode === "up") toast.success("تم إنشاء الحساب — سجّل الدخول الآن");
  }

  return (
    <form onSubmit={submit} className="max-w-sm space-y-4">
      <div>
        <label className="label-xs" htmlFor="a-email">
          Email
        </label>
        <input
          id="a-email"
          type="email"
          required
          className={`${input} mt-2`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="label-xs" htmlFor="a-pass">
          Password
        </label>
        <input
          id="a-pass"
          type="password"
          required
          minLength={6}
          className={`${input} mt-2`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className={btn} disabled={loading}>
        {mode === "in" ? "تسجيل الدخول" : "إنشاء حساب"}
      </button>
      <button
        type="button"
        className="block text-xs text-muted-foreground underline"
        onClick={() => setMode(mode === "in" ? "up" : "in")}
      >
        {mode === "in" ? "إنشاء حساب جديد" : "لدي حساب بالفعل"}
      </button>
    </form>
  );
}

function SettingsPanel({
  settings,
  busy,
  onSave,
}: {
  settings: Record<string, string>;
  busy: boolean;
  onSave: (next: Record<string, string>) => Promise<void>;
}) {
  const [wa, setWa] = useState(settings["whatsapp_number"] ?? "");
  const [ship, setShip] = useState(settings["shipping_fee"] ?? "");
  const [free, setFree] = useState(settings["free_shipping_threshold"] ?? "");

  useEffect(() => {
    setWa(settings["whatsapp_number"] ?? "");
    setShip(settings["shipping_fee"] ?? "");
    setFree(settings["free_shipping_threshold"] ?? "");
  }, [settings]);

  return (
    <div className="max-w-md space-y-5">
      <h2 className="serif-title text-2xl">إعدادات المتجر</h2>
      <div>
        <p className="label-xs">رقم واتساب المتجر (بصيغة دولية)</p>
        <input className={`${input} mt-2`} value={wa} onChange={(e) => setWa(e.target.value)} />
      </div>
      <div>
        <p className="label-xs">مصاريف الشحن (ج.م)</p>
        <input className={`${input} mt-2`} value={ship} onChange={(e) => setShip(e.target.value)} />
      </div>
      <div>
        <p className="label-xs">حد الشحن المجاني (ج.م)</p>
        <input className={`${input} mt-2`} value={free} onChange={(e) => setFree(e.target.value)} />
      </div>
      <button
        className={btn}
        disabled={busy}
        onClick={() =>
          void onSave({
            whatsapp_number: wa,
            shipping_fee: ship,
            free_shipping_threshold: free,
          })
        }
      >
        حفظ الإعدادات
      </button>
    </div>
  );
}
