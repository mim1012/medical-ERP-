import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { createClient } from '@supabase/supabase-js'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    const authHeader: string | undefined = request.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header')
    }

    const token = authHeader.slice(7)
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new UnauthorizedException('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token')
    }

    const user = data.user
    request.user = {
      id: user.id,
      email: user.email,
      organizationId: user.user_metadata?.organizationId as string | undefined,
    }

    return true
  }
}
