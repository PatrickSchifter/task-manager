import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor'
import { UpdateUsersDTO, UserFullDTO, UserListItemDTO, UsersDTO } from './users.dto'
import { UsersService } from './users.service'

@UseInterceptors(ValidateResourcesIdsInterceptor)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ type: [UserListItemDTO] })
  findAll() {
    return this.usersService.findAll()
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: UserListItemDTO })
  create(@Body() data: UsersDTO) {
    return this.usersService.create(data)
  }

  @Get(':userId')
  @ApiResponse({ type: UserFullDTO })
  @ValidateResourcesIds()
  async findById(@Param('userId', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id)
    return user
  }

  @Put(':userId')
  @ApiResponse({ type: UserListItemDTO })
  @ValidateResourcesIds()
  async update(@Param('userId', ParseUUIDPipe) id: string, @Body() data: UpdateUsersDTO) {
    return this.usersService.update({ data, id })
  }

  @Delete(':userId')
  @ValidateResourcesIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('userId', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id)
  }
}
