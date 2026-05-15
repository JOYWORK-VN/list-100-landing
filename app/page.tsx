import Hero from "./list-100-doanh-nghiep-2026/components/Hero";
import Tabs from "./list-100-doanh-nghiep-2026/components/Tabs";
import Benefits from "./list-100-doanh-nghiep-2026/components/Benefits";
import TargetCompany from "./list-100-doanh-nghiep-2026/components/TargetCompany";
import EvaluationMethod from "./list-100-doanh-nghiep-2026/components/EvaluationMethod";
import FiveCriteriaChart from "./list-100-doanh-nghiep-2026/components/FiveCriteriaChart";
import FAQ from "./list-100-doanh-nghiep-2026/components/FAQ";
import RegistrationForm from "./list-100-doanh-nghiep-2026/components/RegistrationForm";
import SurveyQuestions from "./list-100-doanh-nghiep-2026/components/SurveyQuestions";
import Footer from "./list-100-doanh-nghiep-2026/components/Footer";

export default function HomePage() {
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
