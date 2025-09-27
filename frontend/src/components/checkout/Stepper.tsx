"use client";
import React, {
  useState,
  Children,
  useRef,
  useLayoutEffect,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";

export type StepperProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  contentClassName?: string;
  disableStepIndicators?: boolean;
  labels?: string[]; // e.g. ["Delivery Info", "Review Order", "Confirmation"]
};

type Ctx = {
  currentStep: number;
  totalSteps: number;
  next: () => void;
  back: () => void;
  goTo: (n: number) => void;
};

export const StepperContext = React.createContext<Ctx | null>(null);

export function useStepper() {
  const ctx = React.useContext(StepperContext);
  if (!ctx) throw new Error("useStepper must be used within <Stepper>");
  return ctx;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  contentClassName = "",
  disableStepIndicators = false,
  labels = [],
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  const goTo = (next: number) => {
    setDirection(next > currentStep ? 1 : -1);
    updateStep(Math.min(Math.max(1, next), totalSteps));
  };
  const next = () => goTo(Math.min(totalSteps, currentStep + 1));
  const back = () => goTo(Math.max(1, currentStep - 1));

  return (
    <StepperContext.Provider value={{ currentStep, totalSteps, next, back, goTo }}>
      <div className="w-full" {...rest}>
      {/* Top stepper bar */}
      <div className="mx-auto max-w-5xl">
        <div className="relative">
          {/* Background line */}
          <div className="absolute w-[900px] top-6 left-1/2 -translate-x-1/2 right-0 h-0.5 bg-[#d9d9d9]" />
          
          {/* Progress line */}
          <motion.div
            className="absolute w-[900px] left-1/2 -translate-x-1/2 top-6 h-0.5 bg-[#67c18d]"
            initial={false}
            animate={{ 
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
            }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Step indicators */}
          <div className="relative flex items-center justify-between">
            {stepsArray.map((_, idx) => {
              const step = idx + 1;
              const status =
                currentStep === step ? "active" : currentStep > step ? "complete" : "inactive";
              return (
                <StepIndicator
                  key={step}
                  step={step}
                  label={labels[idx] ?? `Step ${step}`}
                  status={status}
                  onClick={() => !disableStepIndicators && goTo(step)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Animated content area */}
      <StepContentWrapper
        isCompleted={isCompleted}
        currentStep={currentStep}
        direction={direction}
        className={contentClassName}
      >
        {stepsArray[currentStep - 1]}
      </StepContentWrapper>
      </div>
    </StepperContext.Provider>
  );
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = "",
}: {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: {
  children: ReactNode;
  direction: number;
  onHeightReady: (h: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (ref.current) onHeightReady(ref.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? "-100%" : "100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? "50%" : "-50%", opacity: 0 }),
};

export function Step({ children }: { children: ReactNode }) {
  return <div className=" py-20">{children}</div>;
}

function StepIndicator({
  step,
  label,
  status,
  onClick,
}: {
  step: number;
  label: string;
  status: "inactive" | "active" | "complete";
  onClick: () => void;
}) {
  const colors = {
    // inactive: background #d9d9d9, text #1e1e1e
    inactive: { bg: "bg-[#d9d9d9]", ring: "ring-0", text: "text-[#1e1e1e]" },
    // active & complete: background #67c18d, white text
    active: { bg: "bg-[#67c18d]", ring: "ring-0", text: "text-white" },
    complete: { bg: "bg-[#67c18d]", ring: "ring-0", text: "text-white" },
  }[status];

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex flex-col items-center gap-3 focus:outline-none z-10"
      aria-current={status === "active"}
    >
      <motion.div
        className={`grid size-12 place-items-center rounded-full ${colors.bg} ${colors.ring}`}
        initial={false}
        transition={{ duration: 0.2 }}
      >
        {status === "complete" ? (
          <CheckIcon className="size-6 text-white" />
        ) : status === "active" ? (
          // use the colors.text (white) for active number and fix typo in class
          <span className={`text-lg font-semibold ${colors.text}`}>{step}</span>
        ) : (
          <span className={`text-lg font-semibold ${colors.text}`}>{step}</span>
        )}
      </motion.div>
      <span
        className={`text-lg font-medium ${colors.text} whitespace-nowrap`}
      >
        {label}
      </span>
    </button>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
