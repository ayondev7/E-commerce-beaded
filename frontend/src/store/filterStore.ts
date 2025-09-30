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

export const useFilterStore = create<FilterState>((set, get) => ({
  selectedCollection: 'all',
  selectedCategory: 'all',
  searchQuery: '',
  currentPage: 1,
  setCollection: (collection) => {
    console.log('Setting collection:', collection);
    set({ selectedCollection: collection, currentPage: 1 });
  },
  setCategory: (category) => {
    console.log('Setting category:', category);
    set({ selectedCategory: category, currentPage: 1 });
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentPage: (page) => set({ currentPage: page }),
  resetFilters: (initialCollection, initialCategory) => {
    console.log('Resetting filters with:', { initialCollection, initialCategory });
    
    // Convert URL slugs to readable names (what backend expects)
    let normalizedCollection = initialCollection;
    if (initialCollection === 'boishakhi-collection') {
      normalizedCollection = 'boishakhi collection';
    } else if (initialCollection === 'hot-deals') {
      normalizedCollection = 'hot deals';
    } else if (initialCollection === 'eid') {
      normalizedCollection = 'eid collection';
    } else if (initialCollection === 'all') {
      normalizedCollection = 'all';
    } else {
      // For any other slug, convert hyphens to spaces
      normalizedCollection = initialCollection.replace(/-/g, ' ');
    }
    
    // Convert category slug to readable name (what backend expects)
    const normalizedCategory = initialCategory === 'all' ? 'all' : initialCategory.replace(/-/g, ' ');
    
    const newState = {
      selectedCollection: normalizedCollection,
      selectedCategory: normalizedCategory,
      searchQuery: '',
      currentPage: 1
    };
    
    console.log('Setting new state:', newState);
    
    // Force the update by using the callback form
    set(() => newState);
    
    // Double check the state was set
    setTimeout(() => {
      const currentState = get();
      console.log('State after reset:', {
        selectedCollection: currentState.selectedCollection,
        selectedCategory: currentState.selectedCategory
      });
    }, 0);
  }
}));