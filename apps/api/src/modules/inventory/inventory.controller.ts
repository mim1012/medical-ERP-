import { Controller, Get, Patch, Param, Body } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { InventoryService } from './inventory.service'
import { UpdateInventoryDto } from './dto/update-inventory.dto'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

interface AuthUser {
  id: string
  email: string
  organizationId: string
}

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.inventoryService.findAll(user.organizationId)
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.inventoryService.findOne(id, user.organizationId)
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(id, user.organizationId, dto)
  }
}
