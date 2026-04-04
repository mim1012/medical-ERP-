import { Test, TestingModule } from '@nestjs/testing'
import { InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { PrismaService } from '../../prisma/prisma.service'

const mockAdminCreateUser = jest.fn()
const mockAdminUpdateUserById = jest.fn()
const mockAdminDeleteUser = jest.fn()

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      admin: {
        createUser: mockAdminCreateUser,
        updateUserById: mockAdminUpdateUserById,
        deleteUser: mockAdminDeleteUser,
      },
    },
  })),
}))

describe('AuthService', () => {
  let service: AuthService
  let prisma: jest.Mocked<PrismaService>

  const mockOrg = { id: 'org1', name: 'Test Org' }
  const mockUser = { id: 'u1', email: 'admin@test.com', name: 'Admin', organizationId: 'org1' }
  const mockSupabaseUser = { id: 'supabase-uid-1', email: 'admin@test.com' }

  const mockSignupDto = {
    email: 'admin@test.com',
    password: 'password123',
    name: 'Admin',
    orgName: 'Test Org',
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const mockPrisma = {
      $transaction: jest.fn(),
      organization: { create: jest.fn() },
      user: { create: jest.fn() },
    }

    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'SUPABASE_URL') return 'https://test.supabase.co'
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'service-role-key'
        return undefined
      }),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    prisma = module.get(PrismaService)

    // Trigger onModuleInit to initialize the supabase client
    service.onModuleInit()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('signup', () => {
    it('creates organization, creates auth user, creates DB user and returns ids', async () => {
      mockAdminCreateUser.mockResolvedValue({
        data: { user: mockSupabaseUser },
        error: null,
      })
      ;(prisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
        return fn({
          organization: { create: jest.fn().mockResolvedValue(mockOrg) },
          user: { create: jest.fn().mockResolvedValue(mockUser) },
        })
      })
      mockAdminUpdateUserById.mockResolvedValue({ error: null })

      const result = await service.signup(mockSignupDto)

      expect(mockAdminCreateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockSignupDto.email,
          password: mockSignupDto.password,
          email_confirm: true,
        }),
      )
      expect(prisma.$transaction).toHaveBeenCalled()
      expect(mockAdminUpdateUserById).toHaveBeenCalledWith(
        mockSupabaseUser.id,
        expect.objectContaining({ user_metadata: { organizationId: mockOrg.id } }),
      )
      expect(result).toEqual({ userId: mockSupabaseUser.id, organizationId: mockOrg.id })
    })

    it('throws InternalServerErrorException on duplicate email (Supabase error)', async () => {
      mockAdminCreateUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'User already registered' },
      })

      await expect(service.signup(mockSignupDto)).rejects.toThrow(InternalServerErrorException)
      expect(prisma.$transaction).not.toHaveBeenCalled()
    })

    it('throws InternalServerErrorException when Supabase returns no user', async () => {
      mockAdminCreateUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await expect(service.signup(mockSignupDto)).rejects.toThrow(InternalServerErrorException)
    })

    it('deletes auth user and throws when updateUserById fails', async () => {
      mockAdminCreateUser.mockResolvedValue({
        data: { user: mockSupabaseUser },
        error: null,
      })
      ;(prisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
        return fn({
          organization: { create: jest.fn().mockResolvedValue(mockOrg) },
          user: { create: jest.fn().mockResolvedValue(mockUser) },
        })
      })
      mockAdminUpdateUserById.mockResolvedValue({ error: { message: 'Update failed' } })
      mockAdminDeleteUser.mockResolvedValue({})

      await expect(service.signup(mockSignupDto)).rejects.toThrow(InternalServerErrorException)
      expect(mockAdminDeleteUser).toHaveBeenCalledWith(mockSupabaseUser.id)
    })
  })
})
