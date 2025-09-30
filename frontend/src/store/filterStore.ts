import { create } from 'zustand';

interface FilterState {
  selectedCollection: string;
  selectedCategory: string;
  searchQuery: string;
  currentPage: number;
  setCollection: (collection: string) => void;
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: (initialCollection: string, initialCategory: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedCollection: 'all',
  selectedCategory: 'all',
  searchQuery: '',
  currentPage: 1,
  setCollection: (collection) => set({ selectedCollection: collection, currentPage: 1 }),
  setCategory: (category) => set({ selectedCategory: category, currentPage: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentPage: (page) => set({ currentPage: page }),
  resetFilters: (initialCollection, initialCategory) => set({
    selectedCollection: initialCollection || 'all',
    selectedCategory: initialCategory || 'all',
    searchQuery: '',
    currentPage: 1
  })
}));