import CardSlider from '@/components/home/CardSlider'
import BestSeller from '@/sections/homeSections/BestSeller'
import Categories from '@/sections/homeSections/Categories'
import Hero from '@/sections/homeSections/Hero'
import React from 'react'

const page = () => {
  return (
    <div>
      <Hero />
      <BestSeller />
      <Categories />
    </div>
  )
}

export default page