"use client";
import ReusableButton from "@/components/generalComponents/ReusableButton";
import TestimonialCard from "@/components/home/TestimonialCard";
import React, { useState, useRef } from "react";

const Testimonial = () => {
  const cards = [
    {
      title: "Ava Nicholls",
      text: "Lorem ipsum dolor sit amet consectetur. Purus elementum consequat malesuada amet turpis mollis etiam non.",
      image: "/home/testimonials/1.png",
      bgColor: "#509B70",
    },
    {
      title: "John Doe",
      text: "Second testimonial short text. This will be stacked under the first.",
      image: "/home/testimonials/1.png",
      bgColor: "#406E58",
    },
    {
      title: "Sophie Lee",
      text: "Third testimonial example text.",
      image: "/home/testimonials/1.png",
      bgColor: "#2F5A44",
    },
    {
      title: "Mark Twain",
      text: "Fourth testimonial entry.",
      image: "/home/testimonials/1.png",
      bgColor: "#1F442F",
    },
  ];

  // visibleCount controls how many cards are brought into view from the left (stacked)
  // Start with only the first card visible; others are translated out to the right
  const [visibleCount, setVisibleCount] = useState(1);
  const animatingRef = useRef(false);

  // z-indexes: 10,20,30,40
  const zIndexes = [10, 20, 30, 40];

  const handleRight = async () => {
    if (animatingRef.current) return;
    if (visibleCount >= cards.length) return; // nothing to bring in
    animatingRef.current = true;
    setVisibleCount((v) => v + 1);
    // wait for the transition duration (match child's duration 700ms plus small buffer)
    await new Promise((res) => setTimeout(res, 760));
    animatingRef.current = false;
  };

  const handleLeft = async () => {
    if (animatingRef.current) return;
    if (visibleCount <= 1) return; // nothing to move out
    animatingRef.current = true;
    setVisibleCount((v) => v - 1);
    // wait for the hide transition (child uses 900ms for exit) plus buffer
    await new Promise((res) => setTimeout(res, 960));
    animatingRef.current = false;
  };

  return (
    <div className="relative h-[665px] overflow-hidden">
      {/* Render cards stacked; first is visible by default, others offscreen to the right */}
      {cards.map((c, idx) => {
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
        );
      })}

      <div className="absolute bottom-[120px] flex gap-x-10 left-[150px] z-50">
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
          disabled={visibleCount >= cards.length}
        />
      </div>
    </div>
  );
};

export default Testimonial;
