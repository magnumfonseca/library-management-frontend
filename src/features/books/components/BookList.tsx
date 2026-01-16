import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBooks } from '@/api/books'
import { BookCard } from './BookCard'
import { BookFilters } from './BookFilters'
import { Pagination } from '@/components/ui'
import type { BookFilters as BookFiltersType } from '@/types'

export function BookList() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: BookFiltersType = {
    title: searchParams.get('title') || undefined,
    author: searchParams.get('author') || undefined,
    genre: searchParams.get('genre') || undefined,
    page: Number(searchParams.get('page')) || 1,
    per_page: 12,
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['books', filters],
    queryFn: () => getBooks(filters),
  })

  const handleFilterChange = (newFilters: BookFiltersType) => {
    const params = new URLSearchParams()
    if (newFilters.title) params.set('title', newFilters.title)
    if (newFilters.author) params.set('author', newFilters.author)
    if (newFilters.genre) params.set('genre', newFilters.genre)
    setSearchParams(params)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set('page', String(page))
    } else {
      params.delete('page')
    }
    setSearchParams(params)
  }

  if (isLoading) {
    return <BookListSkeleton />
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <BookFilters filters={filters} onFilterChange={handleFilterChange} />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">Failed to load books. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const books = data?.data || []
  const meta = data?.meta
  const hasActiveFilters = filters.title || filters.author || filters.genre

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Books</h1>
          <p className="text-gray-500">
            {meta?.total_count || 0} books {hasActiveFilters ? 'found' : 'in the library'}
          </p>
        </div>
      </div>

      <BookFilters filters={filters} onFilterChange={handleFilterChange} />

      {books.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
          <p className="text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your search filters.'
              : 'There are no books in the library yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {meta && meta.total_pages > 1 && (
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.total_pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

function BookListSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mt-2" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mt-4" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
