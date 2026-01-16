// Librarian Dashboard Types
export interface MemberWithOverdue {
  id: number
  name: string
  email: string
  overdue_count: number
}

export interface LibrarianDashboardData {
  total_books: number
  total_borrowed_books: number
  books_due_today: number
  members_with_overdue: MemberWithOverdue[]
  pagination: {
    current_page: number
    total_pages: number
    total_count: number
    per_page: number
  }
}

// Member Dashboard Types
export interface BorrowedBook {
  id: number
  book: {
    id: number
    title: string
    author: string
  }
  borrowed_at: string
  due_date: string
  days_until_due: number
  is_overdue: boolean
  days_overdue: number
}

export interface OverdueBook {
  id: number
  book: {
    id: number
    title: string
    author: string
  }
  borrowed_at: string
  due_date: string
  days_overdue: number
}

export interface MemberDashboardData {
  borrowed_books: BorrowedBook[]
  overdue_books: OverdueBook[]
  summary: {
    total_borrowed: number
    total_overdue: number
  }
  pagination: {
    current_page: number
    total_pages: number
    total_count: number
    per_page: number
  }
}

export type DashboardData = LibrarianDashboardData | MemberDashboardData

export interface DashboardFilters {
  page?: number
  per_page?: number
}
