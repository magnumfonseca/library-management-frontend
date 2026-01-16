import api from './client'
import type { Book, BookFilters, CreateBookInput, UpdateBookInput, JsonApiResponse, PaginationMeta, ApiPaginationMeta } from '@/types'

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
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value != null)
  )

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

export async function createBook(input: CreateBookInput): Promise<Book> {
  const response = await api.post<JsonApiResponse<BookAttributes>>('/api/v1/books', {
    book: input,
  })

  if (Array.isArray(response.data.data)) {
    throw new Error('Unexpected array response')
  }

  return { id: response.data.data.id, ...response.data.data.attributes }
}

export async function updateBook(id: string, input: UpdateBookInput): Promise<Book> {
  const response = await api.patch<JsonApiResponse<BookAttributes>>(`/api/v1/books/${id}`, {
    book: input,
  })

  if (Array.isArray(response.data.data)) {
    throw new Error('Unexpected array response')
  }

  return { id: response.data.data.id, ...response.data.data.attributes }
}

export async function deleteBook(id: string): Promise<void> {
  await api.delete(`/api/v1/books/${id}`)
}
