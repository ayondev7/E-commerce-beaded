import React from 'react'
import Image from 'next/image'

interface CategoryCardProps {
  image: string;
  title: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ image, title }) => {
  return (
    <div className="text-center relative">
      <Image
        src={image}
        alt={title}
        width={600}
        height={600}
        className="h-[535px] w-[390px] object-cover"
      />
      <div className="absolute h-[535px] w-full inset-0 bg-black/40 rounded-lg flex items-center justify-center">
        <h3 className="absolute bottom-[54px] text-2xl font-medium uppercase text-white">{title}</h3>
      </div>
    </div>
  )
}

export default CategoryCard