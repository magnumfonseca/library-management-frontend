import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { server } from '@/test/mocks/server'
import { getInvitations, createInvitation, deleteInvitation, getInvitationByToken, acceptInvitation } from './invitations'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Invitation API', () => {
  describe('getInvitations', () => {
    it('should fetch invitations list', async () => {
      const result = await getInvitations()
      
      expect(result.data).toHaveLength(2)
      expect(result.data[0].email).toBe('librarian@example.com')
      expect(result.data[0].status).toBe('pending')
      expect(result.meta.current_page).toBe(1)
      expect(result.meta.total_count).toBe(2)
    })

    it('should fetch invitations with pagination', async () => {
      const result = await getInvitations({ page: 1, per_page: 10 })
      
      expect(result.data).toHaveLength(2)
      expect(result.meta.per_page).toBe(25)
    })
  })

  describe('createInvitation', () => {
    it('should create a new invitation', async () => {
      const email = 'newlibrarian@example.com'
      const result = await createInvitation(email)
      
      expect(result.email).toBe(email)
      expect(result.role).toBe('librarian')
      expect(result.status).toBe('pending')
    })
  })

  describe('deleteInvitation', () => {
    it('should delete an invitation', async () => {
      await expect(deleteInvitation('1')).resolves.toBeUndefined()
    })
  })

  describe('getInvitationByToken', () => {
    it('should fetch invitation by valid token', async () => {
      const result = await getInvitationByToken('valid-token')
      
      expect(result.email).toBe('librarian@example.com')
      expect(result.status).toBe('pending')
    })

    it('should throw error for invalid token', async () => {
      await expect(getInvitationByToken('invalid-token')).rejects.toThrow()
    })
  })

  describe('acceptInvitation', () => {
    it('should accept invitation with valid token', async () => {
      const userData = {
        name: 'New Librarian',
        password: 'password123',
        password_confirmation: 'password123'
      }
      
      await expect(acceptInvitation('valid-token', userData)).resolves.toBeUndefined()
    })

    it('should throw error for invalid token', async () => {
      const userData = {
        name: 'New Librarian',
        password: 'password123',
        password_confirmation: 'password123'
      }
      
      await expect(acceptInvitation('invalid-token', userData)).rejects.toThrow()
    })
  })
})
