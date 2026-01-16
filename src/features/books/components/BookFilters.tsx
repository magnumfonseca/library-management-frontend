import { useForm } from 'react-hook-form'
import type { BookFilters as BookFiltersType } from '@/types'

interface BookFiltersProps {
  filters: BookFiltersType
  onFilterChange: (filters: BookFiltersType) => void
}

interface FilterForm {
  title: string
  author: string
  genre: string
}

export function BookFilters({ filters, onFilterChange }: BookFiltersProps) {
  const { register, handleSubmit, reset } = useForm<FilterForm>({
    defaultValues: {
      title: filters.title || '',
      author: filters.author || '',
      genre: filters.genre || '',
    },
  })

  const filterKey = `${filters.title || ''}-${filters.author || ''}-${filters.genre || ''}`

  const onSubmit = (data: FilterForm) => {
    onFilterChange({
      title: data.title || undefined,
      author: data.author || undefined,
      genre: data.genre || undefined,
    })
  }

  const handleClear = () => {
    reset({ title: '', author: '', genre: '' })
    onFilterChange({})
  }

  const hasActiveFilters = filters.title || filters.author || filters.genre

  return (
    <form key={filterKey} onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Search by title..."
            {...register('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Author
          </label>
          <input
            id="author"
            type="text"
            placeholder="Search by author..."
            {...register('author')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <input
            id="genre"
            type="text"
            placeholder="Search by genre..."
            {...register('genre')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
