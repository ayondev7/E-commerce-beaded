import React from "react"
import clsx from "clsx"

interface ReusableButton2Props {
  children?: React.ReactNode
  className?: string
  bgClassName?: string
  textClassName?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  form?: string
}

const ReusableButton2 = ({
  children = "Add to cart",
  className,
  bgClassName,
  textClassName,
  onClick,
  type = "button",
  disabled,
  form,
}: ReusableButton2Props) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      form={form}
      className={clsx(
        "group relative z-0 overflow-hidden uppercase py-4 px-[42px] hover:cursor-pointer text-sm leading-[20px] font-medium rounded-full transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
    >
      <span
        className={clsx(
          "absolute inset-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-full z-10",
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
