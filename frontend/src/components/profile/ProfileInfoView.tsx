import React from "react";
import { FiEdit } from "react-icons/fi";

export interface ProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  gender: "male" | "female" | "";
  dateOfBirth?: string;
}

interface ProfileInfoViewProps {
  data: ProfileData;
  onEdit: () => void;
}

const InfoRow: React.FC<{ label: string; value?: string }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col gap-y-1">
    <span className="text-[#6D6D6D] text-lg leading-[24px] font-semibold">{label}</span>
    <span className="text-xl leading-[30px]">{value || "-"}</span>
  </div>
);

const ProfileInfoView: React.FC<ProfileInfoViewProps> = ({ data, onEdit }) => {
  return (
    <div className="bg-[#fafafa] pt-5 pb-10">
      <div className="px-8 border-b border-[#ebebeb] pb-5 flex w-full justify-between items-center">
        <h3 className="text-[30px] leading-[38px] tracking-[-2%]">Profile Info</h3>
        <button className="flex gap-x-2 items-center hover:cursor-pointer" onClick={onEdit}>
          <span className="text-lg leading-[24px] tracking-[8%] uppercase">Edit</span>
          <FiEdit className="size-[18px]" />
        </button>
      </div>
      <div className="pt-5 px-8">
        <div className="grid grid-cols-2 gap-x-[21px] gap-y-10">
          <InfoRow label="Name" value={data.name} />
          <InfoRow label="Email" value={data.email} />
          <InfoRow label="Phone no." value={data.phoneNumber} />
          <InfoRow label="Gender" value={data.gender} />
          <InfoRow label="Date of Birth" value={data.dateOfBirth} />
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoView;
