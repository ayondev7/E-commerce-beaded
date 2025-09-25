"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Search, Filter } from 'lucide-react'

const SideFilter = () => {
  const [activeTab, setActiveTab] = useState<'collections' | 'categories'>('collections')
  const [selectedCollection, setSelectedCollection] = useState('boishakhi')
  const [searchQuery, setSearchQuery] = useState('')

  const collections = [
    { id: 'all', label: 'ALL ITEMS' },
    { id: 'hot', label: 'HOT DEALS' },
    { id: 'eid', label: 'EID COLLECTION' },
    { id: 'boishakhi', label: 'BOISHAKHI COLLECTION' }
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900 tracking-wide">FILTERS</h2>
        <Filter className="w-6 h-6 text-gray-700" />
      </div>

      {/* Search Input */}
      <div className="mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
            onClick={() => setActiveTab('collections')}
            className={`pb-4 pr-8 text-sm font-semibold border-b-2 transition-colors tracking-wide ${
              activeTab === 'collections'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            COLLECTIONS
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-4 text-sm font-semibold border-b-2 transition-colors tracking-wide ${
              activeTab === 'categories'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            CATEGORIES
          </button>
        </div>
      </div>

      {/* Filter Options */}
      {activeTab === 'collections' && (
        <RadioGroup
          value={selectedCollection}
          onValueChange={setSelectedCollection}
          className="space-y-5"
        >
          {collections.map((collection) => (
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
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {activeTab === 'categories' && (
        <div className="text-sm text-gray-500">
          Categories content will go here
        </div>
      )}
    </div>
  )
}

export default SideFilter