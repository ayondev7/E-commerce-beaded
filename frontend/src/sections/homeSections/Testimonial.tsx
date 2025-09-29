"use client";
import ReusableButton from "@/components/generalComponents/ReusableButton";
import TestimonialCard from "@/components/home/TestimonialCard";
import React, { useState, useRef } from "react";
import testimonials from "@/config/testimonialData";

const Testimonial = () => {
  const [visibleCount, setVisibleCount] = useState(1);
  const animatingRef = useRef(false);

  const zIndexes = [10, 20, 30, 40,50,60];

  const handleRight = async () => {
    if (animatingRef.current) return;
    if (visibleCount >= testimonials.length) return;
    animatingRef.current = true;
    setVisibleCount((v) => v + 1);

    await new Promise((res) => setTimeout(res, 760));
    animatingRef.current = false;
  };

  const handleLeft = async () => {
    if (animatingRef.current) return;
    if (visibleCount <= 1) return;
    animatingRef.current = true;
    setVisibleCount((v) => v - 1);
    await new Promise((res) => setTimeout(res, 960));
    animatingRef.current = false;
  };

  return (
    <div className="relative h-[665px] overflow-hidden">
      
      {testimonials.map((c, idx) => {
        const inView = idx < visibleCount; // if index less than visibleCount, it's in view (0-based)
        return (
          <TestimonialCard
            key={idx}
            title={c.title}
            text={c.text}
            image={c.image}
            zIndex={zIndexes[idx]}
            inView={inView}
            bgColor={c.bgColor}
          />
        )
      })}

      <div className="absolute bottom-[120px] flex gap-x-10 left-[150px] z-70">
        <ReusableButton
          direction="left"
          onClick={handleLeft}
          aria-label="previous"
          disabled={visibleCount <= 1}
        />
        <ReusableButton
          direction="right"
          onClick={handleRight}
          aria-label="next"
          disabled={visibleCount >= testimonials.length}
        />
      </div>
    </div>
  );
};

export default Testimonial;
