import React from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface ReusableButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  buttonClassName?: string;
  iconClassName?: string;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({ direction, onClick, buttonClassName, iconClassName }) => {
  const Icon = direction === 'left' ? LuChevronLeft : LuChevronRight;

  return (
    <button
      onClick={onClick}
      className={`w-[64px] h-[64px] flex items-center justify-center border-2 border-white rounded-full ${buttonClassName || ''}`}
    >
      <Icon className={`text-white size-[30px] ${iconClassName || ''}`} />
    </button>
  );
};

export default ReusableButton;