import Hero from "./components/Hero";
import Tabs from "./components/Tabs";
import Benefits from "./components/Benefits";
import TargetCompany from "./components/TargetCompany";
import EvaluationMethod from "./components/EvaluationMethod";
import FiveCriteriaChart from "./components/FiveCriteriaChart";
import FAQ from "./components/FAQ";
import RegistrationForm from "./components/RegistrationForm";
import SurveyQuestions from "./components/SurveyQuestions";
import Footer from "./components/Footer";

// Trang landing chính. Dưới Hero, nội dung chia 2 tab:
//  1. Thông tin chương trình            → Benefits + TargetCompany + FiveCriteriaChart + EvaluationMethod + FAQ + RegistrationForm
//  2. Câu hỏi khảo sát mẫu              → SurveyQuestions (preview bộ câu hỏi 25 câu)
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
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
