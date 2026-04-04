import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SupabaseAuthGuard } from './supabase-auth.guard'

const mockGetUser = jest.fn()

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}))

describe('SupabaseAuthGuard', () => {
  let guard: SupabaseAuthGuard
  let reflector: jest.Mocked<Reflector>

  const makeContext = (headers: Record<string, string | undefined>): ExecutionContext => {
    const request = { headers, user: undefined as unknown }
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const mockReflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    }

    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'SUPABASE_URL') return 'https://test.supabase.co'
        if (key === 'SUPABASE_ANON_KEY') return 'anon-key'
        return undefined
      }),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseAuthGuard,
        { provide: Reflector, useValue: mockReflector },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile()

    guard = module.get<SupabaseAuthGuard>(SupabaseAuthGuard)
    reflector = module.get(Reflector)
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })

  describe('canActivate', () => {
    it('returns true and sets request.user for valid Bearer token', async () => {
      const supabaseUser = {
        id: 'uid1',
        email: 'user@test.com',
        user_metadata: { organizationId: 'org1' },
      }
      mockGetUser.mockResolvedValue({ data: { user: supabaseUser }, error: null })

      const ctx = makeContext({ authorization: 'Bearer valid-token' })
      const result = await guard.canActivate(ctx)

      expect(result).toBe(true)
      expect(mockGetUser).toHaveBeenCalledWith('valid-token')

      const request = ctx.switchToHttp().getRequest()
      expect(request.user).toEqual({
        id: 'uid1',
        email: 'user@test.com',
        organizationId: 'org1',
      })
    })

    it('throws UnauthorizedException when Authorization header is missing', async () => {
      const ctx = makeContext({})
      await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException)
      expect(mockGetUser).not.toHaveBeenCalled()
    })

    it('throws UnauthorizedException when header does not start with Bearer', async () => {
      const ctx = makeContext({ authorization: 'Basic sometoken' })
      await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException)
      expect(mockGetUser).not.toHaveBeenCalled()
    })

    it('throws UnauthorizedException when getUser returns an error', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid token' } })

      const ctx = makeContext({ authorization: 'Bearer bad-token' })
      await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException when getUser returns no user', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

      const ctx = makeContext({ authorization: 'Bearer expired-token' })
      await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException)
    })

    it('returns true immediately for public routes without calling getUser', async () => {
      ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue(true)

      const ctx = makeContext({})
      const result = await guard.canActivate(ctx)

      expect(result).toBe(true)
      expect(mockGetUser).not.toHaveBeenCalled()
    })
  })
})
