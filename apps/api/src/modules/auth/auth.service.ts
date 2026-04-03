import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient } from '@supabase/supabase-js'
import { PrismaService } from '../../prisma/prisma.service'
import { SignupDto } from './dto/signup.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      throw new InternalServerErrorException('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      throw new InternalServerErrorException(authError?.message ?? 'Failed to create auth user')
    }

    const supabaseUserId = authData.user.id

    const org = await this.prisma.organization.create({
      data: { name: dto.orgName },
    })

    await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        role: 'ADMIN',
        supabaseUserId,
        organizationId: org.id,
      },
    })

    const { error: updateError } = await supabase.auth.admin.updateUserById(supabaseUserId, {
      user_metadata: { organizationId: org.id },
    })

    if (updateError) {
      throw new InternalServerErrorException(updateError.message)
    }

    return { userId: supabaseUserId, organizationId: org.id }
  }
}
