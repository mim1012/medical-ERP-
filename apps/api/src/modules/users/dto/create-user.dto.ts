import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supabaseUserId?: string
}
