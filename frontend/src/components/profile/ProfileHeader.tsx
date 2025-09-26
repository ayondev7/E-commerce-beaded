import Image from "next/image"
import React from "react"

interface ProfileHeaderProps {
  name: string
  avatarUrl?: string
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, avatarUrl }) => {
  return (
    <div className="flex flex-col items-center mt-[100px] mb-[90px]">
      <div className="rounded-full">
          <Image src='/home/categories/1.png' alt={name} width={400} height={400} className="object-cover size-[245px] rounded-full" />
      </div>
      <h1 className="text-[40px] font-medium mt-6">{name}</h1>
    </div>
  )}

export default ProfileHeader
