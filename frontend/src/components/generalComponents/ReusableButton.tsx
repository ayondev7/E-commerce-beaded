import React from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface ReusableButtonProps {
  direction: 'left' | 'right';
  onClick?: () => void;
  buttonClassName?: string;
  iconClassName?: string;
  disabled?: boolean;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({ direction, onClick, buttonClassName, iconClassName, disabled = false }) => {
  const Icon = direction === 'left' ? LuChevronLeft : LuChevronRight;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-[64px] h-[64px] flex items-center justify-center border-2 rounded-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${buttonClassName || 'border-white'}`}
    >
      <Icon className={`size-[30px] ${iconClassName || 'text-white'}`} />
    </button>
  );
};

export default ReusableButton;