import type { CartItem } from "@/lib/cart";

export type OrderCustomer = {
  name: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  notes: string;
};

const money = (n: number) => `${n.toLocaleString("en-US")} ج.م`;

export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `20${digits.slice(1)}`;
  return digits;
}

/**
 * Central WhatsApp configuration for the floating contact bar.
 * Change THIS value to update the number everywhere it is used.
 * Stored as digits only (international format, no "+" or spaces).
 */
export const SITE_WHATSAPP_NUMBER = "201142679416";

/** Human-readable version shown to customers in the floating bar. */
export const WHATSAPP_DISPLAY_NUMBER = "+20 11 4267 9416";

/** Pre-filled Arabic message customers can edit before sending. */
export const WHATSAPP_DEFAULT_MESSAGE = "مرحباً، أريد الاستفسار عن منتجات فيدوتشا.";

/** Click-to-chat link for general customer inquiries. */
export function whatsappInquiryLink(message: string = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${SITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage(params: {
  orderNumber: string;
  items: CartItem[];
  customer: OrderCustomer;
  subtotal: number;
  shipping: number;
  total: number;
}) {
  const { orderNumber, items, customer, subtotal, shipping, total } = params;
  const lines: string[] = [];
  lines.push("🛍️ *طلب جديد من FIDUCIA*");
  lines.push(`رقم الطلب: *${orderNumber}*`);
  lines.push("");
  lines.push("👤 *بيانات العميل*");
  lines.push(`الاسم: ${customer.name}`);
  lines.push(`الهاتف: ${customer.phone}`);
  lines.push(`المحافظة: ${customer.governorate}`);
  lines.push(`المدينة / المنطقة: ${customer.city}`);
  lines.push(`العنوان: ${customer.address}`);
  if (customer.notes.trim()) lines.push(`ملاحظات: ${customer.notes.trim()}`);
  lines.push("");
  lines.push("📦 *المنتجات*");
  items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name}`);
    lines.push(`   اللون: ${item.color} | المقاس: ${item.size} | الكمية: ${item.quantity}`);
    lines.push(`   السعر: ${money(item.price * item.quantity)}`);
  });
  lines.push("");
  lines.push(`الإجمالي الفرعي: ${money(subtotal)}`);
  lines.push(`الشحن: ${money(shipping)}`);
  lines.push(`*الإجمالي النهائي: ${money(total)}*`);
  lines.push("");
  lines.push("💵 طريقة الدفع: الدفع عند الاستلام");
  return lines.join("\n");
}

export function buildCustomerMessage(params: {
  orderNumber: string;
  customerName: string;
  total: number;
  status?: string;
}) {
  return [
    `مرحباً ${params.customerName} 👋`,
    "",
    `معاك فريق *FIDUCIA* بخصوص طلبك رقم *${params.orderNumber}*.`,
    `إجمالي الطلب: ${money(params.total)} (الدفع عند الاستلام)`,
    "",
    "برجاء تأكيد الطلب والعنوان حتى نبدأ التجهيز والشحن.",
    "شكراً لثقتك بنا 🖤",
  ].join("\n");
}

export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
}
