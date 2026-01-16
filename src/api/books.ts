import api from './client'
import type { Book, BookFilters, JsonApiResponse, PaginationMeta, ApiPaginationMeta } from '@/types'

type BookAttributes = Omit<Book, 'id'>

interface BooksApiResponse {
  data: JsonApiResponse<BookAttributes>['data']
  meta?: ApiPaginationMeta
}

interface BooksResponse {
  data: Book[]
  meta: PaginationMeta
}

export async function getBooks(filters: BookFilters = {}): Promise<BooksResponse> {
  const params = new URLSearchParams()

  if (filters.title) params.append('title', filters.title)
  if (filters.author) params.append('author', filters.author)
  if (filters.genre) params.append('genre', filters.genre)
  if (filters.page) params.append('page', String(filters.page))
  if (filters.per_page) params.append('per_page', String(filters.per_page))

  const response = await api.get<BooksApiResponse>('/api/v1/books', { params })

  const books = Array.isArray(response.data.data)
    ? response.data.data.map((item) => ({ id: item.id, ...item.attributes }))
    : [{ id: response.data.data.id, ...response.data.data.attributes }]

  const page = response.data.meta?.page

  return {
    data: books,
    meta: {
      current_page: page?.number || 1,
      total_pages: page?.totalPages || 1,
      total_count: page?.total || books.length,
      per_page: page?.size || 25,
    },
  }
}

export async function getBook(id: string): Promise<Book> {
  const response = await api.get<JsonApiResponse<BookAttributes>>(`/api/v1/books/${id}`)

  if (Array.isArray(response.data.data)) {
    throw new Error('Unexpected array response')
  }

  return { id: response.data.data.id, ...response.data.data.attributes }
}
