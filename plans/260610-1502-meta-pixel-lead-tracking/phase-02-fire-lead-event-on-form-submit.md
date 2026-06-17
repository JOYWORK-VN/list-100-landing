---
phase: 2
title: Fire Lead event on form submit
status: completed
priority: P2
effort: 30m
dependencies:
  - 1
---

# Phase 2: Fire Lead event on form submit

## Overview

Bắn `fbq('track', 'Lead')` trong `RegistrationForm.tsx` khi submit thành công — sau khi `/api/register` trả `ok: true`, ngay trước `setSubmitState({ status: "success" })`.

## Requirements

- Functional: Lead event chỉ fire khi đăng ký thành công (không fire khi validation fail / server error).
- Non-functional: gọi `fbq` defensively — nếu pixel bị ad blocker chặn, submit flow vẫn hoạt động bình thường.

## Architecture

- Helper `trackLead()` đặt ngay trong `MetaPixel.tsx` (cùng nơi own pixel concern) hoặc inline trong form — chọn export từ `MetaPixel.tsx` để DRY nếu sau này thêm event khác.
- `window.fbq` typed qua declare global trong `MetaPixel.tsx`.

## Related Code Files

- Modify: `app/components/MetaPixel.tsx` (thêm type declaration + `trackLead` helper)
- Modify: `app/components/RegistrationForm.tsx` (gọi `trackLead()` trong `onSubmit` success path)

## Implementation Steps

1. Trong `app/components/MetaPixel.tsx`, thêm:

```tsx
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Bắn Lead event — no-op nếu pixel bị chặn (ad blocker).
export function trackLead() {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead");
  }
}
```

2. Trong `app/components/RegistrationForm.tsx`:
   - Import: `import { trackLead } from "./MetaPixel";`
   - Trong `onSubmit`, sau check `if (!res.ok || !json.ok) throw ...` và trước `setSubmitState({ status: "success" })`, thêm `trackLead();`

```ts
      if (!res.ok || !json.ok) {
        throw new Error(/* ... giữ nguyên ... */);
      }
      trackLead();
      setSubmitState({ status: "success" });
```

3. Chạy `npm run build` / `npx tsc --noEmit` xác nhận compile sạch.

## Success Criteria

- [ ] `trackLead()` exported từ `MetaPixel.tsx`, gọi `window.fbq` defensively
- [ ] `RegistrationForm.tsx` gọi `trackLead()` chỉ trong success path
- [ ] Build/typecheck pass
- [ ] Verify: submit form thành công trên dev → Network tab có request `facebook.com/tr?...ev=Lead` (hoặc dùng Meta Pixel Helper extension)
- [ ] Verify: submit fail (server error) → KHÔNG có Lead request

## Risk Assessment

- Double-fire khi user bấm "Đăng ký doanh nghiệp khác" rồi submit lần 2 → chấp nhận: đó là 2 lead thật (2 doanh nghiệp khác nhau).
- Pixel chưa load xong khi user submit cực nhanh → `fbq` queue stub đã tồn tại ngay sau `afterInteractive`, event được queue và gửi khi script load. Edge case fbq hoàn toàn absent → no-op, không mất submit.

## Next Steps

Sau khi xong: test thật bằng Meta Events Manager → Test Events tab để confirm Lead về đúng pixel `1377788970847688`.
