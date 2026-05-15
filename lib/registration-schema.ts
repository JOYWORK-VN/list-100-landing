import { z } from "zod";

// Các dropdown options — dùng chung giữa client (Form) và server (validate).

export const INDUSTRIES = [
  "Marcom / Quảng cáo / Truyền thông",
  "Công nghệ thông tin / Phần mềm",
  "Tài chính / Ngân hàng / Bảo hiểm",
  "Bán lẻ / Thương mại điện tử",
  "Sản xuất / Logistics",
  "Giáo dục / Đào tạo",
  "Y tế / Chăm sóc sức khỏe",
  "Bất động sản / Xây dựng",
  "Dịch vụ chuyên môn (Kế toán, Luật, Tư vấn)",
  "Khác",
] as const;

export const COMPANY_SIZES = [
  "15-30 người",
  "31-50 người",
  "51-100 người",
  "101-300 người",
  "301-500 người",
  "Trên 500 người",
] as const;

export const LOCATIONS = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Khác",
] as const;

export const POSITIONS = [
  "CEO / Founder",
  "HR Manager / HR Director",
  "Trưởng phòng / Phó phòng",
  "Khác",
] as const;

export const READINESS_OPTIONS = [
  "Đã sẵn sàng",
  "Cần tư vấn thêm",
] as const;

export const REFERRAL_SOURCES = [
  "LinkedIn",
  "Facebook",
  "Email",
  "Báo chí",
  "Bạn bè giới thiệu",
  "Khác",
] as const;

// Regex số điện thoại VN: hỗ trợ 03/05/07/08/09 + 9 chữ số, hoặc dạng +84
const VN_PHONE_REGEX = /^(?:\+?84|0)(?:3|5|7|8|9)\d{8}$/;

// Email cá nhân hay gặp — không reject mà chỉ cảnh báo nhẹ trên client.
// (Server không từ chối vì có thể có doanh nghiệp nhỏ dùng email cá nhân thật)
export const PERSONAL_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "yahoo.com.vn",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
];

// Schema chính — dùng cho cả client (RHF resolver) và server (validate body POST)
export const registrationSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Tên doanh nghiệp tối thiểu 2 ký tự")
    .max(200, "Tên doanh nghiệp quá dài"),
  industry: z.enum(INDUSTRIES, {
    message: "Vui lòng chọn ngành nghề",
  }),
  companySize: z.enum(COMPANY_SIZES, {
    message: "Vui lòng chọn quy mô nhân sự",
  }),
  location: z.enum(LOCATIONS, {
    message: "Vui lòng chọn địa điểm",
  }),
  contactName: z
    .string()
    .trim()
    .min(2, "Họ tên tối thiểu 2 ký tự")
    .max(100, "Họ tên quá dài"),
  contactPosition: z.enum(POSITIONS, {
    message: "Vui lòng chọn vị trí",
  }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email không hợp lệ"),
  phone: z
    .string()
    .trim()
    .regex(VN_PHONE_REGEX, "Số điện thoại không hợp lệ (ví dụ: 0987654321)"),
  readiness: z.enum(READINESS_OPTIONS, {
    message: "Vui lòng chọn trạng thái sẵn sàng",
  }),
  // Không bắt buộc — có thể bỏ trống
  referralSource: z
    .union([z.enum(REFERRAL_SOURCES), z.literal("")])
    .optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, "Bạn cần xác nhận cam kết để tiếp tục"),
  // Honeypot — bot tự động sẽ điền, người thật không thấy field này.
  // Cho phép mọi giá trị để route trả "success" giả khi có giá trị (bot không biết bị chặn)
  website: z.string().optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
