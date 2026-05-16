"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import {
  registrationSchema,
  type RegistrationInput,
  INDUSTRIES,
  COMPANY_SIZES,
  LOCATIONS,
  POSITIONS,
  READINESS_OPTIONS,
  REFERRAL_SOURCES,
  PERSONAL_EMAIL_DOMAINS,
} from "@/lib/registration-schema";

// SECTION 9 — Form đăng ký
// Client component (RHF cần state). Validate cùng schema Zod với server.
export default function RegistrationForm() {
  const [submitState, setSubmitState] = useState<
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "success" }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      consent: false,
      referralSource: "",
      website: "", // honeypot
    },
  });

  // Cảnh báo nhẹ khi nhập email cá nhân — không reject
  const emailValue = watch("email") || "";
  const personalEmailWarning = (() => {
    const at = emailValue.lastIndexOf("@");
    if (at < 0) return false;
    const domain = emailValue.slice(at + 1).toLowerCase().trim();
    return PERSONAL_EMAIL_DOMAINS.includes(domain);
  })();

  // Lấy UTM params từ URL khi form mount
  const utmData = (() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      utmContent: params.get("utm_content") || undefined,
      utmTerm: params.get("utm_term") || undefined,
      pageUrl: window.location.href,
    };
  })();

  async function onSubmit(values: RegistrationInput) {
    setSubmitState({ status: "submitting" });
    try {
      // Endpoint trong route folder → match đường dẫn proxy joywork.vn
      const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, ...utmData }),
        }
      );
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(
          json?.message || "Gửi đăng ký không thành công. Vui lòng thử lại."
        );
      }
      setSubmitState({ status: "success" });
      reset();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Lỗi không xác định. Vui lòng thử lại.";
      setSubmitState({ status: "error", message });
    }
  }

  // Sau khi submit thành công → hiển thị màn hình cảm ơn
  if (submitState.status === "success") {
    return (
      <section
        id="dang-ky"
        aria-labelledby="form-heading"
        className="bg-deepspace py-20 text-white sm:py-24"
      >
        <div className="container">
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-joy-500">
              <CheckCircle2 className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h2
              id="form-heading"
              className="mt-6 text-2xl font-bold text-white sm:text-3xl"
            >
              Cảm ơn anh/chị đã đăng ký!
            </h2>
            <p className="mt-4 text-base text-white/80">
              JOYWORK đã ghi nhận đăng ký. Email xác nhận đã được gửi đến hộp
              thư của anh/chị. Đội ngũ sẽ liên hệ trong{" "}
              <strong className="text-white">3 ngày làm việc</strong> để hướng
              dẫn các bước tiếp theo.
            </p>
            <button
              onClick={() => setSubmitState({ status: "idle" })}
              className="mt-8 inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Đăng ký doanh nghiệp khác
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="dang-ky"
      aria-labelledby="form-heading"
      className="bg-deepspace py-20 text-white sm:py-24"
    >
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-pink-300">
              Đăng ký tham gia
            </p>
            <h2
              id="form-heading"
              className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl"
            >
              Đăng ký tham gia chương trình
            </h2>
            <p className="mt-4 text-base text-white/80 sm:text-lg">
              Điền thông tin dưới đây, đội ngũ JOYWORK sẽ liên hệ trong vòng 3
              ngày làm việc để hướng dẫn các bước tiếp theo.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-12 rounded-2xl bg-white p-6 text-deepspace shadow-2xl shadow-black/20 sm:p-10"
          >
            {/* Honeypot — visually hidden */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                width: "1px",
                height: "1px",
              }}
            >
              <label>
                Website (không điền)
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* 1. Tên doanh nghiệp */}
              <Field
                htmlFor="f-companyName"
                label="Tên doanh nghiệp"
                required
                error={errors.companyName?.message}
                className="sm:col-span-2"
              >
                <input
                  id="f-companyName"
                  type="text"
                  autoComplete="organization"
                  placeholder="VD: Công ty TNHH ABC"
                  className={inputCls(!!errors.companyName)}
                  {...register("companyName")}
                />
              </Field>

              {/* 2. Ngành nghề */}
              <Field
                htmlFor="f-industry"
                label="Ngành nghề"
                required
                error={errors.industry?.message}
              >
                <select
                  id="f-industry"
                  defaultValue=""
                  className={selectCls(!!errors.industry)}
                  {...register("industry")}
                >
                  <option value="" disabled>
                    Chọn ngành nghề
                  </option>
                  {INDUSTRIES.map((it) => (
                    <option key={it} value={it}>
                      {it}
                    </option>
                  ))}
                </select>
              </Field>

              {/* 4. Quy mô */}
              <Field
                htmlFor="f-companySize"
                label="Quy mô nhân sự"
                required
                error={errors.companySize?.message}
              >
                <select
                  id="f-companySize"
                  defaultValue=""
                  className={selectCls(!!errors.companySize)}
                  {...register("companySize")}
                >
                  <option value="" disabled>
                    Chọn quy mô
                  </option>
                  {COMPANY_SIZES.map((it) => (
                    <option key={it} value={it}>
                      {it}
                    </option>
                  ))}
                </select>
              </Field>

              {/* 5. Địa điểm */}
              <Field
                htmlFor="f-location"
                label="Địa điểm trụ sở chính"
                required
                error={errors.location?.message}
              >
                <select
                  id="f-location"
                  defaultValue=""
                  className={selectCls(!!errors.location)}
                  {...register("location")}
                >
                  <option value="" disabled>
                    Chọn địa điểm
                  </option>
                  {LOCATIONS.map((it) => (
                    <option key={it} value={it}>
                      {it}
                    </option>
                  ))}
                </select>
              </Field>

              {/* 6. Tên liên hệ */}
              <Field
                htmlFor="f-contactName"
                label="Họ và tên người liên hệ"
                required
                error={errors.contactName?.message}
              >
                <input
                  id="f-contactName"
                  type="text"
                  autoComplete="name"
                  placeholder="VD: Nguyễn Văn A"
                  className={inputCls(!!errors.contactName)}
                  {...register("contactName")}
                />
              </Field>

              {/* 7. Vị trí */}
              <Field
                htmlFor="f-contactPosition"
                label="Vị trí trong công ty"
                required
                error={errors.contactPosition?.message}
              >
                <select
                  id="f-contactPosition"
                  defaultValue=""
                  className={selectCls(!!errors.contactPosition)}
                  {...register("contactPosition")}
                >
                  <option value="" disabled>
                    Chọn vị trí
                  </option>
                  {POSITIONS.map((it) => (
                    <option key={it} value={it}>
                      {it}
                    </option>
                  ))}
                </select>
              </Field>

              {/* 8. Email */}
              <Field
                htmlFor="f-email"
                label="Email công việc"
                required
                error={errors.email?.message}
                warning={
                  personalEmailWarning && !errors.email
                    ? "Đây có vẻ là email cá nhân. Khuyến khích dùng email công việc để JOYWORK xác thực doanh nghiệp."
                    : undefined
                }
              >
                <input
                  id="f-email"
                  type="email"
                  autoComplete="email"
                  placeholder="ten@congty.vn"
                  className={inputCls(!!errors.email)}
                  {...register("email")}
                />
              </Field>

              {/* 9. Phone */}
              <Field
                htmlFor="f-phone"
                label="Số điện thoại"
                required
                error={errors.phone?.message}
              >
                <input
                  id="f-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="VD: 0987654321"
                  className={inputCls(!!errors.phone)}
                  {...register("phone")}
                />
              </Field>

              {/* 10. Sẵn sàng — radio (htmlFor trỏ về radio đầu tiên) */}
              <Field
                htmlFor="f-readiness-0"
                label="Doanh nghiệp đã sẵn sàng cho khảo sát toàn bộ nhân sự chưa?"
                required
                error={errors.readiness?.message}
                className="sm:col-span-2"
              >
                <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
                  {READINESS_OPTIONS.map((opt, idx) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-deepspace-50 bg-white p-3 transition has-[input:checked]:border-joy-500 has-[input:checked]:bg-joy-50"
                    >
                      <input
                        id={`f-readiness-${idx}`}
                        type="radio"
                        value={opt}
                        className="h-4 w-4 accent-joy-500"
                        {...register("readiness")}
                      />
                      <span className="text-sm font-medium text-deepspace">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </Field>

              {/* 11. Referral source — optional */}
              <Field
                htmlFor="f-referralSource"
                label="Bạn biết đến chương trình qua kênh nào?"
                hint="Không bắt buộc"
                error={errors.referralSource?.message}
                className="sm:col-span-2"
              >
                <select
                  id="f-referralSource"
                  defaultValue=""
                  className={selectCls(!!errors.referralSource)}
                  {...register("referralSource")}
                >
                  <option value="">— Chọn kênh —</option>
                  {REFERRAL_SOURCES.map((it) => (
                    <option key={it} value={it}>
                      {it}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Checkbox cam kết */}
            <div className="mt-6 rounded-lg border border-deepspace-50 bg-gray-50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-joy-500"
                  {...register("consent")}
                />
                <span className="text-sm leading-relaxed text-deepspace">
                  Tôi xác nhận đã được ban giám đốc đồng ý cho doanh nghiệp tham
                  gia chương trình và sẵn sàng cho JOYWORK gửi khảo sát đến toàn
                  bộ nhân sự.
                </span>
              </label>
              {errors.consent && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {errors.consent.message}
                </p>
              )}
            </div>

            {/* Server error */}
            {submitState.status === "error" && (
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle
                  className="mt-0.5 h-4 w-4 flex-shrink-0"
                  aria-hidden="true"
                />
                <span>{submitState.message}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-joy-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-joy-900/20 transition hover:bg-joy-400 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Đang gửi...
                </>
              ) : (
                "Gửi đăng ký"
              )}
            </button>

            <p className="mt-4 text-xs text-deepspace-300">
              Bằng việc gửi đăng ký, anh/chị đồng ý cho JOYWORK liên hệ qua
              email và điện thoại đã cung cấp.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

// --- Helpers UI ---

function Field({
  htmlFor,
  label,
  required,
  hint,
  error,
  warning,
  className = "",
  children,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  warning?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-deepspace"
      >
        {label}
        {required && <span className="ml-0.5 text-pink-500">*</span>}
      </label>
      {hint && !error && (
        <p className="mt-1 text-xs text-deepspace-300">{hint}</p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {error}
        </p>
      )}
      {warning && (
        <p className="mt-1.5 text-xs text-amber-700">{warning}</p>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "block w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-deepspace placeholder:text-deepspace-200 transition",
    "focus:border-joy-500 focus:ring-2 focus:ring-joy-200 focus:outline-none",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
      : "border-deepspace-50",
  ].join(" ");
}

function selectCls(hasError: boolean) {
  return inputCls(hasError) + " pr-10 cursor-pointer";
}
