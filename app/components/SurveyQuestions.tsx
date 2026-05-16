import {
  Activity,
  GraduationCap,
  Scale,
  ShieldCheck,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

// Nội dung tab "Câu hỏi khảo sát mẫu" — sao chép theo file `cau-hoi-khao-sat.docx`.
// Mục đích: doanh nghiệp xem trước bộ câu hỏi 25 câu chấm điểm trước khi đăng ký.

// ---- Phần A: Thông tin cơ bản (không tính điểm) ----
const partA: { code: string; question: string; options: string }[] = [
  {
    code: "A1",
    question: "Bạn đã làm việc tại công ty này được bao lâu?",
    options:
      "(1) Dưới 6 tháng · (2) 6-12 tháng · (3) 1-2 năm · (4) 2-5 năm · (5) Trên 5 năm",
  },
  {
    code: "A2",
    question: "Cấp bậc hiện tại của bạn?",
    options:
      "(1) Thực tập sinh / Mới đi làm · (2) Nhân viên · (3) Chuyên viên / Senior · (4) Trưởng nhóm / Quản lý cấp trung · (5) Quản lý cấp cao / Giám đốc",
  },
  {
    code: "A3",
    question: "Bộ phận của bạn thuộc nhóm nào?",
    options:
      "(1) Kinh doanh / Sales · (2) Vận hành / Sản xuất · (3) Hành chính - Nhân sự · (4) Kỹ thuật / Sản phẩm · (5) Marketing / Truyền thông · (6) Tài chính - Kế toán · (7) Khác",
  },
  {
    code: "A4",
    question: "Bạn có dự định gắn bó với công ty này trong 6 tháng tới không?",
    options:
      "(1) Chắc chắn không · (2) Có thể không · (3) Chưa chắc · (4) Có thể có · (5) Chắc chắn có",
  },
];

// ---- Phần B: 25 câu chấm điểm (5 nhóm × 5 câu) ----
type Question = { code: string; question: string; note: string };
type Group = {
  number: number;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  questions: Question[];
};
const partB: Group[] = [
  {
    number: 1,
    icon: Target,
    title: "RÕ RÀNG & MINH BẠCH",
    subtitle:
      "Vai trò có rõ ràng không? Kỳ vọng công việc có minh bạch không? Bạn có nhận được phản hồi cụ thể từ cấp trên không?",
    questions: [
      {
        code: "B1.1",
        question: "Tôi hiểu rõ vai trò và trách nhiệm của mình tại công ty.",
        note: "Bao gồm phạm vi công việc, ranh giới nhiệm vụ với đồng nghiệp.",
      },
      {
        code: "B1.2",
        question:
          "Kỳ vọng về kết quả công việc của tôi được thể hiện rõ ràng (mục tiêu, KPI, deadline).",
        note: "Không phải đoán ý sếp, không phải mơ hồ về thước đo.",
      },
      {
        code: "B1.3",
        question:
          "Tôi nhận được phản hồi cụ thể về công việc từ quản lý trực tiếp ít nhất 1 lần/tháng.",
        note: "Phản hồi cụ thể nghĩa là chỉ ra việc gì tốt, việc gì cần cải thiện, không phải chỉ chung chung 'làm tốt nhé'.",
      },
      {
        code: "B1.4",
        question:
          "Khi có thay đổi quan trọng (chiến lược, nhân sự, lương thưởng), công ty thông báo rõ ràng và kịp thời cho tôi.",
        note: "Không phải biết qua lời đồn hay đồng nghiệp.",
      },
      {
        code: "B1.5",
        question:
          "Tôi hiểu cách quyết định được đưa ra trong công ty (ai có quyền quyết, dựa trên tiêu chí nào).",
        note: "Áp dụng cho cả quyết định nhỏ trong nhóm và quyết định lớn của công ty.",
      },
    ],
  },
  {
    number: 2,
    icon: GraduationCap,
    title: "PHÁT TRIỂN CON NGƯỜI",
    subtitle:
      "Bạn có cơ hội phát triển nghề nghiệp không? Bạn có học được gì từ quản lý không? Bạn có được giao thử thách phù hợp không?",
    questions: [
      {
        code: "B2.1",
        question:
          "Tôi có cơ hội học và phát triển kỹ năng mới trong công việc hiện tại.",
        note: "Cơ hội thực tế chứ không chỉ trên giấy tờ.",
      },
      {
        code: "B2.2",
        question:
          "Tôi học hỏi được điều có giá trị từ quản lý trực tiếp của mình.",
        note: "Có thể là kiến thức chuyên môn, cách giải quyết vấn đề, hay tư duy nghề nghiệp.",
      },
      {
        code: "B2.3",
        question:
          "Tôi được giao những thử thách vừa sức nhưng giúp tôi tiến bộ.",
        note: "Không quá dễ đến mức nhàm chán, không quá khó đến mức kiệt sức.",
      },
      {
        code: "B2.4",
        question:
          "Tôi nhìn thấy lộ trình phát triển nghề nghiệp rõ ràng tại công ty này trong 1-2 năm tới.",
        note: "Bạn biết rõ mình sẽ ở đâu trong 1-2 năm tới.",
      },
      {
        code: "B2.5",
        question:
          "Khi tôi mắc sai lầm, công ty xem đó là cơ hội học hỏi thay vì lỗi để trừng phạt.",
        note: "Không bao gồm sai lầm cố ý hay lặp đi lặp lại.",
      },
    ],
  },
  {
    number: 3,
    icon: Users,
    title: "VĂN HÓA & QUẢN TRỊ",
    subtitle:
      "Sếp có lắng nghe không? Môi trường có lành mạnh không? Đồng nghiệp có hỗ trợ nhau không?",
    questions: [
      {
        code: "B3.1",
        question:
          "Quản lý trực tiếp của tôi thật sự lắng nghe khi tôi nêu ý kiến hoặc lo ngại.",
        note: "Lắng nghe nghĩa là cân nhắc nghiêm túc, không phải gật đầu cho qua.",
      },
      {
        code: "B3.2",
        question:
          "Môi trường làm việc tại công ty an toàn (không có hành vi bắt nạt, quấy rối, hay phân biệt đối xử).",
        note: "Bạn chưa từng trải qua hoặc chưa từng chứng kiến sự việc tương tự.",
      },
      {
        code: "B3.3",
        question: "Môi trường làm việc lành mạnh (không toxic).",
        note: "Đồng nghiệp không nói xấu, cô lập nhau, chia bè phái.",
      },
      {
        code: "B3.4",
        question:
          "Tôi cảm thấy được tôn trọng tại nơi làm việc, kể cả khi không đồng ý với quan điểm của số đông.",
        note: "Tôn trọng cả khi bất đồng quan điểm.",
      },
      {
        code: "B3.5",
        question: "Lãnh đạo công ty hành xử nhất quán giữa lời nói và việc làm.",
        note: "Cam kết gì thì làm đó, không phải nói một đằng làm một nẻo.",
      },
    ],
  },
  {
    number: 4,
    icon: Activity,
    title: "TÍNH BỀN VỮNG",
    subtitle:
      "Khối lượng công việc có hợp lý không? Deadline có thực tế không? Công ty có chăm lo đời sống tinh thần để nhân viên làm việc bền vững không?",
    questions: [
      {
        code: "B4.1",
        question:
          "Khối lượng công việc của tôi phù hợp với năng lực và mức lương, được thoả thuận rõ ràng với công ty.",
        note: "Có thể có tuần cao điểm nhưng phần lớn thời gian là vừa sức.",
      },
      {
        code: "B4.2",
        question:
          "Deadline được giao một cách hợp lý, phù hợp tính chất công việc và được thống nhất từ đầu giữa tôi và đồng nghiệp.",
        note: "Không phải kiểu 'gấp gấp' liên tục mà không có lý do chính đáng.",
      },
      {
        code: "B4.3",
        question: "Tôi không bất mãn với hoạt động làm thêm giờ.",
        note: "Nếu có làm thêm giờ thì có lý do rõ ràng và được ghi nhận xứng đáng.",
      },
      {
        code: "B4.4",
        question: "Công ty thực hiện đầy đủ nghĩa vụ theo đúng Bộ Luật lao động.",
        note: "Bao gồm các quy định về thuế, bảo hiểm, thai sản, nghỉ phép…",
      },
      {
        code: "B4.5",
        question:
          "Công ty có các hoạt động chăm lo đời sống tinh thần và sức khỏe cho nhân viên (bữa ăn nhẹ, nghỉ giữa giờ, sự kiện gắn kết...).",
        note: "Hoạt động thực tế và đều đặn, không phải chỉ vài dịp lễ tết. Ví dụ: trà bánh giờ nghỉ, lớp yoga hàng tuần, team building, ngày sinh nhật chung.",
      },
    ],
  },
  {
    number: 5,
    icon: Scale,
    title: "PHÚC LỢI & CÔNG BẰNG",
    subtitle:
      "Lương và đãi ngộ có công bằng không? Chính sách có minh bạch không? Cơ sở vật chất văn phòng có đáp ứng tốt nhu cầu làm việc không?",
    questions: [
      {
        code: "B5.1",
        question:
          "Mức lương hiện tại của tôi tương xứng với năng lực và đóng góp tôi mang lại.",
        note: "Tương xứng theo cảm nhận của bạn so với thị trường và so với người cùng cấp trong công ty.",
      },
      {
        code: "B5.2",
        question:
          "Chính sách lương thưởng và phúc lợi tại công ty được trình bày và thực hiện minh bạch.",
        note: "Bạn biết rõ căn cứ tăng lương, cách tính thưởng, các khoản phúc lợi mình được hưởng.",
      },
      {
        code: "B5.3",
        question:
          "Thời điểm nhận lương, thưởng được thực hiện đúng theo cam kết giữa bạn và công ty.",
        note: "Việc trả lương, thưởng thường xuyên đúng hạn, và được báo trước nếu trễ hơn dự kiến.",
      },
      {
        code: "B5.4",
        question:
          "Việc đánh giá hiệu suất và quyết định tăng lương / thăng tiến tại công ty là công bằng.",
        note: "Dựa trên năng lực và kết quả, không phải quan hệ cá nhân.",
      },
      {
        code: "B5.5",
        question:
          "Cơ sở vật chất tại văn phòng đáp ứng tốt nhu cầu làm việc của tôi (không gian, thiết bị, ánh sáng, vệ sinh, khu vực nghỉ ngơi).",
        note: "Bao gồm bàn ghế, máy tính, mạng internet, điều hòa, nhà vệ sinh, pantry, khu nghỉ trưa. Tiện nghi đủ để làm việc hiệu quả và thoải mái cả ngày.",
      },
    ],
  },
];

// ---- Phần C: Câu hỏi mở (tùy chọn, không tính điểm) ----
const partC: { code: string; question: string; hint?: string }[] = [
  {
    code: "C1",
    question: "Điều bạn thích nhất khi làm việc tại công ty này là gì?",
    hint: "1-2 câu",
  },
  {
    code: "C2",
    question: "Điều bạn nghĩ công ty cần cải thiện nhất là gì?",
    hint: "1-2 câu, hãy thẳng thắn",
  },
  {
    code: "C3",
    question: "Bạn có sẵn sàng giới thiệu công ty cho bạn bè không? Vì sao?",
    hint: "Có / Không. Vì sao?",
  },
  {
    code: "C4",
    question:
      "Tôi hoàn toàn tự do khi trả lời khảo sát này, không bị áp lực phải trả lời theo định hướng ở bất cứ câu nào.",
    hint: "Có / Không",
  },
];

// ---- Thang điểm cho 25 câu chấm điểm ----
const scale = [
  { level: "Rất không đồng ý", point: 0, meaning: "Hoàn toàn không đúng với trải nghiệm của tôi" },
  { level: "Không đồng ý", point: 1, meaning: "Phần lớn không đúng" },
  { level: "Bình thường", point: 2, meaning: "Có lúc đúng có lúc không" },
  { level: "Đồng ý", point: 3, meaning: "Phần lớn đúng" },
  { level: "Rất đồng ý", point: 4, meaning: "Hoàn toàn đúng với trải nghiệm của tôi" },
];

export default function SurveyQuestions() {
  return (
    <section
      id="cau-hoi-mau-section"
      aria-labelledby="survey-heading"
      className="bg-gray-50 py-20 sm:py-24"
    >
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-joy-500">
            JOYWORK
          </p>
          <h2
            id="survey-heading"
            className="mt-3 text-3xl font-bold leading-tight text-deepspace sm:text-4xl"
          >
            Bộ câu hỏi khảo sát môi trường làm việc
          </h2>
          <p className="mt-4 text-base leading-relaxed text-deepspace-300 sm:text-lg">
            Đây chỉ là mẫu để doanh nghiệp và nhân viên hiểu được nội dung của
            toàn bộ khảo sát, không phải phần mềm để làm bài khảo sát. JOYWORK
            sẽ gửi bài khảo sát thực tế đến các nhân viên sau khi doanh nghiệp
            đăng ký tham gia.
          </p>
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-deepspace shadow-sm">
            <span>25 câu chấm điểm</span>
            <span className="text-deepspace-300">·</span>
            <span>7-10 phút</span>
            <span className="text-deepspace-300">·</span>
            <span className="text-joy-600">Hoàn toàn ẩn danh</span>
          </div>
        </div>

        {/* 1. Cam kết của JOYWORK */}
        <div className="mx-auto mt-14 max-w-4xl rounded-2xl border border-joy-100 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-joy-50 text-joy-500">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-deepspace sm:text-2xl">
              1. Cam kết của JOYWORK với người làm khảo sát
            </h3>
          </div>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-deepspace-300 sm:text-base">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-joy-500" />
              <span>
                Khảo sát này hoàn toàn ẩn danh. JOYWORK không thu thập tên hay
                bất kỳ thông tin nào có thể nhận dạng người làm khảo sát.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-joy-500" />
              <span>
                Kết quả khảo sát chỉ được tổng hợp ở dạng số liệu chung của
                toàn công ty. Câu trả lời cá nhân của bạn KHÔNG được gửi cho
                CEO, HR, hay bất kỳ ai trong công ty.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-joy-500" />
              <span>
                JOYWORK là bên thứ ba độc lập, không liên kết về bất cứ lợi
                ích nào với công ty bạn đang làm.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-joy-500" />
              <span>
                Để khảo sát hợp lệ, bạn cần trả lời đủ 25 câu.
              </span>
            </li>
          </ul>
        </div>

        {/* 2. Cách trả lời */}
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-deepspace-50 bg-white p-6 sm:p-8">
          <h3 className="text-xl font-bold text-deepspace sm:text-2xl">
            2. Cách trả lời
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-deepspace-300 sm:text-base">
            Bộ khảo sát có 25 câu chấm điểm chia thành 5 nhóm, mỗi nhóm 5 câu.
            Mỗi câu trả lời theo thang 5 mức:
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b border-deepspace-50 text-xs font-semibold uppercase tracking-wider text-deepspace-300">
                  <th className="py-3 pr-4">Mức</th>
                  <th className="px-4 py-3">Điểm</th>
                  <th className="py-3 pl-4">Ý nghĩa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-deepspace-50">
                {scale.map((s) => (
                  <tr key={s.level}>
                    <td className="py-3 pr-4 font-semibold text-deepspace">
                      {s.level}
                    </td>
                    <td className="px-4 py-3 font-bold text-joy-500">
                      {s.point}
                    </td>
                    <td className="py-3 pl-4 text-deepspace-300">
                      {s.meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Phần A — Thông tin cơ bản */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="rounded-2xl border border-deepspace-50 bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">
              Phần A
            </p>
            <h3 className="mt-1 text-xl font-bold text-deepspace sm:text-2xl">
              Thông tin cơ bản{" "}
              <span className="text-sm font-normal text-deepspace-300">
                (không tính điểm)
              </span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-deepspace-300 sm:text-base">
              Phần này giúp JOYWORK hiểu cấu trúc nhân sự công ty bạn để phân
              tích kết quả. Câu trả lời vẫn ẩn danh.
            </p>
            <ul className="mt-5 space-y-4">
              {partA.map((q) => (
                <li
                  key={q.code}
                  className="rounded-xl border border-deepspace-50 bg-gray-50/70 p-4 sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 rounded-full bg-deepspace px-2.5 py-1 text-xs font-bold text-white">
                      {q.code}
                    </span>
                    <p className="text-sm font-semibold text-deepspace sm:text-base">
                      {q.question}
                    </p>
                  </div>
                  <p className="mt-2 pl-12 text-sm text-deepspace-300">
                    {q.options}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Phần B — 25 câu chấm điểm */}
        <div className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-deepspace-50 bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">
              Phần B
            </p>
            <h3 className="mt-1 text-xl font-bold text-deepspace sm:text-2xl">
              25 câu chấm điểm
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-deepspace-300 sm:text-base">
              Trả lời theo thang 1-5: 1 = Rất không đồng ý · 2 = Không đồng ý ·
              3 = Bình thường · 4 = Đồng ý · 5 = Rất đồng ý
            </p>

            <div className="mt-8 space-y-10">
              {partB.map((g) => {
                const Icon = g.icon;
                return (
                  <div key={g.number}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-joy-500 to-pink-500 text-white">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-pink-500">
                          Nhóm {g.number} · 20 điểm
                        </p>
                        <h4 className="text-lg font-bold text-deepspace sm:text-xl">
                          {g.title}
                        </h4>
                      </div>
                    </div>
                    <p className="mt-3 text-sm italic leading-relaxed text-deepspace-300 sm:text-base">
                      {g.subtitle}
                    </p>
                    <ol className="mt-4 space-y-3">
                      {g.questions.map((q) => (
                        <li
                          key={q.code}
                          className="rounded-xl border border-deepspace-50 bg-gray-50/70 p-4 sm:p-5"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 rounded-full bg-joy-500 px-2.5 py-1 text-xs font-bold text-white">
                              {q.code}
                            </span>
                            <p className="text-sm font-semibold text-deepspace sm:text-base">
                              {q.question}
                            </p>
                          </div>
                          <p className="mt-2 pl-14 text-xs italic text-deepspace-300 sm:text-sm">
                            {q.note}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Phần C — Câu hỏi mở */}
        <div className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-deepspace-50 bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">
              Phần C
            </p>
            <h3 className="mt-1 text-xl font-bold text-deepspace sm:text-2xl">
              Câu hỏi mở{" "}
              <span className="text-sm font-normal text-deepspace-300">
                (tùy chọn, không tính điểm)
              </span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-deepspace-300 sm:text-base">
              Phần này giúp JOYWORK hiểu sâu hơn về môi trường công ty bạn.
              Bạn có thể bỏ qua nếu không muốn trả lời.
            </p>
            <ul className="mt-5 space-y-4">
              {partC.map((q) => (
                <li
                  key={q.code}
                  className="rounded-xl border border-deepspace-50 bg-gray-50/70 p-4 sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 rounded-full bg-deepspace px-2.5 py-1 text-xs font-bold text-white">
                      {q.code}
                    </span>
                    <p className="text-sm font-semibold text-deepspace sm:text-base">
                      {q.question}
                    </p>
                  </div>
                  {q.hint && (
                    <p className="mt-2 pl-12 text-xs italic text-deepspace-300 sm:text-sm">
                      Gợi ý trả lời: {q.hint}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mx-auto mt-12 max-w-3xl text-center">
          <p className="text-sm leading-relaxed text-deepspace-300 sm:text-base">
            Cảm ơn bạn đã dành thời gian. Câu trả lời thật của bạn giúp xây
            dựng môi trường làm việc tốt hơn cho cộng đồng.
          </p>
        </div>
      </div>
    </section>
  );
}
