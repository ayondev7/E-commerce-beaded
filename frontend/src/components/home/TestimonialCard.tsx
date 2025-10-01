
import Image from "next/image";
import React from "react";

interface TestimonialCardProps {
  title: string;
  text: string;
  image: string;
  zIndex: number;
  inView: boolean; // whether the card is translated to 0 or offscreen
  bgColor?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  title,
  text,
  image,
  zIndex,
  inView,
  bgColor = "#509B70",
}) => {
  const translateClass = inView ? "translate-x-0" : "translate-x-[120%]";

  const duration = inView ? 700 : 900;

  return (
    <div
      style={{ zIndex, backgroundColor: bgColor, transitionDuration: `${duration}ms` }}
      className={`absolute inset-0 grid grid-cols-[60%_38%] gap-x-[2%] py-10 px-[150px] transform ease-out ${translateClass}`}
    >
      <div className="pt-10">
        <Image
          src="/quote.png"
          alt="testimonial"
          width={100}
          height={100}
          className="size-[60px] object-cover"
        />
        <p className="text-2xl font-medium leading-[37px] text-white max-w-[90%] mb-6 mt-2.5">
          {text}
        </p>
        <h1 className="text-xl text-white flex items-center gap-x-[14px]">
          <span className="w-[26px] h-[1px] bg-white inline-block"></span> {title}
        </h1>
      </div>
      <Image
        src={image}
        alt="testimonial"
        width={1920}
        height={1080}
        loading={inView ? "eager" : "lazy"}
        priority={inView}
        className="w-full h-[588px] object-cover"
      />
    </div>
  );
};

export default TestimonialCard;
