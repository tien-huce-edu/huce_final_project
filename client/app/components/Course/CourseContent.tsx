import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";
import { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import Header from "../Header";
import CourseContentList from "./CourseContentList";
type Props = {
  id: string;
  user: any;
};

const CourseContent = ({ id, user }: Props) => {
  const { data: contentData, isLoading } = useGetCourseContentQuery(id);
  const data = contentData?.content;
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [activeVideo, setActiveVideo] = useState(0);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            activeItem={1}
            open={open}
            setOpen={setOpen}
            route={route}
            setRoute={setRoute}
          />
          <Heading
            title={data[activeVideo]?.title}
            description="Elearning is a programing community which is developed"
            keywords={data[activeVideo]?.tags}
          />
          <div className="w-full grid 800px:grid-cols-10">
            <div className="col-span-7">
              <CourseContentMedia
                data={data}
                // setData={setData}
                id={id}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
                user={user}
              />
            </div>
            <div className="hidden 800px:block 800px:col-span-3">
              <CourseContentList
                setActiveVideo={setActiveVideo}
                data={data}
                activeVideo={activeVideo}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CourseContent;
