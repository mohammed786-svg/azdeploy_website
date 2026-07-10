/** Open WhatsApp with a pre-filled message (India numbers: prefix 91 if missing). */
export function openWhatsAppShare(mobile: string, message: string): void {
  const digits = mobile.replace(/\D/g, "");
  if (!digits) {
    window.alert("Add customer mobile number to share on WhatsApp.");
    return;
  }
  const phone = digits.length === 10 ? `91${digits}` : digits.startsWith("91") ? digits : `91${digits}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

export function buildInvoiceWhatsAppMessage(opts: {
  customerName: string;
  invoiceNumber: string;
  total: number;
  currency?: string;
  balanceDue?: number;
  printUrl: string;
}): string {
  const cur = opts.currency || "INR";
  const lines = [
    `Hello ${opts.customerName || "there"},`,
    "",
    `Please find your invoice *${opts.invoiceNumber}* from AZ Deploy.`,
    `Total: *${cur} ${opts.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}*`,
  ];
  if (opts.balanceDue != null && opts.balanceDue > 0) {
    lines.push(`Balance due: *${cur} ${opts.balanceDue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}*`);
  }
  lines.push("", `View / download: ${opts.printUrl}`, "", "Thank you.", "— AZ Deploy");
  return lines.join("\n");
}

export function buildReceiptWhatsAppMessage(opts: {
  customerName: string;
  receiptNumber: string;
  amount: number;
  currency?: string;
  printUrl: string;
}): string {
  const cur = opts.currency || "INR";
  return [
    `Hello ${opts.customerName || "there"},`,
    "",
    `Payment receipt *${opts.receiptNumber}* from AZ Deploy.`,
    `Amount received: *${cur} ${opts.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}*`,
    "",
    `View / download: ${opts.printUrl}`,
    "",
    "Thank you.",
    "— AZ Deploy",
  ].join("\n");
}
