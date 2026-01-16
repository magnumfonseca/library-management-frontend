export interface Book {
  id: string
  title: string
  author: string
  genre: string
  isbn: string
  total_copies: number
  available_copies: number
}

export interface BookFilters {
  title?: string
  author?: string
  genre?: string
  page?: number
  per_page?: number
}

export interface CreateBookInput {
  title: string
  author: string
  genre: string
  isbn: string
  total_copies: number
}

export interface UpdateBookInput {
  title?: string
  author?: string
  genre?: string
  isbn?: string
  total_copies?: number
}
