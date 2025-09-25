import React from "react"
import clsx from "clsx"

interface ReusableButton2Props {
  children?: React.ReactNode
  className?: string
  bgClassName?: string
  textClassName?: string
}

const ReusableButton2 = ({
  children = "Add to cart",
  className,
  bgClassName,
  textClassName,
}: ReusableButton2Props) => {
  return (
    <button
      className={clsx(
        "group relative overflow-hidden uppercase py-4 px-[42px] hover:cursor-pointer border border-[#7D7D7D] hover:border-transparent text-sm leading-[20px] font-medium rounded-full transition-colors duration-300",
        className
      )}
    >
      <span
        className={clsx(
          "absolute inset-0 bg-[#00B5A5] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full -z-10",
          bgClassName
        )}
      />
      <span className={clsx("relative z-10 transition-colors duration-300", textClassName ?? "text-[#7D7D7D] group-hover:text-white")}>
        {children}
      </span>
    </button>
  )
}

export default ReusableButton2
