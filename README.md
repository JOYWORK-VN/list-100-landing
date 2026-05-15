# JOYWORK · List 100 Landing Page

Landing page chương trình **List 100 Doanh nghiệp có Môi trường Làm việc Tốt 2026**.
URL production: **`joywork.vn/list-100-doanh-nghiep-2026`**

Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · React Hook Form · Zod · Resend · Lucide.

Lighthouse: Performance **96** · SEO **100** · Accessibility **100** · Best Practices **100**.

---

## 1. Chạy local

```bash
# Clone về máy, sau đó:
cd list-100-landing
npm install
cp .env.example .env.local   # rồi điền các key thật vào .env.local
npm run dev
```

Mở `http://localhost:3000/list-100-doanh-nghiep-2026`.

> Không có env vars vẫn chạy được UI — chỉ phần lưu Google Sheet và gửi email
> sẽ bị bỏ qua (có log warning ở console server).

### Scripts

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Build production |
| `npm run start` | Chạy production build |
| `npm run lint` | ESLint |

---

## 2. Cấu trúc thư mục

```
list-100-landing/
├── app/
│   ├── layout.tsx                          # Root layout: Inter, lang="vi", metadata gốc
│   ├── page.tsx                            # / → redirect sang /list-100-doanh-nghiep-2026
│   ├── icon.tsx                            # Favicon động
│   ├── sitemap.ts · robots.ts · globals.css
│   └── list-100-doanh-nghiep-2026/
│       ├── layout.tsx                      # SEO metadata + JSON-LD (Event + Organization)
│       ├── page.tsx                        # Compose 10 section
│       ├── opengraph-image.tsx             # OG image động 1200×630
│       ├── api/register/route.ts           # POST endpoint xử lý đăng ký
│       └── components/                     # 10 component section
├── lib/
│   ├── site-config.ts                      # SITE_URL, PAGE_URL từ env
│   ├── registration-schema.ts              # Zod schema dùng chung client/server
│   └── rate-limit.ts                       # Rate limit in-memory theo IP
├── public/                                 # Logo JOYWORK
└── .env.example                            # Mẫu env vars
```

---

## 3. Env vars

Tham khảo `.env.example`. Set trên Vercel ở **Settings → Environment Variables**.

| Tên | Bắt buộc | Mô tả |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✓ | `https://joywork.vn` (production) |
| `RESEND_API_KEY` | ✓ | API key Resend, dạng `re_xxx` |
| `RESEND_FROM_EMAIL` | ✓ | Email "from" đã verify domain (vd `list100@joywork.vn`) |
| `TEAM_NOTIFICATION_EMAIL` | ✓ | Email nhận đăng ký mới |
| `GOOGLE_SHEET_WEBHOOK_URL` | ✓ | URL Apps Script Web App |

> Trong giai đoạn dev, có thể bỏ trống các key — UI vẫn hoạt động đầy đủ,
> chỉ không lưu Sheet và không gửi email thật.

---

## 4. Setup Resend (gửi email)

Resend là dịch vụ gửi email transactional miễn phí 100 email/ngày, deliverability cao.

### 4.1. Tạo account
1. Truy cập https://resend.com → Sign up bằng email công ty
2. Verify email account

### 4.2. Verify domain `joywork.vn`
1. Resend Dashboard → **Domains** → **Add Domain** → nhập `joywork.vn`
2. Resend hiển thị 3-4 DNS record (SPF, DKIM, DMARC). Ví dụ:

   | Loại | Tên | Giá trị |
   |---|---|---|
   | MX | `send.joywork.vn` | `feedback-smtp.us-east-1.amazonses.com` (prio 10) |
   | TXT | `send.joywork.vn` | `v=spf1 include:amazonses.com ~all` |
   | TXT | `resend._domainkey.joywork.vn` | `p=MIGfMA0GCSq...` (key dài, copy nguyên) |
   | TXT (optional) | `_dmarc.joywork.vn` | `v=DMARC1; p=none;` |

3. Thêm các record trên vào DNS provider của `joywork.vn`
   (CloudFlare / Tenten / GoDaddy / Vinahost — tùy nơi mua domain)
4. Quay lại Resend → bấm **Verify DNS Records** → đợi 1-30 phút

### 4.3. Tạo API key
1. Resend Dashboard → **API Keys** → **Create API Key**
2. Permission: **Sending access** · Domain: `joywork.vn`
3. Copy key (chỉ hiện 1 lần) → paste vào env `RESEND_API_KEY`

### 4.4. Cài đặt `RESEND_FROM_EMAIL`
- Đề xuất: `list100@joywork.vn` (cần tạo địa chỉ này trên hệ thống email
  của JOYWORK hoặc chỉ cần là alias — Resend không cần inbox thật)
- Có thể dùng `noreply@joywork.vn` nếu không muốn nhận reply

---

## 5. Setup Google Sheet (lưu đăng ký)

### 5.1. Tạo Sheet
1. Tạo Google Sheet mới: https://sheets.new
2. Đặt tên: `List 100 - Đăng ký 2026`
3. Hàng 1 — header (copy nguyên dòng dưới):

```
timestamp	companyName	taxCode	industry	companySize	location	contactName	contactPosition	email	phone	readiness	referralSource
```

### 5.2. Viết Apps Script
1. Trong Sheet: **Extensions → Apps Script**
2. Xóa code mặc định, paste đoạn sau:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.companyName,
      data.taxCode,
      data.industry,
      data.companySize,
      data.location,
      data.contactName,
      data.contactPosition,
      data.email,
      data.phone,
      data.readiness,
      data.referralSource || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Save** (Ctrl+S) — đặt tên project tùy ý

### 5.3. Deploy Web App
1. Bấm **Deploy → New deployment**
2. Bánh răng ⚙ chọn **Web app**
3. Cấu hình:
   - **Description**: `List 100 register endpoint`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` ← quan trọng để Next.js POST được
4. Bấm **Deploy** → cho phép permissions (Apps Script sẽ yêu cầu chấp nhận)
5. Copy URL dạng: `https://script.google.com/macros/s/AKfycb.../exec`
6. Paste vào env `GOOGLE_SHEET_WEBHOOK_URL`

> **Khi cần sửa script**: Edit code → **Deploy → Manage deployments** →
> bấm icon ✏ ở deployment cũ → đổi Version sang "New version" → **Deploy**.
> URL không đổi.

---

## 6. Deploy Vercel

### 6.1. Push code lên Git
1. Tạo repo mới trên GitHub: `joywork-list-100-landing` (Private)
2. Trong thư mục project:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:joywork/joywork-list-100-landing.git
git push -u origin main
```

### 6.2. Import vào Vercel
1. Vào https://vercel.com → Sign in bằng GitHub
2. **Add New → Project** → chọn repo `joywork-list-100-landing`
3. Framework Preset: **Next.js** (tự nhận diện)
4. Root Directory: `./` (mặc định)
5. **Environment Variables** → add 5 key đã chuẩn bị ở mục 3
6. Bấm **Deploy** → đợi 1-2 phút

### 6.3. Verify
1. Mở URL Vercel cung cấp, ví dụ: `https://joywork-list-100-landing.vercel.app/list-100-doanh-nghiep-2026`
2. Thử submit form với email cá nhân của Sếp → kiểm tra:
   - Có hiển thị màn hình "Cảm ơn"?
   - Có email xác nhận vào hộp thư?
   - Hàng mới có xuất hiện trong Google Sheet?

---

## 7. Reverse-proxy `joywork.vn/list-100-doanh-nghiep-2026`

Mục tiêu: khách truy cập `joywork.vn/list-100-doanh-nghiep-2026` thấy đúng landing
(không redirect, không thay đổi URL trên thanh địa chỉ).

### Option A — joywork.vn dùng Nginx (VPS / Cloud server)

Thêm vào server block của joywork.vn:

```nginx
location /list-100-doanh-nghiep-2026 {
    proxy_pass https://joywork-list-100-landing.vercel.app;
    proxy_set_header Host joywork-list-100-landing.vercel.app;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    proxy_ssl_server_name on;
}
```

Reload Nginx: `sudo nginx -t && sudo systemctl reload nginx`

### Option B — joywork.vn cũng host trên Vercel

Trong project chính của joywork.vn, thêm vào `next.config.js` (hoặc `vercel.json`):

```js
async rewrites() {
  return [
    {
      source: "/list-100-doanh-nghiep-2026",
      destination: "https://joywork-list-100-landing.vercel.app/list-100-doanh-nghiep-2026",
    },
    {
      source: "/list-100-doanh-nghiep-2026/:path*",
      destination: "https://joywork-list-100-landing.vercel.app/list-100-doanh-nghiep-2026/:path*",
    },
  ];
}
```

### Option C — joywork.vn qua CloudFlare

Vào CloudFlare → **Rules → Origin Rules** → thêm rule:
- When: `URI Path starts with /list-100-doanh-nghiep-2026`
- Then: Rewrite host header → `joywork-list-100-landing.vercel.app`

### Verify proxy
Sau khi cấu hình, mở `https://joywork.vn/list-100-doanh-nghiep-2026` — phải:
- HTTP 200
- Hiển thị landing chính xác (không phải trang chủ joywork.vn)
- URL trên thanh địa chỉ giữ nguyên (không đổi sang vercel.app)

---

## 8. Sau khi go-live

### 8.1. Update sitemap chính của joywork.vn
Thêm dòng sau vào `joywork.vn/sitemap.xml`:
```xml
<url>
  <loc>https://joywork.vn/list-100-doanh-nghiep-2026</loc>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
```

### 8.2. Submit URL lên Google Search Console
1. https://search.google.com/search-console → property `joywork.vn`
2. **URL Inspection** → nhập `https://joywork.vn/list-100-doanh-nghiep-2026` → **Request Indexing**
3. Sau 24-72h check lại — URL sẽ xuất hiện trên Google

### 8.3. Test OG share
- Facebook debug: https://developers.facebook.com/tools/debug/
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Nhập URL `https://joywork.vn/list-100-doanh-nghiep-2026` → kiểm tra ảnh OG hiển thị đúng

### 8.4. Test Rich Results (JSON-LD)
https://search.google.com/test/rich-results → nhập URL — phải nhận diện được:
- **Event** (chương trình List 100)
- **Organization** (JOYWORK)
- **FAQPage** (6 câu FAQ)

---

## 9. Bảo trì / cập nhật nội dung

### Đổi nội dung text
Các section nằm ở `app/list-100-doanh-nghiep-2026/components/*.tsx`. Tìm chuỗi cần đổi, edit, commit, push → Vercel tự deploy.

### Đổi nội dung email confirm
Sửa hàm `renderUserConfirmationEmail` và `renderTeamNotificationEmail` trong `app/list-100-doanh-nghiep-2026/api/register/route.ts`.

### Đổi options dropdown
Sửa các constant `INDUSTRIES`, `COMPANY_SIZES`, `LOCATIONS`, `POSITIONS`,
`READINESS_OPTIONS`, `REFERRAL_SOURCES` ở `lib/registration-schema.ts`.

### Đổi rate limit
Mặc định 1 lần/5 phút/IP. Sửa `windowMs` trong `lib/rate-limit.ts` nếu cần.

---

## 10. Checklist trước khi launch

- [ ] Resend domain verified, API key đã set vào Vercel
- [ ] Google Sheet + Apps Script deployed, URL đã set vào Vercel
- [ ] Test submit form với email thật từ Vercel URL → có email + có dòng Sheet
- [ ] Reverse-proxy `joywork.vn/list-100-doanh-nghiep-2026` chạy
- [ ] Test submit form từ joywork.vn URL → có email + có dòng Sheet
- [ ] Sitemap chính joywork.vn đã thêm URL
- [ ] Google Search Console request indexing
- [ ] Test Facebook + LinkedIn share thấy OG image đẹp
- [ ] Test Rich Results nhận diện Event, Organization, FAQPage
- [ ] Lighthouse trên joywork.vn URL: Performance ≥ 90, SEO ≥ 95, A11y ≥ 90

---

## 11. Hỗ trợ

Mọi vấn đề về landing này, liên hệ: `list100@joywork.vn`

© 2026 JOYWORK
