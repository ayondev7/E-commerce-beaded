"use client";
import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import ProductCard from "../product/ProductCard";
import ProductCardSkeleton from "@/components/skeleton/ProductCardSkeleton";
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
    const params: Record<string, unknown> = {
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

  const collectionDisplayName = useMemo(() => {
    const collection = selectedCollection !== "all" ? selectedCollection : initialCollection;
    if (!collection) return "Shop";
    const readable = slugToReadableName(collection);
    return readable || "Shop";
  }, [selectedCollection, initialCollection]);

  const filteredProducts = useMemo(() => {
    if (!productsData?.products) return [];
    
    let products = productsData.products;
    
    // Apply search filter
    if (searchQuery.trim()) {
      products = products.filter((product: Record<string, unknown>) => {
        const name = (product.productName as string) ?? "";
        const cat = (product.categoryName as string) ?? "";
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    // Apply sorting
    const sortedProducts = [...products].sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      switch (sortBy) {
        case "Price High to Low":
          return (Number(b.price as number) || 0) - (Number(a.price as number) || 0);
        case "Price Low to High":
          return (Number(a.price as number) || 0) - (Number(b.price as number) || 0);
        case "By Name A to Z":
          return String(a.productName as string || "").localeCompare(String(b.productName as string || ""));
        case "By Name Z to A":
          return String(b.productName as string || "").localeCompare(String(a.productName as string || ""));
        case "Most Recent":
        default:
          return new Date(String(b.createdAt as string)).getTime() - new Date(String(a.createdAt as string)).getTime();
      }
    });
    
    return sortedProducts;
  }, [productsData?.products, searchQuery, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
  <h1 className="uppercase text-[48px]">{(collectionDisplayName && collectionDisplayName.toLowerCase() !== 'all') ? collectionDisplayName : 'Shop'}</h1>
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
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : filteredProducts.map((product, index) => (
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
     <div className="mt-[60px]">
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
