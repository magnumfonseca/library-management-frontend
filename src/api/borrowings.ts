import api from './client'
import type { Borrowing, BorrowingFilters, JsonApiResponse, PaginationMeta, ApiPaginationMeta } from '@/types'

type BorrowingAttributes = Omit<Borrowing, 'id'>

interface BorrowingsApiResponse {
  data: JsonApiResponse<BorrowingAttributes>['data']
  meta?: ApiPaginationMeta
}

interface BorrowingsResponse {
  data: Borrowing[]
  meta: PaginationMeta
}

export async function getBorrowings(filters: BorrowingFilters = {}): Promise<BorrowingsResponse> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value != null)
  )

  const response = await api.get<BorrowingsApiResponse>('/api/v1/borrowings', { params })

  const borrowings = Array.isArray(response.data.data)
    ? response.data.data.map((item) => ({ id: item.id, ...item.attributes }))
    : [{ id: response.data.data.id, ...response.data.data.attributes }]

  const page = response.data.meta?.page

  return {
    data: borrowings,
    meta: {
      current_page: page?.number || 1,
      total_pages: page?.totalPages || 1,
      total_count: page?.total || borrowings.length,
      per_page: page?.size || 25,
    },
  }
}

export async function borrowBook(bookId: string): Promise<Borrowing> {
  const response = await api.post<JsonApiResponse<BorrowingAttributes>>('/api/v1/borrowings', {
    borrowing: { book_id: bookId },
  })

  if (Array.isArray(response.data.data)) {
    throw new Error('Unexpected array response')
  }

  return { id: response.data.data.id, ...response.data.data.attributes }
}

export async function returnBook(borrowingId: string): Promise<Borrowing> {
  const response = await api.patch<JsonApiResponse<BorrowingAttributes>>(
    `/api/v1/borrowings/${borrowingId}/return`
  )

  if (Array.isArray(response.data.data)) {
    throw new Error('Unexpected array response')
  }

  return { id: response.data.data.id, ...response.data.data.attributes }
}
