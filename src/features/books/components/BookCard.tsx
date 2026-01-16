import type { Book } from '@/types'
import { useAuthStore } from '@/store/authStore'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const user = useAuthStore((state) => state.user)
  const isAvailable = book.available_copies > 0
  const isMember = user?.role === 'member'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{book.title}</h3>
          <p className="text-sm text-gray-500">{book.author}</p>
        </div>
        <span
          className={`ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full ${
            isAvailable
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Genre</span>
          <span className="text-gray-900 font-medium">{book.genre}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">ISBN</span>
          <span className="text-gray-900 font-mono text-xs">{book.isbn}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Copies</span>
          <span className="text-gray-900">
            {book.available_copies} / {book.total_copies} available
          </span>
        </div>
      </div>

      {isMember && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            disabled={!isAvailable}
            aria-label={isAvailable ? `Borrow ${book.title}` : `${book.title} is not available`}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isAvailable ? 'Borrow Book' : 'Not Available'}
          </button>
        </div>
      )}
    </div>
  )
}
