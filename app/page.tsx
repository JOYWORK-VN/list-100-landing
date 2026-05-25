import Hero from "./components/Hero";
import Tabs from "./components/Tabs";
import Benefits from "./components/Benefits";
import TargetCompany from "./components/TargetCompany";
import EvaluationMethod from "./components/EvaluationMethod";
import FiveCriteriaChart from "./components/FiveCriteriaChart";
import FAQ from "./components/FAQ";
import RegistrationForm from "./components/RegistrationForm";
import SurveyQuestions from "./components/SurveyQuestions";
import HonoredCompanies from "./components/HonoredCompanies";
import OverviewReport from "./components/OverviewReport";
import Footer from "./components/Footer";

// Trang landing chính. Dưới Hero, nội dung chia 4 tab:
//  1. Thông tin chương trình            → Benefits + TargetCompany + FiveCriteriaChart + EvaluationMethod + FAQ + RegistrationForm
//  2. Câu hỏi khảo sát mẫu              → SurveyQuestions (preview bộ câu hỏi 25 câu)
//  3. 100 doanh nghiệp được vinh danh   → HonoredCompanies
//  4. Báo cáo tổng quan                 → OverviewReport (iframe nhúng Workplace Insight)
//
// Form đăng ký nằm ở cuối tab "Thông tin chương trình" (id "dang-ky" trong
// RegistrationForm) — các nút #dang-ky trên trang sẽ chuyển tab và scroll
// xuống form qua cross-tab anchor.
export default function LandingPage() {
  return (
    <>
      <main>
        <Hero />
        <Tabs
          tabs={[
            {
              id: "thong-tin",
              label: "Thông tin chương trình",
              sections: ["tieu-chi", "lo-trinh-khao-sat", "dang-ky"],
              content: (
                <>
                  <Benefits />
                  <TargetCompany />
                  <EvaluationMethod />
                  <FiveCriteriaChart />
                  <FAQ />
                  <RegistrationForm />
                </>
              ),
            },
            {
              id: "cau-hoi-mau",
              label: "Câu hỏi khảo sát mẫu",
              content: <SurveyQuestions />,
            },
            {
              id: "vinh-danh",
              label: "Danh sách doanh nghiệp có môi trường làm việc tốt",
              content: <HonoredCompanies />,
            },
            {
              id: "bao-cao",
              label: "Báo cáo tổng quan",
              content: <OverviewReport />,
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
