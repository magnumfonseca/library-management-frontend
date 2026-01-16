import type { Borrowing } from '@/types'

interface BorrowingCardProps {
  borrowing: Borrowing
  onReturn?: () => void
  isReturning?: boolean
}

export function BorrowingCard({ borrowing, onReturn, isReturning }: BorrowingCardProps) {
  const isOverdue = borrowing.status === 'overdue'
  const isReturned = borrowing.status === 'returned'
  const isActive = borrowing.status === 'active'

  const statusStyles = {
    active: 'bg-blue-100 text-blue-800',
    returned: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{borrowing.book_title}</h3>
        </div>
        <span className={`ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${statusStyles[borrowing.status]}`}>
          {borrowing.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Borrowed</span>
          <span className="text-gray-900">{formatDate(borrowing.borrowed_at)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Due Date</span>
          <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}>
            {formatDate(borrowing.due_date)}
          </span>
        </div>
        {isReturned && borrowing.returned_at && (
          <div className="flex justify-between">
            <span className="text-gray-500">Returned</span>
            <span className="text-gray-900">{formatDate(borrowing.returned_at)}</span>
          </div>
        )}
        {isOverdue && (
          <div className="flex justify-between">
            <span className="text-gray-500">Days Overdue</span>
            <span className="text-red-600 font-medium">{borrowing.days_overdue}</span>
          </div>
        )}
      </div>

      {isActive && onReturn && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onReturn}
            disabled={isReturning}
            aria-label={`Return ${borrowing.book_title}`}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isReturning ? 'Returning...' : 'Return Book'}
          </button>
        </div>
      )}
    </div>
  )
}
