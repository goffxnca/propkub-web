import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  NotFoundException,
  Query,
  Body,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { MongoIdValidationPipe } from '../../common/pipes/mongo-id.pipe';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from '../../users/users.schema';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  async findAll(@Query() pagination: PaginationDto): Promise<User[]> {
    return this.adminUsersService.findAll(pagination.limit, pagination.offset);
  }

  @Get(':id')
  async findOne(@Param('id', MongoIdValidationPipe) id: string): Promise<User> {
    const user = await this.adminUsersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({
    status: 409,
    description: 'User with the same email already exists'
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation data',
    examples: {
      user: {
        value: {
          name: 'John Doe',
          email: 'john.doe@example.com'
        }
      }
    }
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.adminUsersService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User update data',
    examples: {
      user: {
        value: {
          name: 'John Doe Updated'
        }
      }
    }
  })
  async update(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    const user = await this.adminUsersService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', MongoIdValidationPipe) id: string): Promise<User> {
    const user = await this.adminUsersService.remove(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
