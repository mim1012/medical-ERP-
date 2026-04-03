import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { SignupDto } from './dto/signup.dto'

@Injectable()
export class AuthService implements OnModuleInit {
  private supabase!: SupabaseClient

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      throw new InternalServerErrorException('Supabase configuration missing')
    }

    this.supabase = createClient(supabaseUrl, serviceRoleKey)
  }

  async signup(dto: SignupDto) {
    const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      throw new InternalServerErrorException(authError?.message ?? 'Failed to create auth user')
    }

    const supabaseUserId = authData.user.id

    const { org, user } = await this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: dto.orgName },
      })

      const user = await tx.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          role: UserRole.ADMIN,
          supabaseUserId,
          organizationId: org.id,
        },
      })

      return { org, user }
    })

    const { error: updateError } = await this.supabase.auth.admin.updateUserById(supabaseUserId, {
      user_metadata: { organizationId: org.id },
    })

    if (updateError) {
      await this.supabase.auth.admin.deleteUser(supabaseUserId)
      throw new InternalServerErrorException(updateError.message)
    }

    return { userId: supabaseUserId, organizationId: org.id }
  }
}
