---
phase: 1
title: Add Meta Pixel base code
status: completed
priority: P2
effort: 30m
dependencies: []
---

# Phase 1: Add Meta Pixel base code

## Overview

Tạo component `MetaPixel` chứa pixel base code (ID `1377788970847688`) bằng `next/script`, mount vào root layout để fire `PageView` trên mọi trang.

## Requirements

- Functional: pixel script load trên mọi page, `fbq('init')` + `fbq('track', 'PageView')` chạy 1 lần khi page load; có `<noscript>` fallback img.
- Non-functional: không block hydration (strategy `afterInteractive`), không lỗi khi ad blocker chặn fbevents.js.

## Architecture

- Component mới `app/components/MetaPixel.tsx` — render `<Script id="meta-pixel" strategy="afterInteractive">` với inline pixel snippet + `<noscript>` tracking img.
- Mount trong `app/layout.tsx` bên trong `<body>` (cạnh các script JSON-LD hiện có).
- Pixel ID export constant `META_PIXEL_ID = "1377788970847688"` từ chính file component (chưa cần file riêng — KISS).

## Related Code Files

- Create: `app/components/MetaPixel.tsx`
- Modify: `app/layout.tsx` (import + mount MetaPixel trong body)

## Implementation Steps

1. Tạo `app/components/MetaPixel.tsx`:

```tsx
import Script from "next/script";

export const META_PIXEL_ID = "1377788970847688";

// Meta Pixel base code — fire PageView trên mọi trang.
export default function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
```

2. Trong `app/layout.tsx`: import `MetaPixel` và render `<MetaPixel />` trong `<body>` (sau 2 script JSON-LD, trước `{children}`).
3. Chạy `npm run build` (hoặc `npx tsc --noEmit`) xác nhận compile sạch.

## Success Criteria

- [ ] `app/components/MetaPixel.tsx` tồn tại, dùng `next/script` strategy `afterInteractive`
- [ ] `<MetaPixel />` mounted trong root layout body
- [ ] Build/typecheck pass
- [ ] Dev server: Network tab thấy request `fbevents.js` + request `facebook.com/tr?...ev=PageView`

## Risk Assessment

- Ad blocker chặn fbevents.js → pixel không load, nhưng site không lỗi (script async, queue stub vẫn tồn tại). Không cần xử lý thêm.
- `next/script` inline cần `id` prop — đã có (`meta-pixel`).
