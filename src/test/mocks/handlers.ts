import { http, HttpResponse } from 'msw'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const handlers = [
  http.post(`${API_URL}/api/v1/login`, async ({ request }) => {
    const body = await request.json() as { user: { email: string; password: string } }
    if (body.user.email === 'test@example.com' && body.user.password === 'password123') {
      return HttpResponse.json(
        {
          data: {
            id: '1',
            type: 'users',
            attributes: { email: 'test@example.com', name: 'Test User', role: 'member' }
          }
        },
        { headers: { Authorization: 'Bearer mock-jwt-token' } }
      )
    }
    return HttpResponse.json(
      { errors: [{ status: '401', detail: 'Invalid credentials' }] },
      { status: 401 }
    )
  }),

  http.post(`${API_URL}/api/v1/signup`, async ({ request }) => {
    const body = await request.json() as { user: { email: string; password: string; name: string } }
    return HttpResponse.json(
      {
        data: {
          id: '1',
          type: 'users',
          attributes: { email: body.user.email, name: body.user.name, role: 'member' }
        }
      },
      { headers: { Authorization: 'Bearer mock-jwt-token' } }
    )
  }),

  http.delete(`${API_URL}/api/v1/logout`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(`${API_URL}/api/v1/books`, () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          type: 'books',
          attributes: {
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            genre: 'Fiction',
            isbn: '978-0-7432-7356-5',
            total_copies: 5,
            available_copies: 3
          }
        },
        {
          id: '2',
          type: 'books',
          attributes: {
            title: '1984',
            author: 'George Orwell',
            genre: 'Dystopian',
            isbn: '978-0-452-28423-4',
            total_copies: 3,
            available_copies: 1
          }
        }
      ],
      meta: { current_page: 1, total_pages: 1, total_count: 2, per_page: 25 }
    })
  }),

  http.get(`${API_URL}/api/v1/books/:id`, ({ params }) => {
    return HttpResponse.json({
      data: {
        id: params.id,
        type: 'books',
        attributes: {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          genre: 'Fiction',
          isbn: '978-0-7432-7356-5',
          total_copies: 5,
          available_copies: 3
        }
      }
    })
  }),

  http.get(`${API_URL}/api/v1/borrowings`, () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          type: 'borrowings',
          attributes: {
            book_id: '1',
            user_id: '1',
            book_title: 'The Great Gatsby',
            borrowed_at: '2024-01-01T00:00:00Z',
            due_date: '2024-01-15T00:00:00Z',
            returned_at: null,
            status: 'active',
            days_overdue: 0
          }
        }
      ],
      meta: { current_page: 1, total_pages: 1, total_count: 1, per_page: 25 }
    })
  }),

  http.get(`${API_URL}/api/dashboard`, () => {
    return HttpResponse.json({
      data: {
        type: 'dashboard',
        attributes: {
          total_books: 100,
          total_borrowings: 50,
          active_borrowings: 10,
          overdue_borrowings: 2
        }
      }
    })
  }),
]
