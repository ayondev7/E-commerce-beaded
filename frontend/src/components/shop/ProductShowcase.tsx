"use client";
import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import ProductCard from "../product/ProductCard";
import CustomPagination from "../generalComponents/CustomPagination";
import SelectField from "../generalComponents/Form/SelectField";
import { useProductList } from "@/hooks/productHooks";
import { useCategoryList } from "@/hooks/categoryHooks";
import { useFilterStore } from "@/store/filterStore";
import { SORT_OPTIONS, SortOption } from "@/constants/sortOptions";
import { slugToReadableName } from "@/utils/slugUtils";

interface ProductShowcaseProps {
  initialCollection: string;
  initialCategory: string;
}

const ProductShowcase = ({ initialCollection, initialCategory }: ProductShowcaseProps) => {
  const [sortBy, setSortBy] = useState<SortOption>("Most Recent");
  
  const {
    selectedCollection,
    selectedCategory,
    searchQuery,
    currentPage,
    setCurrentPage,
    resetFilters
  } = useFilterStore();
  
  const { data: categoriesData } = useCategoryList();

  useEffect(() => {
    resetFilters(initialCollection, initialCategory);
  }, [initialCollection, initialCategory, resetFilters]);
  
  const categoryId = useMemo(() => {
    if (!categoriesData?.categories || selectedCategory === "all") return undefined;
    
    // Convert selectedCategory slug to readable name for comparison
    const readableCategoryName = slugToReadableName(selectedCategory);
    
    const category = categoriesData.categories.find(cat => 
      cat.name.toLowerCase() === readableCategoryName.toLowerCase()
    );
    return category?.id;
  }, [categoriesData, selectedCategory]);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page: currentPage,
      limit: 6
    };
    
    if (selectedCollection !== "all") {
      params.collectionName = selectedCollection;
    }
    
    if (categoryId) {
      params.categoryId = categoryId;
    }
    
    return params;
  }, [currentPage, selectedCollection, categoryId]);

  const { data: productsData, isLoading } = useProductList(queryParams);

  const filteredProducts = useMemo(() => {
    if (!productsData?.products) return [];
    
    let products = productsData.products;
    
    // Apply search filter
    if (searchQuery.trim()) {
      products = products.filter((product: any) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    const sortedProducts = [...products].sort((a: any, b: any) => {
      switch (sortBy) {
        case "Price High to Low":
          return b.price - a.price;
        case "Price Low to High":
          return a.price - b.price;
        case "By Name A to Z":
          return a.productName.localeCompare(b.productName);
        case "By Name Z to A":
          return b.productName.localeCompare(a.productName);
        case "Most Recent":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    return sortedProducts;
  }, [productsData?.products, searchQuery, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div>
      <h1 className="uppercase text-[48px]">Shop</h1>
      <div className="flex items-center justify-between mb-[30px]">
        <span className="text-[#6D6D6D] text-lg tracking-[-1%] uppercase">
          Showing {filteredProducts.length} out of {productsData?.totalProductsInDb || 0} results
        </span>
        <SelectField
          value={sortBy}
          onChange={(value) => setSortBy(value as SortOption)}
          options={SORT_OPTIONS}
          placeholder="Sort by"
          className="w-[253px]"
          triggerClassName="text-base text-[#7D7D7D] [&>svg]:w-4.5 [&>svg]:h-4.5"
        />
      </div>
      <div className="grid grid-cols-3 gap-x-5 gap-y-20">
        {filteredProducts.map((product, index) => (
          <ProductCard 
            key={index} 
            productId={product.id}
            productSlug={product.productSlug}
            image={product.images[0] || "/home/categories/1.png"}
            category={product.categoryName || ""}
            name={product.productName}
            price={product.price}
            isInCart={product.isInCart}
            isInWishlist={product.isInWishlist}
          />
        ))}
      </div>
     <div className="mt-[30px]">
       <CustomPagination 
         currentPage={currentPage}
         totalPages={productsData?.totalPages || 1}
         onPageChange={handlePageChange}
       />
     </div>
    </div>
  );
};

export default ProductShowcase;
