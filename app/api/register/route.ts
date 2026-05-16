import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/registration-schema";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Nguồn gốc thiết kế (dùng environment variables trên Vercel):
// - RESEND_API_KEY: API key của Resend (https://resend.com)
// - RESEND_FROM_EMAIL: email "from" đã verify domain trên Resend (vd: list100@joywork.vn)
// - TEAM_NOTIFICATION_EMAIL: email team nội bộ nhận đăng ký mới (vd: list100@joywork.vn)
// - AIRTABLE_TOKEN: Personal Access Token từ https://airtable.com/create/tokens
// - AIRTABLE_BASE_ID: Base ID (format: appXXXXXXXXXXXXXX)
// - AIRTABLE_TABLE_NAME: Tên table (vd: Registrations)
// - LARK_WEBHOOK_URL: Lark bot webhook URL

export const runtime = "nodejs";

export async function POST(request: Request) {
  // 1. Rate limit theo IP (1 lần / 5 phút)
  const ip = getClientIp(request.headers);
  const rateLimitResult = checkRateLimit(ip);
  if (!rateLimitResult.ok) {
    return NextResponse.json(
      { ok: false, message: "Vui lòng chờ 5 phút trước khi đăng ký lại." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.retryAfterSeconds),
        },
      }
    );
  }

  // 2. Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Dữ liệu không hợp lệ." },
      { status: 400 }
    );
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Thông tin đăng ký không hợp lệ.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  // 3. Honeypot check — có giá trị → bot, trả "ok" giả
  const honeypot = (parsed.data as Record<string, unknown>).website;
  if (honeypot && typeof honeypot === "string" && honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const data = parsed.data;

  // Extract UTM params từ body (nếu có)
  const bodyData = body as Record<string, unknown>;
  const utmData = {
    utmSource: bodyData.utmSource as string | undefined,
    utmMedium: bodyData.utmMedium as string | undefined,
    utmCampaign: bodyData.utmCampaign as string | undefined,
    utmContent: bodyData.utmContent as string | undefined,
    utmTerm: bodyData.utmTerm as string | undefined,
    pageUrl: bodyData.pageUrl as string | undefined,
  };

  // 4. Lưu Airtable + gửi email + notify Lark — song song để giảm độ trễ
  const [sheetResult, userEmailResult, teamEmailResult, larkResult] =
    await Promise.allSettled([
      saveToAirtable({ ...data, ...utmData }),
      sendConfirmationEmail(data),
      sendTeamNotification(data),
      sendLarkNotification(data),
    ]);

  // Log lỗi server-side nhưng vẫn trả success cho user nếu ít nhất 1 trong 4 thành công
  const allFailed =
    sheetResult.status === "rejected" &&
    userEmailResult.status === "rejected" &&
    teamEmailResult.status === "rejected" &&
    larkResult.status === "rejected";

  if (sheetResult.status === "rejected") {
    console.error("[register] Airtable failed:", sheetResult.reason);
  }
  if (userEmailResult.status === "rejected") {
    console.error("[register] User email failed:", userEmailResult.reason);
  }
  if (teamEmailResult.status === "rejected") {
    console.error("[register] Team email failed:", teamEmailResult.reason);
  }
  if (larkResult.status === "rejected") {
    console.error("[register] Lark notification failed:", larkResult.reason);
  }

  if (allFailed) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Hệ thống đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ team@joywork.vn.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

// --- Airtable: lưu record ---
// Lưu ý: Airtable sử dụng single select fields, nên cần map giá trị cho đúng
async function saveToAirtable(data: {
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  contactName: string;
  contactPosition: string;
  email: string;
  phone: string;
  readiness: string;
  referralSource?: string;
  consent?: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  pageUrl?: string;
}) {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Registrations";

  if (!token || !baseId) {
    console.warn("[register] Airtable env not set, skipping...");
    return;
  }

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        CompanyName: data.companyName,
        Industry: mapIndustry(data.industry),
        CompanySize: mapCompanySize(data.companySize),
        Location: mapLocation(data.location),
        ContactName: data.contactName,
        Position: mapPosition(data.contactPosition),
        Email: data.email,
        Phone: data.phone,
        Readiness: mapReadiness(data.readiness),
        ReferralSource: mapReferralSource(data.referralSource),
        Consent: data.consent ?? false,
        UTM_Source: data.utmSource || "",
        UTM_Medium: data.utmMedium || "",
        UTM_Campaign: data.utmCampaign || "",
        UTM_Content: data.utmContent || "",
        UTM_Term: data.utmTerm || "",
        PageURL: data.pageUrl || "",
        SubmittedAt: new Date().toISOString(),
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable error ${res.status}: ${text}`);
  }
}

// Map form industry values to Airtable single select values
function mapIndustry(value: string): string {
  const map: Record<string, string> = {
    "Marcom / Quảng cáo / Truyền thông": "Khác",
    "Công nghệ thông tin / Phần mềm": "Công nghệ thông tin",
    "Tài chính / Ngân hàng / Bảo hiểm": "Tài chính - Ngân hàng",
    "Bán lẻ / Thương mại điện tử": "Thương mại - Dịch vụ",
    "Sản xuất / Logistics": "Sản xuất - Công nghiệp",
    "Giáo dục / Đào tạo": "Giáo dục - Đào tạo",
    "Y tế / Chăm sóc sức khỏe": "Y tế - Dược phẩm",
    "Bất động sản / Xây dựng": "Bất động sản",
    "Dịch vụ chuyên môn (Kế toán, Luật, Tư vấn)": "Thương mại - Dịch vụ",
    Khác: "Khác",
  };
  return map[value] || value;
}

// Map form company size values to Airtable single select values
function mapCompanySize(value: string): string {
  const map: Record<string, string> = {
    "15-30 người": "Dưới 50 nhân viên",
    "31-50 người": "Dưới 50 nhân viên",
    "51-100 người": "50-200 nhân viên",
    "101-300 người": "50-200 nhân viên",
    "301-500 người": "201-500 nhân viên",
    "Trên 500 người": "Trên 1000 nhân viên",
  };
  return map[value] || "Không xác định";
}

// Map form location values to Airtable single select values
function mapLocation(value: string): string {
  const map: Record<string, string> = {
    "TP. Hồ Chí Minh": "Hồ Chí Minh",
    "Hà Nội": "Hà Nội",
    "Đà Nẵng": "Đà Nẵng",
    Khác: "Khác",
  };
  return map[value] || value;
}

// Map form position values to Airtable single select values
function mapPosition(value: string): string {
  const map: Record<string, string> = {
    "CEO / Founder": "CEO/Chủ tịch",
    "HR Manager / HR Director": "Trưởng phòng/Quản lý",
    "Trưởng phòng / Phó phòng": "Trưởng phòng/Quản lý",
    Khác: "Nhân viên",
  };
  return map[value] || value;
}

// Map form readiness values to Airtable single select values
function mapReadiness(value: string): string {
  const map: Record<string, string> = {
    "Đã sẵn sàng": "Có",
    "Cần tư vấn thêm": "Không",
  };
  return map[value] || value;
}

// Map form referral source values to Airtable single select values
function mapReferralSource(value?: string): string {
  if (!value) return "";
  const map: Record<string, string> = {
    LinkedIn: "LinkedIn",
    Facebook: "Facebook",
    Email: "Email",
    "Báo chí": "Website",
    "Bạn bè giới thiệu": "Bạn bè - Đồng nghiệp",
    Khác: "Khác",
  };
  return map[value] || value;
}

// --- Email xác nhận cho user ---
async function sendConfirmationEmail(data: {
  companyName: string;
  contactName: string;
  email: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.warn("[register] Resend env not set, skipping email...");
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: data.email,
      subject: "Xác nhận đăng ký tham gia Danh sách Doanh nghiệp có Môi trường Làm việc Tốt 2026",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1347CD;">Xin chào ${data.contactName},</h2>
          <p>JOYWORK đã nhận được đăng ký của <strong>${data.companyName}</strong> tham gia chương trình <strong>Danh sách Doanh nghiệp có Môi trường Làm việc Tốt 2026</strong>.</p>
          <p>Đội ngũ JOYWORK sẽ liên hệ trong <strong>3 ngày làm việc</strong> để hướng dẫn các bước tiếp theo.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #666; font-size: 14px;">
            JOYWORK — Nền tảng tuyển dụng bằng văn hóa<br>
            <a href="https://joywork.vn" style="color: #1347CD;">joywork.vn</a>
          </p>
        </div>
      `,
    }),
  });
}

// --- Email thông báo cho team ---
async function sendTeamNotification(data: {
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  contactName: string;
  contactPosition: string;
  email: string;
  phone: string;
  readiness: string;
  referralSource?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const teamEmail = process.env.TEAM_NOTIFICATION_EMAIL;

  if (!apiKey || !fromEmail || !teamEmail) {
    console.warn("[register] Resend/team email env not set, skipping...");
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: teamEmail,
      subject: `[LIST-100] Đăng ký mới: ${data.companyName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1347CD;">Đăng ký mới tham gia List-100 2026</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Doanh nghiệp:</td><td>${data.companyName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Ngành:</td><td>${data.industry}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Quy mô:</td><td>${data.companySize}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Địa điểm:</td><td>${data.location}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Người liên hệ:</td><td>${data.contactName} (${data.contactPosition})</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Điện thoại:</td><td>${data.phone}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Sẵn sàng:</td><td>${data.readiness}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Nguồn:</td><td>${data.referralSource || "-"}</td></tr>
          </table>
        </div>
      `,
    }),
  });
}

// --- Lark notification ---
async function sendLarkNotification(data: {
  companyName: string;
  industry: string;
  contactName: string;
  email: string;
  phone: string;
}) {
  const webhookUrl = process.env.LARK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("[register] Lark webhook URL not set, skipping...");
    return;
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      msg_type: "interactive",
      card: {
        header: {
          title: {
            tag: "plain_text",
            content: "📋 Đăng ký List-100 2026 mới",
          },
          template: "blue",
        },
        elements: [
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**Doanh nghiệp:** ${data.companyName}\n**Ngành:** ${data.industry}\n**Người liên hệ:** ${data.contactName}\n**Email:** ${data.email}\n**Điện thoại:** ${data.phone}`,
            },
          },
        ],
      },
    }),
  });
}
