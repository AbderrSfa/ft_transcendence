import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { jwtInfo } from './dto/jwt.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: Prisma.UserUncheckedCreateInput) {
    return this.userService.create(data);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findUser(@Req() req: Request, @Res() res: Response, @Headers('Authorization') auth: string) {
    console.log("something");
    const user = await this.userService.FindUser(auth);
    // res.write(user);
    res.send(user);
    return ;
    if (user.ProfileDone)
      res.send(user);
    else
      res.redirect('http://localhost/setup');

  }

  @Post('/setup')
  @UseGuards(AuthGuard('jwt'))
  accountSetup(@Body() data: Prisma.UserUncheckedUpdateInput) {
    return this.userService.accountSetup(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.userService.update({id: +id}, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove({id: +id});
  }
}
