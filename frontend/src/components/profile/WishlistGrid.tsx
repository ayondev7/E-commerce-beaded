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
  ]
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <ProductCard image={p.image} category={p.category} name={p.name} price={p.price} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WishlistGrid
