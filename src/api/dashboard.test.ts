import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { server } from '@/test/mocks/server'
import { getDashboard } from './dashboard'
import { TOKEN_KEY } from './client'

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

describe('Dashboard API', () => {
  describe('getDashboard - Member', () => {
    it('should fetch member dashboard data', async () => {
      const result = await getDashboard()
      
      expect(result).toHaveProperty('borrowed_books')
      expect(result).toHaveProperty('overdue_books')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('pagination')
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result as any
      expect(data.borrowed_books).toHaveLength(1)
      expect(data.borrowed_books[0].book.title).toBe('The Great Gatsby')
      expect(data.summary.total_borrowed).toBe(1)
      expect(data.summary.total_overdue).toBe(0)
    })

    it('should fetch member dashboard with pagination', async () => {
      const result = await getDashboard({ page: 1, per_page: 20 })
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result as any
      expect(data.pagination.current_page).toBe(1)
      expect(data.pagination.per_page).toBe(20)
    })
  })

  describe('getDashboard - Librarian', () => {
    it('should fetch librarian dashboard data', async () => {
      // Set librarian token in localStorage to simulate librarian auth
      localStorage.setItem(TOKEN_KEY, 'mock-jwt-token-librarian')
      
      const result = await getDashboard()
      
      expect(result).toHaveProperty('total_books')
      expect(result).toHaveProperty('total_borrowed_books')
      expect(result).toHaveProperty('books_due_today')
      expect(result).toHaveProperty('members_with_overdue')
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result as any
      expect(data.total_books).toBe(100)
      expect(data.total_borrowed_books).toBe(25)
      expect(data.books_due_today).toBe(5)
      expect(Array.isArray(data.members_with_overdue)).toBe(true)
      expect(data.members_with_overdue).toHaveLength(2)
    })
  })
})
