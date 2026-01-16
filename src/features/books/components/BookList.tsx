import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBooks, createBook, updateBook, deleteBook } from '@/api/books'
import { useAuthStore } from '@/store/authStore'
import { BookCard } from './BookCard'
import { BookFilters } from './BookFilters'
import { BookForm } from './BookForm'
import { Modal, Pagination } from '@/components/ui'
import type { Book, BookFilters as BookFiltersType, CreateBookInput } from '@/types'

export function BookList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [deletingBook, setDeletingBook] = useState<Book | null>(null)

  // Open create modal if action=add is in URL
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsCreateModalOpen(true)
      const params = new URLSearchParams(searchParams)
      params.delete('action')
      setSearchParams(params, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const isLibrarian = user?.role === 'librarian'

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

  const createMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      setIsCreateModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateBookInput }) => updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      setEditingBook(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      setDeletingBook(null)
    },
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
        {isLibrarian && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Book
          </button>
        )}
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
              <BookCard
                key={book.id}
                book={book}
                onEdit={isLibrarian ? () => setEditingBook(book) : undefined}
                onDelete={isLibrarian ? () => setDeletingBook(book) : undefined}
              />
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

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Book"
      >
        <BookForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={createMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        title="Edit Book"
      >
        {editingBook && (
          <BookForm
            book={editingBook}
            onSubmit={(data) => updateMutation.mutate({ id: editingBook.id, data })}
            onCancel={() => setEditingBook(null)}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        title="Delete Book"
      >
        {deletingBook && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete <span className="font-medium">{deletingBook.title}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteMutation.mutate(deletingBook.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setDeletingBook(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
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
