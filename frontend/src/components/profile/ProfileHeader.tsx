import Image from "next/image"
import React from "react"

interface ProfileHeaderProps {
  name: string
  avatarUrl?: string
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, avatarUrl }) => {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative size-28 overflow-hidden rounded-full border">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-gray-100 text-3xl font-semibold text-gray-500">
            {name.split(" ").map((n) => n[0]).join("")}
          </div>
        )}
      </div>
      <h1 className="text-2xl font-semibold uppercase tracking-wide">{name}</h1>
    </div>
  )}

export default ProfileHeader
