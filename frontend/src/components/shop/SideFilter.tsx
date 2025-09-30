"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LuSearch, LuFilter } from "react-icons/lu";
import { useCategoryList } from "@/hooks/categoryHooks";
import { useFilterStore } from "@/store/filterStore";
import { slugToReadableName } from "@/utils/slugUtils";

interface SideFilterProps {
  initialCollection: string;
  initialCategory: string;
}

const SideFilter = ({
  initialCollection,
  initialCategory,
}: SideFilterProps) => {
  const [activeTab, setActiveTab] = useState<"collections" | "categories">(
    "collections"
  );

  const {
    selectedCollection,
    selectedCategory,
    searchQuery,
    setCollection,
    setCategory,
    setSearchQuery,
    resetFilters,
  } = useFilterStore();

  const { data: categoriesData } = useCategoryList();

  const collections = [
    { id: "all", label: "ALL ITEMS" },
    { id: "hot deals", label: "HOT DEALS" },
    { id: "eid collection", label: "EID COLLECTION" },
    { id: "boishakhi collection", label: "BOISHAKHI COLLECTION" },
  ];

  useEffect(() => {
    const readableCollection = slugToReadableName(initialCollection);
    const readableCategory = slugToReadableName(initialCategory);
    
    console.log('SideFilter Debug:', {
      initialCollection,
      initialCategory,
      readableCollection,
      readableCategory,
      currentSelected: { selectedCollection, selectedCategory }
    });
    
    // Debug categories data
    if (categoriesData?.categories) {
      console.log('Available categories:', categoriesData.categories.map(cat => ({
        name: cat.name,
        slug: cat.name.toLowerCase().replace(/\s+/g, "-")
      })));
    }
    
    // Debug collections mapping
    console.log('Available collections:', collections.map(col => ({
      id: col.id,
      label: col.label
    })));
    
    resetFilters(initialCollection, initialCategory);
  }, [initialCollection, initialCategory, resetFilters]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold  tracking-wide">FILTERS</h2>
        <LuFilter className="w-6 h-6 text-gray-700" />
      </div>

      {/* Search Input */}
      <div className="mb-10">
        <div className="relative">
          <LuSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="SEARCH"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-base font-normal placeholder:text-gray-400 placeholder:font-normal border-gray-300 bg-white focus:border-gray-400 focus:ring-0 rounded-none"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex border-b border-gray-300">
          <button
            onClick={() => setActiveTab("collections")}
            className={`pb-4 pr-8 text-sm font-semibold border-b-2 transition-colors tracking-wide ${
              activeTab === "collections"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            COLLECTIONS
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-4 text-sm font-semibold border-b-2 transition-colors tracking-wide ${
              activeTab === "categories"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            CATEGORIES
          </button>
        </div>
      </div>

      {/* Filter Options */}
      {activeTab === "collections" && (
        <RadioGroup
          value={selectedCollection}
          onValueChange={setCollection}
          className="space-y-5"
        >
          {collections.map((collection) => {
            const isSelected = selectedCollection === collection.id;
            
            console.log('Collection mapping:', {
              collectionId: collection.id,
              collectionLabel: collection.label,
              selectedCollection,
              isSelected
            });
            
            return (
              <div key={collection.id} className="flex items-center space-x-4">
                <RadioGroupItem
                  value={collection.id}
                  id={collection.id}
                  className="w-5 h-5 border-2 border-gray-400 text-teal-500 focus:ring-teal-500 data-[state=checked]:border-teal-500 data-[state=checked]:bg-white data-[state=checked]:text-teal-500"
                  dotClassName="radio-dot-accent"
                />
                <Label
                  htmlFor={collection.id}
                  className="text-sm font-medium text-gray-800 cursor-pointer tracking-wide"
                >
                  {collection.label}
                  {isSelected && " ✓"}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      )}

      {activeTab === "categories" && (
        <RadioGroup
          value={selectedCategory}
          onValueChange={setCategory}
          className="space-y-5"
        >
          <div className="flex items-center space-x-4">
            <RadioGroupItem
              value="all"
              id="all-categories"
              className="w-5 h-5 border-2 border-gray-400 text-teal-500 focus:ring-teal-500 data-[state=checked]:border-teal-500 data-[state=checked]:bg-white data-[state=checked]:text-teal-500"
              dotClassName="radio-dot-accent"
            />
            <Label
              htmlFor="all-categories"
              className="text-sm font-medium text-gray-800 cursor-pointer tracking-wide"
            >
              ALL CATEGORIES
            </Label>
          </div>
          {categoriesData?.categories?.map((category) => {
            const isSelected = selectedCategory === category.name;
            
            console.log('RadioGroup value:', selectedCategory);
            console.log('Category mapping:', {
              categoryName: category.name,
              selectedCategory,
              isSelected,
              exactMatch: selectedCategory === category.name,
              types: {
                selectedCategoryType: typeof selectedCategory,
                categoryNameType: typeof category.name
              },
              lengths: {
                selectedCategoryLength: selectedCategory?.length,
                categoryNameLength: category.name?.length
              }
            });
            
            return (
              <div key={category.id} className="flex items-center space-x-4">
                <RadioGroupItem
                  value={category.name}
                  id={`category-${category.id}`}
                  className="w-5 h-5 border-2 border-gray-400 text-teal-500 focus:ring-teal-500 data-[state=checked]:border-teal-500 data-[state=checked]:bg-white data-[state=checked]:text-teal-500"
                  dotClassName="radio-dot-accent"
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-medium text-gray-800 cursor-pointer tracking-wide"
                >
                  {category.name.toUpperCase()}
                  {isSelected && " ✓"}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      )}
    </div>
  );
};

export default SideFilter;
