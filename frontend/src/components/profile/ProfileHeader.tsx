import Image from "next/image"
import React from "react"
import { useMe } from "@/hooks/customerHooks"

const ProfileHeader: React.FC = () => {
  const { data: customerData } = useMe();
  
  const displayName = customerData?.name || "User";
  const userImage = customerData?.image;

  return (
    <div className="flex flex-col items-center mt-[100px] mb-[90px]">
      <div className="rounded-full">
        {userImage ? (
          <Image 
            src={userImage} 
            alt={displayName} 
            width={800} 
            height={800} 
            className="object-cover size-[245px] rounded-full" 
          />
        ) : (
          <Image 
            src='/home/categories/1.png' 
            alt={displayName} 
            width={800} 
            height={800} 
            className="object-cover size-[245px] rounded-full" 
          />
        )}
      </div>
      <h1 className="text-[40px] font-medium mt-6">{displayName}</h1>
    </div>
  )
}

export default ProfileHeader
