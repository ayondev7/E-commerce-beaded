import React from "react"
import clsx from "clsx"

interface ReusableButton2Props {
  children?: React.ReactNode
  className?: string
  bgClassName?: string
  textClassName?: string
  onClick?: () => void
}

const ReusableButton2 = ({
  children = "Add to cart",
  className,
  bgClassName,
  textClassName,
  onClick,
}: ReusableButton2Props) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "group relative z-0 overflow-hidden uppercase py-4 px-[42px] hover:cursor-pointer text-sm leading-[20px] font-medium rounded-full transition-colors duration-300",
        className
      )}
    >
      <span
        className={clsx(
          "absolute inset-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full -z-1",
          bgClassName
        )}
      />
      <span className={clsx("relative z-10 transition-colors duration-300", textClassName)}>
        {children}
      </span>
    </button>
  )
}

export default ReusableButton2
