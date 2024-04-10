import { styles } from "@/app/styles/style";
import { FC } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlusCircle } from "react-icons/ai";

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const handleBenefitChange = (index: any, value: string) => {
    const updatedBenefit = [...benefits];
    updatedBenefit[index].title = value;
    setBenefits(updatedBenefit);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handlePrerequisiteChange = (index: any, value: string) => {
    const updatedPrerequisite = [...prerequisites];
    updatedPrerequisite[index].title = value;
    setPrerequisites(updatedPrerequisite);
  };

  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOption = () => {
    console.log(benefits[benefits.length - 1]?.title);
    if (
      benefits[benefits.length - 1]?.title !== "" &&
      prerequisites[prerequisites.length - 1]?.title !== ""
    ) {
      setActive(active + 1);
    } else {
      toast.error("Please fill the fields to go to next!");
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 block">
      <div>
        <label htmlFor="email" className={`${styles.label} text-[20px]`}>
          Lợi ích của học viên khi tham gia khoá học:
        </label>
        <br />
        {benefits.map((benefit: any, index: number) => (
          <input
            type="text"
            key={index}
            name="Benefit"
            placeholder="You will be able to..."
            className={`${styles.input} my-2`}
            value={benefit.title}
            onChange={(e) => handleBenefitChange(index, e.target.value)}
          />
        ))}
        <AiOutlinePlusCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddBenefit}
        />
      </div>
      <div>
        <label htmlFor="email" className={`${styles.label} text-[20px]`}>
          Điều kiện khi tham gia khoá học:
        </label>
        <br />
        {prerequisites.map((prerequisite: any, index: number) => (
          <input
            type="text"
            key={index}
            name="Benefit"
            placeholder="You need knowledge be able to..."
            className={`${styles.input} my-2`}
            value={prerequisite.title}
            onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
          />
        ))}
        <AiOutlinePlusCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddPrerequisite}
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 m-[20px] cursor-pointer"
          onClick={() => prevButton()}
        >
          Prev
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 m-[20px] cursor-pointer"
          onClick={() => handleOption()}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default CourseData;
