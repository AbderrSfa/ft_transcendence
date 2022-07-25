import { Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../app/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { jwtInfo } from './dto/jwt.dto';
import { CreateJwt, SetupUser } from 'src/auth/dto/User.dto';
import { UpdateUserInfo } from './dto/User.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  signToken(user: CreateJwt): Promise<string> {
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(user, {
      expiresIn: '1d',
      secret: secret,
    });
  }

  async validateUser(
    data: Prisma.UserUncheckedCreateInput,
  ): Promise<SetupUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        intra_id: data.intra_id,
      },
      select: {
        intra_id: true,
        login: true,
        user_name: true,
        email: true,
      },
    });

    if (user)
      return {
        ...user,
        token: await this.signToken(user),
      };

    const NewUser = await this.create(data);
    return {
      intra_id: NewUser.intra_id,
      login: NewUser.login,
      user_name: NewUser.user_name,
      token: await this.signToken({
        intra_id: NewUser.intra_id,
        login: NewUser.login,
        email: NewUser.email,
      }),
    };
  }

  decode(auth: string): number {
    const jwt = auth.replace('Bearer ', '');
    const decode = this.jwt.decode(jwt, { json: true }) as { intra_id: number};
    return (decode.intra_id);
  }

  async FindUser(
    auth: string,
  ): Promise<Prisma.UserUncheckedCreateInput | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        intra_id: this.decode(auth),
      },
      select: {
        first_name: true,
        last_name: true,
        user_name: true,
        email: true,
        login: true,
        image_url: true,
      },
    });
    return user;
  }

  async create(
    data: Prisma.UserUncheckedCreateInput,
  ): Promise<Prisma.UserUncheckedCreateInput> {
    const user = await this.prisma.user.create({
      data,
    });
    return user;
  }

  async findUserName(user_name: string) {
    return this.prisma.user.findUnique({
      where: {
        user_name,
      },
    });
  }

  async accountSetup(data: UpdateUserInfo, auth: string) {
    console.log(data);

    const Userexsist = await this.prisma.user.findUnique({
      where: {
        intra_id: this.decode(auth),
      }
    });

    if (!Userexsist) return ('user Does not exist');

    const User = await this.findUserName(data.user_name as string);

    if (User) return 'User Name is Taken';

    return this.prisma.user.update({
      where: {
        intra_id: this.decode(auth),
      },
      data: {
        ProfileDone: true,
        ...data,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        first_name: true,
        last_name: true,
        user_name: true,
        email: true,
        login: true,
        image_url: true,
      },
    });
  }

  update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where,
      data,
    });
  }

  remove(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    });
  }
}
