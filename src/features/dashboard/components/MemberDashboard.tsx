import { useSearchParams } from 'react-router-dom'
import type { MemberDashboardData } from '@/types'
import { Pagination, BookIcon, AlertIcon } from '@/components/ui'

interface MemberDashboardProps {
  data: MemberDashboardData
}

export function MemberDashboard({ data }: MemberDashboardProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set('page', String(page))
    } else {
      params.delete('page')
    }
    setSearchParams(params)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Currently Borrowed"
          value={data.summary.total_borrowed}
          icon={<BookIcon />}
          color="blue"
        />
        <StatCard
          title="Overdue Books"
          value={data.summary.total_overdue}
          icon={<AlertIcon />}
          color="red"
        />
      </div>

      {/* Overdue Books Alert */}
      {data.overdue_books.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                You have {data.overdue_books.length} overdue book{data.overdue_books.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Please return these books as soon as possible to avoid late fees.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Borrowed Books */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            My Borrowed Books
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {data.pagination.total_count} active borrowing{data.pagination.total_count !== 1 ? 's' : ''}
          </p>
        </div>

        {data.borrowed_books.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Borrowings</h3>
            <p className="text-gray-500">You don't have any borrowed books at the moment.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {data.borrowed_books.map((borrowing) => (
                <div key={borrowing.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {borrowing.book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        by {borrowing.book.author}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Borrowed:</span>{' '}
                          <span className="text-gray-900">{formatDate(borrowing.borrowed_at)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Due:</span>{' '}
                          <span className={borrowing.is_overdue ? 'text-red-600 font-medium' : 'text-gray-900'}>
                            {formatDate(borrowing.due_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {borrowing.is_overdue ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Overdue by {borrowing.days_overdue} day{borrowing.days_overdue !== 1 ? 's' : ''}
                        </span>
                      ) : borrowing.days_until_due <= 3 ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Due in {borrowing.days_until_due} day{borrowing.days_until_due !== 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {borrowing.days_until_due} day{borrowing.days_until_due !== 1 ? 's' : ''} left
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data.pagination.total_pages > 1 && (
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  currentPage={data.pagination.current_page}
                  totalPages={data.pagination.total_pages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'red'
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
