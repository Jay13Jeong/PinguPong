import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,) {}

    @Get()
    findAll(): Promise<User[]>{
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id')id: number): Promise<User>{
        return this.usersService.findOne(id);
    }

    @Post()
    create(@Body()user: User){
        return this.usersService.create(user);
    }

    @Delete(':id')
    remove(@Param('id')id: number){
        return this.usersService.delete(id);
    }
}
