import BestSeller from '@/sections/homeSections/BestSeller'
import Categories from '@/sections/homeSections/Categories'
import ExclusiveCollection from '@/sections/homeSections/ExclusiveCollection'
import Hero from '@/sections/homeSections/Hero'
import Testimonial from '@/sections/homeSections/Testimonial'
import React from 'react'

const page = () => {
  return (
    <div>
      <Hero />
      <BestSeller />
      <Categories />
      <ExclusiveCollection />
      <Testimonial />
    </div>
  )
}

export default page