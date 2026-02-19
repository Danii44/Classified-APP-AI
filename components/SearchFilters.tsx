'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { Search, X } from 'lucide-react'

interface SearchFiltersProps {
  onSearch: (filters: Record<string, any>) => void
  categories: Array<{ id: string; category_name: string; slug: string }>
  cities: string[]
}

export function SearchFilters({ onSearch, categories, cities }: SearchFiltersProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [condition, setCondition] = useState('')

  const handleSearch = () => {
    onSearch({
      search,
      category: selectedCategory,
      city: selectedCity,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      condition: condition || undefined
    })
  }

  const handleReset = () => {
    setSearch('')
    setSelectedCategory('')
    setSelectedCity('')
    setPriceRange([0, 1000000])
    setCondition('')
  }

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Search & Filter</h3>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <Input
          placeholder="Search listings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {/* Category Filter */}
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(cat => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.category_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* City Filter */}
      <Select value={selectedCity} onValueChange={setSelectedCity}>
        <SelectTrigger>
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
        <SelectContent>
          {cities.map(city => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Condition Filter */}
      <Select value={condition} onValueChange={setCondition}>
        <SelectTrigger>
          <SelectValue placeholder="All conditions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="like_new">Like New</SelectItem>
          <SelectItem value="good">Good</SelectItem>
          <SelectItem value="fair">Fair</SelectItem>
          <SelectItem value="used">Used</SelectItem>
        </SelectContent>
      </Select>

      {/* Price Range Slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Price Range: AED {priceRange[0].toLocaleString()} - AED {priceRange[1].toLocaleString()}</label>
        <Slider
          min={0}
          max={1000000}
          step={10000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="w-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleSearch} className="flex-1">
          Search
        </Button>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <X size={16} />
          Reset
        </Button>
      </div>
    </Card>
  )
}
