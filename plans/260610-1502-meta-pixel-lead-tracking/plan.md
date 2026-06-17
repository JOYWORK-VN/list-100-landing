---
title: Meta Pixel Lead tracking for registration form
description: >-
  Install Meta Pixel (ID 1377788970847688) site-wide and fire Lead event when
  registration form submits successfully
status: completed
priority: P2
branch: main
tags:
  - tracking
  - meta-pixel
  - analytics
blockedBy: []
blocks: []
created: '2026-06-10T08:08:36.705Z'
createdBy: 'ck:plan'
source: skill
---

# Meta Pixel Lead tracking for registration form

## Overview

Landing page cần Meta Pixel (ID `1377788970847688`) để chạy ads tracking:
1. **PageView** — load pixel base code trên mọi trang (root layout).
2. **Lead** — bắn `fbq('track', 'Lead')` khi user submit form "Đăng ký tham gia chương trình" thành công (sau khi API `/api/register` trả `ok`).

Tech stack: Next.js App Router. Pixel loads qua `next/script` strategy `afterInteractive`. Lead event bắn từ client component `RegistrationForm.tsx` — chỉ khi submit thành công để tránh đếm lead ảo (validation fail / server error).

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Add Meta Pixel base code](./phase-01-add-meta-pixel-base-code.md) | Completed |
| 2 | [Fire Lead event on form submit](./phase-02-fire-lead-event-on-form-submit.md) | Completed |

## Key Decisions

- **Lead fires on SUCCESS only** (sau `res.ok && json.ok`), không fire lúc click submit — đảm bảo lead = đăng ký thật sự vào hệ thống.
- **`fbq` gọi defensively** (`typeof window.fbq === "function"`) — ad blockers chặn fbevents.js là chuyện thường, không được làm crash flow submit.
- **Pixel ID hardcode** trong constant — landing page single-purpose, không cần env var (YAGNI). Có thể chuyển `NEXT_PUBLIC_META_PIXEL_ID` sau nếu cần multi-env.
- **`next/script` + `afterInteractive`** thay vì raw `<script>` trong head — chuẩn Next.js, không block hydration.

## Dependencies

None — standalone change, không đụng plan nào khác (plans/ trống trước plan này).
