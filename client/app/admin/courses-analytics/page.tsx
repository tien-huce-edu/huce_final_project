import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminSidebar from "@/app/components/Admin/Sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import CourseAnalytics from "../../components/Admin/Analytics/CourseAnalytics";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Elearning - Admin"
        description="Admin page for Elearning platform"
        keywords="Elearning, Admin, Courses, Analytics"
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHero />
          <CourseAnalytics />
        </div>
      </div>
    </div>
  );
};

export default page;
