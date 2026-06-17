import { ChevronDown } from "lucide-react";
import SectionCTA from "./SectionCTA";

// SECTION 8 — FAQ accordion
// Dùng <details><summary> native — không cần JS client, SEO crawl được full nội dung.
// Animation chevron xoay khi mở: [&[open]>summary_svg]:rotate-180
const faqs = [
  {
    question: "Đây có phải là bảng xếp hạng Top doanh nghiệp không?",
    answer:
      "Không. Đây là những doanh nghiệp đạt chuẩn kết quả khảo sát theo một quy trình minh bạch, không phải bảng xếp hạng, không so sánh các doanh nghiệp với nhau.",
  },
  {
    question: "Tham gia có mất phí không?",
    answer:
      "Toàn bộ quy trình khảo sát, đánh giá và công bố đều miễn phí cho tất cả doanh nghiệp.",
  },
  {
    question: "Khảo sát có thực sự ẩn danh không?",
    answer:
      "Câu trả lời trong khảo sát của bạn được JOYWORK quản lý, JOYWORK cam kết bảo mật và không tiết lộ câu trả lời của bạn. Công ty chỉ nhận được điểm tổng hợp về chất lượng môi trường làm việc chứ không nhận được danh tính và kết quả chi tiết của khảo sát. Khảo sát này là hoàn toàn ẩn danh đối với doanh nghiệp.",
  },
  {
    question: "Nếu doanh nghiệp không vào danh sách thì sao?",
    answer:
      "Kết quả sẽ được bảo mật tuyệt đối. Doanh Nghiệp nhận được báo cáo insight nội bộ để nâng cấp và tối ưu môi trường làm việc.",
  },
  {
    question:
      "HR có thể lọc danh sách email nhân viên trước khi gửi cho JOYWORK không?",
    answer:
      "JOYWORK yêu cầu danh sách email toàn bộ nhân sự và có cơ chế kiểm tra ngẫu nhiên. Đây là điều kiện cốt lõi để giữ tính khách quan của kết quả khảo sát.",
  },
  {
    question: "Doanh nghiệp đăng ký xong thì khi nào biết kết quả?",
    answer:
      "Tùy đợt khảo sát, thông thường trong vòng 1 tuần, JOYWORK sẽ hoàn thiện quy trình khảo sát với doanh nghiệp và công bố kết quả. Doanh nghiệp nhận báo cáo insight trước khi danh sách được công bố công khai.",
  },
];

export default function FAQ() {
  // Tạo JSON-LD FAQ Schema để Google Rich Results hiển thị câu hỏi
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <section
      id="cau-hoi"
      aria-labelledby="faq-heading"
      className="bg-white py-20 sm:py-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-joy-500">
            Hỏi & đáp
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl font-bold leading-tight text-deepspace sm:text-4xl"
          >
            Câu hỏi thường gặp
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-deepspace-50 rounded-2xl border border-deepspace-50 bg-white">
          {faqs.map((f, idx) => (
            <details
              key={f.question}
              className="group [&[open]>summary>svg]:rotate-180"
              {...(idx === 0 ? { open: true } : {})}
            >
              <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-5 text-left transition hover:bg-gray-50 focus-visible:bg-gray-50 sm:px-7 sm:py-6">
                <span className="flex-1 text-base font-semibold leading-snug text-deepspace sm:text-lg">
                  {f.question}
                </span>
                <ChevronDown
                  className="mt-1 h-5 w-5 flex-shrink-0 text-joy-500 transition-transform duration-200"
                  aria-hidden="true"
                />
              </summary>
              <div className="px-5 pb-6 text-sm leading-relaxed text-deepspace-300 sm:px-7 sm:text-base">
                {f.answer}
              </div>
            </details>
          ))}
        </div>

        <SectionCTA buttonText="Đăng ký tham gia để được tư vấn chi tiết hơn" />
      </div>
    </section>
  );
}
