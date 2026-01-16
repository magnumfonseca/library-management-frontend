export interface Borrowing {
  id: string
  book_id: string
  user_id: string
  borrowed_at: string
  due_date: string
  returned_at: string | null
  book_title: string
  book_author: string
}

export interface BorrowingFilters {
  status?: 'active' | 'returned' | 'overdue'
  page?: number
  per_page?: number
}
