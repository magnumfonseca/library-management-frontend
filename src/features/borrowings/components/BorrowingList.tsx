import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBorrowings } from '@/api/borrowings'
import { BorrowingCard } from './BorrowingCard'
import { Pagination } from '@/components/ui'
import type { BorrowingFilters } from '@/types'

export function BorrowingList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<BorrowingFilters['status']>(
    (searchParams.get('status') as BorrowingFilters['status']) || undefined
  )

  const filters: BorrowingFilters = {
    status: activeFilter,
    page: Number(searchParams.get('page')) || 1,
    per_page: 12,
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['borrowings', filters],
    queryFn: () => getBorrowings(filters),
  })

  const handleFilterChange = (status: BorrowingFilters['status']) => {
    setActiveFilter(status)
    const params = new URLSearchParams()
    if (status) params.set('status', status)
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
    return <BorrowingListSkeleton />
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">Failed to load borrowings. Please try again.</p>
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

  const borrowings = data?.data || []
  const meta = data?.meta

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Borrowings</h1>
        <p className="text-gray-500">
          {meta?.total_count || 0} borrowing{meta?.total_count !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex gap-2">
        <FilterButton
          label="All"
          isActive={!activeFilter}
          onClick={() => handleFilterChange(undefined)}
        />
        <FilterButton
          label="Active"
          isActive={activeFilter === 'active'}
          onClick={() => handleFilterChange('active')}
        />
        <FilterButton
          label="Returned"
          isActive={activeFilter === 'returned'}
          onClick={() => handleFilterChange('returned')}
        />
        <FilterButton
          label="Overdue"
          isActive={activeFilter === 'overdue'}
          onClick={() => handleFilterChange('overdue')}
        />
      </div>

      {borrowings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No borrowings found</h3>
          <p className="text-gray-500">
            {activeFilter
              ? `You don't have any ${activeFilter} borrowings.`
              : "You haven't borrowed any books yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrowings.map((borrowing) => (
              <BorrowingCard key={borrowing.id} borrowing={borrowing} />
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

interface FilterButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
}

function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}

function BorrowingListSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mt-2" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mt-4" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
