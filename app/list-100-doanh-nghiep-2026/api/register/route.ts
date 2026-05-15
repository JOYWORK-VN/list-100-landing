import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  registrationSchema,
  type RegistrationInput,
} from "@/lib/registration-schema";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Force Node runtime (Resend SDK cần Node.js runtime, không chạy được trên edge)
export const runtime = "nodejs";

// Env vars cần set khi deploy:
// - RESEND_API_KEY: API key của Resend (https://resend.com)
// - RESEND_FROM_EMAIL: email "from" đã verify domain trên Resend (vd: list100@joywork.vn)
// - TEAM_NOTIFICATION_EMAIL: email team nội bộ nhận đăng ký mới (vd: list100@joywork.vn)
// - GOOGLE_SHEET_WEBHOOK_URL: URL webhook của Google Apps Script

export async function POST(request: Request) {
  // 1. Rate limit theo IP (1 lần / 5 phút)
  const ip = getClientIp(request.headers);
  const rl = checkRateLimit(`register:${ip}`);
  if (!rl.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "RATE_LIMITED",
        message: `Bạn vừa gửi đăng ký. Vui lòng thử lại sau ${Math.ceil(
          rl.retryAfterSeconds / 60
        )} phút.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds) },
      }
    );
  }

  // 2. Parse JSON body
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON", message: "Body không hợp lệ" },
      { status: 400 }
    );
  }

  // 3. Validate bằng Zod (cùng schema với client)
  const parsed = registrationSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "VALIDATION_FAILED",
        message: "Dữ liệu không hợp lệ",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  // 4. Honeypot — nếu field "website" có giá trị, là bot
  if (parsed.data.website && parsed.data.website.length > 0) {
    // Trả về success giả để bot không biết bị chặn
    return NextResponse.json({ ok: true });
  }

  const data = parsed.data;

  // 5. Lưu Google Sheet + gửi email — song song để giảm độ trễ
  const [sheetResult, userEmailResult, teamEmailResult] =
    await Promise.allSettled([
      saveToGoogleSheet(data),
      sendConfirmationEmail(data),
      sendTeamNotification(data),
    ]);

  // Log lỗi server-side nhưng vẫn trả success cho user nếu ít nhất 1 trong 3 thành công
  // (đăng ký không bị mất hoàn toàn dù 1 kênh thất bại)
  const allFailed =
    sheetResult.status === "rejected" &&
    userEmailResult.status === "rejected" &&
    teamEmailResult.status === "rejected";

  if (sheetResult.status === "rejected") {
    console.error("[register] Google Sheet failed:", sheetResult.reason);
  }
  if (userEmailResult.status === "rejected") {
    console.error("[register] User email failed:", userEmailResult.reason);
  }
  if (teamEmailResult.status === "rejected") {
    console.error("[register] Team email failed:", teamEmailResult.reason);
  }

  if (allFailed) {
    return NextResponse.json(
      {
        ok: false,
        error: "DELIVERY_FAILED",
        message:
          "Đăng ký không gửi được do lỗi hệ thống. Vui lòng thử lại hoặc liên hệ trực tiếp list100@joywork.vn",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

// --- Google Sheet via Apps Script webhook ---
async function saveToGoogleSheet(data: RegistrationInput) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) {
    console.warn(
      "[register] GOOGLE_SHEET_WEBHOOK_URL chưa cấu hình — bỏ qua lưu Sheet"
    );
    return { skipped: true };
  }

  const payload = {
    timestamp: new Date().toISOString(),
    companyName: data.companyName,
    industry: data.industry,
    companySize: data.companySize,
    location: data.location,
    contactName: data.contactName,
    contactPosition: data.contactPosition,
    email: data.email,
    phone: data.phone,
    readiness: data.readiness,
    referralSource: data.referralSource || "",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    // Apps Script thường redirect → cho phép follow
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Google Sheet webhook trả về ${res.status}`);
  }
  return { ok: true };
}

// --- Resend: email xác nhận cho user ---
async function sendConfirmationEmail(data: RegistrationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.warn(
      "[register] RESEND_API_KEY / RESEND_FROM_EMAIL chưa cấu hình — bỏ qua email xác nhận"
    );
    return { skipped: true };
  }

  const resend = new Resend(apiKey);

  const html = renderUserConfirmationEmail(data);

  const { data: sent, error } = await resend.emails.send({
    from: `JOYWORK <${from}>`,
    to: [data.email],
    subject: "Xác nhận đăng ký Danh sách Doanh nghiệp có Môi trường Làm việc Tốt 2026",
    html,
  });

  if (error) {
    throw new Error(`Resend user email: ${error.message}`);
  }
  return sent;
}

// --- Resend: email notify team nội bộ ---
async function sendTeamNotification(data: RegistrationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const teamEmail =
    process.env.TEAM_NOTIFICATION_EMAIL || "list100@joywork.vn";
  if (!apiKey || !from) {
    console.warn(
      "[register] RESEND_API_KEY / RESEND_FROM_EMAIL chưa cấu hình — bỏ qua email team"
    );
    return { skipped: true };
  }

  const resend = new Resend(apiKey);
  const html = renderTeamNotificationEmail(data);

  const { data: sent, error } = await resend.emails.send({
    from: `JOYWORK Notifier <${from}>`,
    to: [teamEmail],
    replyTo: data.email,
    subject: `[JOYWORK 2026] Đăng ký mới: ${data.companyName}`,
    html,
  });

  if (error) {
    throw new Error(`Resend team email: ${error.message}`);
  }
  return sent;
}

// --- Email templates HTML ---
function renderUserConfirmationEmail(data: RegistrationInput) {
  return `<!DOCTYPE html>
<html lang="vi">
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,Arial,sans-serif;color:#0B1230;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr><td style="background:#0B1230;padding:32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">JOYWORK</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Danh sách Doanh nghiệp có Môi trường Làm việc Tốt 2026</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="margin:0 0 16px;font-size:20px;color:#0B1230;">Cảm ơn ${escapeHtml(
            data.contactName
          )},</h2>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3D4978;">
            JOYWORK đã nhận đăng ký tham gia chương trình của <strong>${escapeHtml(
              data.companyName
            )}</strong>.
          </p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3D4978;">
            Đội ngũ JOYWORK sẽ liên hệ với anh/chị trong <strong>3 ngày làm việc</strong> để hướng dẫn các bước tiếp theo (gửi khảo sát ẩn danh, lên lịch phỏng vấn, thu thập tài liệu).
          </p>
          <div style="background:#EEF3FE;border-left:3px solid #1347CD;padding:16px 20px;border-radius:6px;margin:24px 0;">
            <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#1347CD;font-weight:600;">Thông tin đăng ký</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#0B1230;">
              <strong>Doanh nghiệp:</strong> ${escapeHtml(data.companyName)}<br>
              <strong>Ngành:</strong> ${escapeHtml(data.industry)}<br>
              <strong>Quy mô:</strong> ${escapeHtml(data.companySize)}<br>
              <strong>Người liên hệ:</strong> ${escapeHtml(
                data.contactName
              )} (${escapeHtml(data.contactPosition)})<br>
              <strong>Email:</strong> ${escapeHtml(data.email)}<br>
              <strong>Điện thoại:</strong> ${escapeHtml(data.phone)}
            </p>
          </div>
          <p style="margin:24px 0 0;font-size:13px;color:#7F87A8;">
            Nếu thông tin trên có sai sót, vui lòng phản hồi email này để JOYWORK cập nhật.
          </p>
        </td></tr>
        <tr><td style="background:#f5f5f5;padding:20px 32px;text-align:center;font-size:12px;color:#7F87A8;">
          JOYWORK · joywork.vn<br>
          Nền tảng giúp doanh nghiệp thể hiện văn hóa thật để thu hút nhân tài phù hợp.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function renderTeamNotificationEmail(data: RegistrationInput) {
  return `<!DOCTYPE html>
<html lang="vi">
<body style="margin:0;padding:0;background:#fff;font-family:Inter,Arial,sans-serif;color:#0B1230;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px;">
    <tr><td>
      <h2 style="margin:0 0 8px;font-size:18px;">Đăng ký mới — Danh sách Doanh nghiệp 2026</h2>
      <p style="margin:0 0 20px;font-size:13px;color:#3D4978;">${new Date().toLocaleString(
        "vi-VN",
        { timeZone: "Asia/Ho_Chi_Minh" }
      )} (giờ Việt Nam)</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px;border:1px solid #E7E8EE;border-radius:8px;">
        ${renderRow("Doanh nghiệp", data.companyName)}
        ${renderRow("Ngành", data.industry)}
        ${renderRow("Quy mô", data.companySize)}
        ${renderRow("Địa điểm", data.location)}
        ${renderRow("Người liên hệ", `${data.contactName} (${data.contactPosition})`)}
        ${renderRow("Email", data.email)}
        ${renderRow("Điện thoại", data.phone)}
        ${renderRow("Sẵn sàng khảo sát", data.readiness)}
        ${renderRow("Biết qua kênh", data.referralSource || "—")}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function renderRow(label: string, value: string) {
  return `<tr style="border-bottom:1px solid #E7E8EE;">
    <td style="font-size:13px;color:#7F87A8;width:160px;">${escapeHtml(label)}</td>
    <td style="font-size:14px;color:#0B1230;font-weight:500;">${escapeHtml(value)}</td>
  </tr>`;
}

// Escape HTML để chống XSS trong email
function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
