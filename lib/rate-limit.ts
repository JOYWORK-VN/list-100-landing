// Rate limit in-memory đơn giản — phù hợp giai đoạn đầu của landing page.
// Mỗi serverless instance có map riêng (Vercel có thể có nhiều instance),
// nên rate limit là "best effort": vẫn chặn được bot/spam scan,
// chấp nhận đôi khi 1 IP có thể submit nhiều hơn limit nếu trúng instance khác.
//
// Khi traffic lớn hoặc cần chính xác, chuyển sang Upstash Redis (1 dòng đổi).

type RateLimitEntry = {
  // timestamp tính bằng ms
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

// Dọn rác đơn giản — gọi mỗi lần check để tránh memory leak
function cleanup(now: number) {
  // Array.from để tránh phụ thuộc downlevelIteration ở target es5
  Array.from(store.entries()).forEach(([key, entry]) => {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  });
}

export type RateLimitResult = {
  ok: boolean;
  retryAfterSeconds: number;
};

// windowMs mặc định 5 phút theo brief (1 lần / 5 phút)
export function checkRateLimit(
  key: string,
  windowMs = 5 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  cleanup(now);

  const existing = store.get(key);
  if (existing && existing.resetAt > now) {
    return {
      ok: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  store.set(key, { resetAt: now + windowMs });
  return { ok: true, retryAfterSeconds: 0 };
}

// Helper lấy IP từ headers Next.js
export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    // x-forwarded-for có thể có nhiều IP, lấy IP đầu (client thật)
    return xff.split(",")[0]?.trim() || "unknown";
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
