import { categoriesServices } from "@/constants"
import { useState } from "react"

export const CategoryFilter = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleCategoryChange = async (category: string, isChecked: boolean) => {
    let newSelectedCategories: string[]
    if (isChecked) {
      newSelectedCategories = [...selectedCategories, category]
    } else {
      newSelectedCategories = selectedCategories.filter((c) => c !== category)
    }

    setSelectedCategories(newSelectedCategories)
  }

  return (
    <div>
      <label className="text-sm font-medium">Catégorie</label>
      <div className="mt-1 space-y-1">
        {categoriesServices.map((category) => (
          <div key={category} className="flex items-center">
            <input
              type="checkbox"
              id={category}
              className="h-4 w-4 flex-shrink-0"
              checked={selectedCategories.includes(category)}
              onChange={(e) => handleCategoryChange(category, e.target.checked)}
            />
            <label
              htmlFor={category}
              className="ml-2 truncate text-sm hover:text-clip"
              title={category}
            >
              {category}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
