export interface JsonApiResource<T> {
  id: string
  type: string
  attributes: T
}

export interface JsonApiResponse<T> {
  data: JsonApiResource<T> | JsonApiResource<T>[]
  meta?: PaginationMeta
  links?: PaginationLinks
}

export interface PaginationMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
}

export interface PaginationLinks {
  self: string
  first: string
  last: string
  prev: string | null
  next: string | null
}

export interface ApiError {
  status: string
  detail: string
}

export interface ApiErrorResponse {
  errors: ApiError[]
}
