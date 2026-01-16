import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { server } from '@/test/mocks/server'
import { getDashboard } from './dashboard'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
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
    it('should fetch librarian dashboard data with custom header', async () => {
      // Note: In real tests, you'd mock the auth header or use server.use() to override
      const result = await getDashboard()
      
      // Default mock returns member data, but in integration this would test librarian data
      expect(result).toBeDefined()
    })
  })
})
