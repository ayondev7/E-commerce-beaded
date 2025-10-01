import React from 'react'

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="max-w-[390px] animate-pulse">
      <div className="relative overflow-hidden">
        <div className="bg-gray-200 2xl:w-[390px] 2xl:h-[460px] w-full h-[350px] object-cover" />
        <div className="bg-white/35 absolute w-full bottom-0 h-[100px] transform translate-y-[120%]">
          <div className="flex justify-center h-full items-center gap-x-3 text-[#7D7D7D]">
            <div className="bg-white p-3 rounded-full h-10 w-10" />
            <div className="bg-white p-3 rounded-full h-10 w-10" />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-[18px] uppercase items-center">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="mt-[12px] h-6 w-40 bg-gray-200 rounded" />
        <div className="mt-1.5 h-6 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

export default ProductCardSkeleton