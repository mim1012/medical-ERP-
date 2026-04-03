import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { QueryUserDto } from './dto/query-user.dto'

// Models will be added via migration
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, query: QueryUserDto) {
    const { role } = query
    return this.prisma.user.findMany({
      where: {
        organizationId,
        ...(role && { role }),
      },
      orderBy: { name: 'asc' },
    })
  }

  async findOne(organizationId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
    })
    if (!user) throw new NotFoundException(`User ${id} not found`)
    return user
  }

  async create(organizationId: string, dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...dto,
        organizationId,
      },
    })
  }

  async update(organizationId: string, id: string, dto: UpdateUserDto) {
    await this.findOne(organizationId, id)
    return this.prisma.user.update({
      where: { id },
      data: dto,
    })
  }

  async remove(organizationId: string, id: string, requestingUserId: string) {
    if (id === requestingUserId) {
      throw new BadRequestException('Cannot delete your own account')
    }
    await this.findOne(organizationId, id)
    return this.prisma.user.delete({ where: { id } })
  }
}
