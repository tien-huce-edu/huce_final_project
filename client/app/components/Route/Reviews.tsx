import { styles } from "@/app/styles/style";
import Image from "next/image";
import React from "react";
import ReviewCard from "../Review/ReviewCard";

type Props = {};
const reviews = [
  {
    name: "Verna Santos",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profession: "Full stack developer | Quarter ltd.",
    comment:
      "Mình vừa hoàn thành khóa học [Tên khóa học] do giảng viên [Tên giảng viên] giảng dạy và muốn chia sẻ trải nghiệm học tập tuyệt vời của mình với mọi người. Khóa học cung cấp cho mình kiến thức toàn diện về [Lĩnh vực], giúp mình [Mô tả lợi ích]. Giảng viên [Tên giảng viên] có chuyên môn cao và dày dặn kinh nghiệm trong lĩnh vực [Lĩnh vực]. Thầy/cô truyền đạt kiến thức một cách [Cách thức truyền đạt], giúp học viên dễ hiểu và tiếp thu nhanh chóng. Giảng viên [Tên giảng viên] có chuyên môn cao và dày dặn kinh nghiệm trong lĩnh vực [Lĩnh vực].",
  },
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Software engineer | Acme Corp.",
    comment:
      "Giảng viên [Tên giảng viên] có chuyên môn cao và dày dặn kinh nghiệm trong lĩnh vực [Lĩnh vực]. Thầy/cô truyền đạt kiến thức một cách [Cách thức truyền đạt], giúp học viên dễ hiểu và tiếp thu nhanh chóng. Giảng viên [Tên giảng viên] có chuyên môn cao và dày dặn kinh nghiệm trong lĩnh vực [Lĩnh vực]. Thầy/cô truyền đạt kiến thức một cách [Cách thức truyền đạt], giúp học viên dễ hiểu và tiếp thu nhanh chóng. Giảng viên [Tên giảng viên] có chuyên môn cao và dày dặn kinh nghiệm trong lĩnh vực [Lĩnh vực]. Thầy/cô truyền đạt kiến thức một cách [Cách thức truyền đạt], giúp học viên dễ hiểu và tiếp thu nhanh chóng. Giảng viên [Tên giảng viên] có chuyên môn cao và dày dặn kinh nghiệm trong lĩnh vực [Lĩnh vực]. Thầy/cô truyền đạt kiến thức một cách [Cách thức truyền đạt], giúp học viên dễ hiểu và tiếp thu nhanh chóng.",
  },
  {
    name: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    profession: "UX/UI designer | Freelancer",
    comment:
      "Ngoài ra, khóa học còn có nhiều bài tập thực hành [Mô tả bài tập thực hành], giúp mình vận dụng kiến thức đã học vào thực tế một cách hiệu quả. Nhờ tham gia khóa học này, mình đã [Mô tả kết quả đạt được]. Mình highly recommend khóa học này cho [Đối tượng phù hợp] muốn nâng cao kỹ năng [Kỹ năng] và kiến thức về [Lĩnh vực]. Ngoài ra, khóa học còn có nhiều bài tập thực hành [Mô tả bài tập thực hành], giúp mình vận dụng kiến thức đã học vào thực tế một cách hiệu quả. Nhờ tham gia khóa học này, mình đã [Mô tả kết quả đạt được]. Mình highly recommend khóa học này cho [Đối tượng phù hợp] muốn nâng cao kỹ năng [Kỹ năng] và kiến thức về [Lĩnh vực]. Thầy/cô truyền đạt kiến thức một cách [Cách thức truyền đạt], giúp học viên dễ hiểu và tiếp thu nhanh chóng. ",
  },
  {
    name: "Verna Santos",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profession: "Full stack developer | Quarter ltd.",
    comment:
      "Khóa học [Tên khóa học] mang lại nhiều lợi ích cho học viên, tuy nhiên cũng có một số hạn chế cần khắc phục. Mình đánh giá đây là một khóa học [Đánh giá chung về khóa học] và phù hợp với [Đối tượng phù hợp]. Ngoài ra, khóa học còn có nhiều bài tập thực hành [Mô tả bài tập thực hành], giúp mình vận dụng kiến thức đã học vào thực tế một cách hiệu quả. Nhờ tham gia khóa học này, mình đã [Mô tả kết quả đạt được]. Mình highly recommend khóa học này cho [Đối tượng phù hợp] muốn nâng cao kỹ năng [Kỹ năng] và kiến thức về [Lĩnh vực].",
  },
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Software engineer | Acme Corp.",
    comment:
      "Tham gia khóa học [Tên khóa học] là một trong những quyết định sáng suốt nhất của mình trong thời gian qua. Khóa học đã giúp mình [Mô tả thay đổi tích cực] và [Mô tả trải nghiệm cá nhân]. Ngoài ra, khóa học còn có nhiều bài tập thực hành [Mô tả bài tập thực hành], giúp mình vận dụng kiến thức đã học vào thực tế một cách hiệu quả. Nhờ tham gia khóa học này, mình đã [Mô tả kết quả đạt được]. Mình highly recommend khóa học này cho [Đối tượng phù hợp] muốn nâng cao kỹ năng [Kỹ năng] và kiến thức về [Lĩnh vực].",
  },
  {
    name: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    profession: "UX/UI designer | Freelancer",
    comment:
      "DKhóa học này không chỉ mang lại cho mình kiến thức mà còn thay đổi cách nhìn nhận và giải quyết vấn đề của mình. Mình biết ơn [Tên giảng viên] và đội ngũ trợ giảng đã luôn nhiệt tình hỗ trợ và truyền cảm hứng cho mình trong suốt quá trình học tập. Ngoài ra, khóa học còn có nhiều bài tập thực hành [Mô tả bài tập thực hành], giúp mình vận dụng kiến thức đã học vào thực tế một cách hiệu quả. Nhờ tham gia khóa học này, mình đã [Mô tả kết quả đạt được]. Mình highly recommend khóa học này cho [Đối tượng phù hợp] muốn nâng cao kỹ năng [Kỹ năng] và kiến thức về [Lĩnh vực].",
  },
];
const Reviews = (props: Props) => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex item-center my-64">
        <div className="800px:w-[50%] w-full">
          <Image
            src={require("../../../public/assets/image/banner/business-img.png")}
            alt=""
            width={700}
            height={700}
          />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.tittle} 800px:!text-[40px]`}>
            Our Students Are{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">
              Our strength
            </span>
            <br />
            See What Thay Say About Us
          </h3>
          <br />
          <p className={styles.label}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum modi,
            totam atque obcaecati odit, laudantium ducimus tempora dolore sequi
            voluptas quam deleniti eos nulla harum voluptate voluptatem magni
            pariatur autem.
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0  md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-20px]">
        {reviews &&
          reviews.map((i, index) => <ReviewCard item={i} key={index} />)}
      </div>
    </div>
  );
};

export default Reviews;
