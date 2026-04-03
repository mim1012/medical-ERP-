import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { QueryUserDto } from './dto/query-user.dto'

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private getOrgId(headers: Record<string, string>): string {
    return headers['x-organization-id'] ?? 'default'
  }

  private getRequestingUserId(headers: Record<string, string>): string {
    return headers['x-user-id'] ?? ''
  }

  @Get()
  @ApiOperation({ summary: '사용자 목록 조회' })
  findAll(@Headers() headers: Record<string, string>, @Query() query: QueryUserDto) {
    return this.usersService.findAll(this.getOrgId(headers), query)
  }

  @Get(':id')
  @ApiOperation({ summary: '사용자 상세 조회' })
  findOne(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.usersService.findOne(this.getOrgId(headers), id)
  }

  @Post()
  @ApiOperation({ summary: '사용자 생성' })
  create(@Headers() headers: Record<string, string>, @Body() dto: CreateUserDto) {
    return this.usersService.create(this.getOrgId(headers), dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: '사용자 수정 (name, role)' })
  update(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(this.getOrgId(headers), id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제 (자기 자신 삭제 금지)' })
  remove(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.usersService.remove(
      this.getOrgId(headers),
      id,
      this.getRequestingUserId(headers),
    )
  }
}
