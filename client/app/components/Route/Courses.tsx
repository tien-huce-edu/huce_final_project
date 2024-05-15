import { useGetUsersAllCourseQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";

type Props = {};

const Courses = (props: Props) => {
  const { data, isLoading } = useGetUsersAllCourseQuery({});
  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => {
    // setCourses(data?.courses);
    if (data) {
      setCourses(data.courses);
    }
  }, [data]);
  return (
    <div>
      <div className={`w-[90%] 800px:w-[80%] m-auto`}>
        <h1 className="text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] font-[700] tracking-tight">
          Expand Your Career
          <span className="bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">
            {" "}
            Opportunity
          </span>
          <br />
          Opportunity With Our Courses
        </h1>
        <br />
        <br />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
          {courses &&
            courses.map((item: any, index: number) => (
              <CourseCard item={item} key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
