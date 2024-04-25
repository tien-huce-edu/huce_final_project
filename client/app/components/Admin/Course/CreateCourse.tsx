"use client";
import { useCreateCourseMutation } from "@/redux/features/courses/coursesApi";
import { redirect } from "next/navigation";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CourseContent from "./CourseContent";
import CourseData from "./CourseData";
import CourseInfomation from "./CourseInfomation";
import CourseOptions from "./CourseOptions";
import CourseReview from "./CourseReview";

type Props = {};

const CreateCourse: FC<Props> = () => {
  const [createCourse, { isLoading, isSuccess, error }] =
    useCreateCourseMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully");
      redirect("/admin/courses");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({
    name: "Khoá học lập trình expressJs",
    description:
      "Khóa học về Express.js là một hành trình thú vị vào thế giới của lập trình web phía server. Trong khoá học này, bạn sẽ được dẫn dắt từ các khái niệm cơ bản đến những kỹ thuật nâng cao, giúp bạn xây dựng các ứng dụng web mạnh mẽ và linh hoạt.",
    price: 200000,
    estimatedPrice: 180000,
    tags: "NodeJS, Javascript, ExpressJS, Web Development",
    level: "Normal",
    demoUrl: "d143e69dd8e6d6100fb411b2d115c040",
    thumbnail: "",
  });
  const [benefits, setBenefits] = useState([
    {
      title:
        "Express.js là một framework web mạnh mẽ và linh hoạt, cho phép bạn xây dựng các ứng dụng web phức tạp hoặc đơn giản tùy thuộc vào nhu cầu của dự án.",
    },
    {
      title:
        "Express.js được thiết kế để làm việc hiệu quả và tối ưu trong việc xử lý các yêu cầu HTTP và xây dựng các ứng dụng web nhanh chóng.",
    },
    {
      title:
        "Express.js có một hệ thống middleware mạnh mẽ, cho phép bạn mở rộng và tùy chỉnh ứng dụng của mình theo cách linh hoạt, từ xử lý yêu cầu đến xác thực và quản lý phiên.",
    },
  ]);
  const [prerequisites, setPrerequisites] = useState([
    {
      title:
        "Hiểu biết cơ bản về các ngôn ngữ lập trình web sẽ giúp bạn dễ dàng học Express.js hơn. Điều này bao gồm hiểu biết về cách HTML và CSS được sử dụng để tạo ra giao diện người dùng và cách JavaScript được sử dụng để tạo ra các tương tác động trên trang web.",
    },
    {
      title:
        "Express.js là một framework dựa trên Node.js, vì vậy hiểu biết cơ bản về Node.js sẽ là một lợi thế. Điều này bao gồm hiểu biết về cách Node.js hoạt động, cách cài đặt các module và sử dụng npm để quản lý các gói phụ thuộc.",
    },
  ]);
  const [courseContentData, setCourseContentData] = useState([
    {
      videoSection: "Untitled Section",
      title: "123",
      videoUrl: "d143e69dd8e6d6100fb411b2d115c040",
      description: "123",
      links: [
        {
          title: "123",
          url: "123",
        },
      ],
      suggestions: "123",
    },
  ]);
  const [courseData, setCousreData] = useState({});

  const handleSubmit = async () => {
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));

    const formattedCourseContentData = courseContentData.map((content) => ({
      videoUrl: content.videoUrl,
      title: content.title,
      description: content.description,
      videoSection: content.videoSection,
      links: content.links.map((link) => ({
        title: link.title,
        url: link.url,
      })),
      suggestions: content.suggestions,
    }));

    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatePrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContentData,
    };

    setCousreData(data);
  };
  const handleCourseCreate = async (e: any) => {
    const data = courseData;

    if (!isLoading) {
      await createCourse(data);
    }
  };

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInfomation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}{" "}
        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CourseReview
            active={active}
            setActive={setActive}
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default CreateCourse;
