import React from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

// Extend native button props so callers can pass onClick, aria-label, etc.
export interface ReusableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'left' | 'right';
  buttonClassName?: string;
  iconClassName?: string;
}

const ReusableButton = React.forwardRef<HTMLButtonElement, ReusableButtonProps>(
  ({ direction, buttonClassName, iconClassName, disabled = false, className, ...rest }, ref) => {
    const Icon = direction === 'left' ? LuChevronLeft : LuChevronRight;

    // Merge className props: prefer explicit buttonClassName then fallback to className prop
    const mergedClass = `w-[64px] h-[64px] hover:cursor-pointer flex items-center justify-center border-2 rounded-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${buttonClassName || 'border-white'} ${className || ''}`.trim();

    return (
      <button ref={ref} disabled={disabled} className={mergedClass} {...rest}>
        <Icon className={`size-[30px] ${iconClassName || 'text-white'}`} />
      </button>
    );
  }
);

ReusableButton.displayName = 'ReusableButton';

export default ReusableButton;