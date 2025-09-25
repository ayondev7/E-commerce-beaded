import React from 'react'
import Image from 'next/image'

interface CategoryCardProps {
  image: string;
  title: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ image, title }) => {
  return (
    <div className="text-center relative group cursor-pointer overflow-hidden">
      <Image
        src={image}
        alt={title}
        width={600}
        height={600}
        className="h-[535px] w-[390px] object-cover"
      />
      <div className="absolute h-[535px] w-full inset-0 bg-black/40 rounded-lg">
    <h3 className="absolute group-hover:translate-y-[-100px] bottom-[54px] left-1/2 transform -translate-x-1/2 text-2xl font-medium uppercase text-white transition-transform duration-400 ease-out">{title}</h3>
  <button className='absolute w-[245px] bottom-[75px] left-1/2 transform -translate-x-1/2 uppercase bg-white text-lg font-medium px-[32px] py-[18px] transition-transform duration-500 ease-out delay-100 translate-y-[150px] group-hover:translate-y-0'>Shop collection</button>
      </div>
    </div>
  )
}

export default CategoryCard