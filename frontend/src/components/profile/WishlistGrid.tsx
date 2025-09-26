import React from "react"
import ProductCard from "@/components/product/ProductCard"

const WishlistGrid: React.FC = () => {
  const products = [
    { image: "/public/home/categories/1.png".replace("/public", ""), category: "Bracelet", name: "Bright Barbie Bracelet", price: 499 },
    { image: "/public/home/categories/2.png".replace("/public", ""), category: "Bracelet", name: "Pure Barbie Bracelet", price: 499 },
    { image: "/public/home/categories/3.png".replace("/public", ""), category: "Bracelet", name: "Flower Child Barbie Bracelet", price: 599 },
    { image: "/public/home/categories/4.png".replace("/public", ""), category: "Necklace", name: "Beads Bug Ceramic Bead Necklace", price: 2900 },
    { image: "/public/heroSlider/2.jpg".replace("/public", ""), category: "Necklace", name: "Bronze Bead Necklace", price: 3500 },
    { image: "/public/home/categories/1.png".replace("/public", ""), category: "Bracelet", name: "Flower Child Barbie Bracelet", price: 599 },
    { image: "/public/home/categories/2.png".replace("/public", ""), category: "Bracelet", name: "Bright Barbie Bracelet (Variant)", price: 549 },
    { image: "/public/home/categories/3.png".replace("/public", ""), category: "Bracelet", name: "Petite Flower Bracelet", price: 459 },
    { image: "/public/home/categories/4.png".replace("/public", ""), category: "Necklace", name: "Ceramic Bead Pendant", price: 1999 },
    { image: "/public/heroSlider/2.jpg".replace("/public", ""), category: "Necklace", name: "Classic Bronze Necklace", price: 3200 },
  ]
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-x-5 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden">
        {products.map((p, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <ProductCard titleClassName="text-lg" imageClassName="2xl:w-[320px] 2xl:h-[380px]" image={p.image} category={p.category} name={p.name} price={p.price} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WishlistGrid
