import { redirect } from "next/navigation";

// Root chỉ điều hướng sang trang landing duy nhất của app.
// Trong môi trường production, khách truy cập joywork.vn/list-100-doanh-nghiep-2026 trực tiếp.
export default function RootPage() {
  redirect("/list-100-doanh-nghiep-2026");
}
