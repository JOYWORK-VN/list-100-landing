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
import Footer from "./components/Footer";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Trang landing chính. Dưới Hero, nội dung chia 3 tab:
//  1. Thông tin chương trình            → Benefits + TargetCompany + FiveCriteriaChart + EvaluationMethod + FAQ + RegistrationForm
//  2. Câu hỏi khảo sát mẫu              → SurveyQuestions (preview bộ câu hỏi 25 câu)
//  3. 100 doanh nghiệp được vinh danh   → HonoredCompanies
//
// Form đăng ký nằm ở cuối tab "Thông tin chương trình" (id "dang-ky" trong
// RegistrationForm) — các nút #dang-ky trên trang sẽ chuyển tab và scroll
// xuống form qua cross-tab anchor.
export default function LandingPage() {
  return (
    <>
      <main>
        <Hero />
        <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-joy-500" /></div>}>
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
            ]}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
