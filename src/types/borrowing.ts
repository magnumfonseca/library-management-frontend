export interface Borrowing {
  id: string
  book_id: string
  user_id: string
  book_title: string
  borrowed_at: string
  due_date: string
  returned_at: string | null
  status: 'active' | 'returned' | 'overdue'
  days_overdue: number
}

export interface BorrowingFilters {
  status?: 'active' | 'returned' | 'overdue'
  page?: number
  per_page?: number
}
