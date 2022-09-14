import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FriendStatus } from '@prisma/client';
import { PrismaService } from 'src/app/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  CreateFriendRequestDto,
  FriendRequest,
  GetFriendRequestDto,
  UpdateFriendRequest,
  UserInfo,
} from './dto/friend.dto';

@Injectable()
export class FriendsService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  async create(auth: string, createFriendRequestDto: CreateFriendRequestDto) {
    const intra_id = this.userService.decode(auth).intra_id;
    const FriendRequest: FriendRequest = await this.prisma.friendsList.create({
      data: {
        from: intra_id,
        to: createFriendRequestDto.to,
      },
    });
    return FriendRequest;
  }

  async findAll(auth: string): Promise<GetFriendRequestDto[]> {
    const intra_id = this.userService.decode(auth).intra_id;
    const getRequestFromDB: FriendRequest[] =
      await this.prisma.friendsList.findMany({
        where: {
          to: intra_id,
          status: 'PENDING',
        },
        select: {
          id: true,
          from: true,
          to: true,
          status: true,
        },
      });
    console.log(`requests from user ${intra_id} in db`, getRequestFromDB);
    if (getRequestFromDB !== null) {
      const parseReq: GetFriendRequestDto[] = await Promise.all(
        getRequestFromDB.map(async (request) => {
          console.log('req', request);
          const req = await this.prisma.user.findUnique({
            where: {
              intra_id: request.from,
            },
            select: {
              user_name: true,
              image_url: true,
            },
          });
          return {
            id: request.id,
            to: req,
            status: request.status,
          };
        }),
      );
      return parseReq;
    }
    return null;
  }

  async listAllFriends(auth: string): Promise<GetFriendRequestDto[]> {
    const intra_id = this.userService.decode(auth).intra_id;
    const getAllFriendsFromDB: FriendRequest[] =
      await this.prisma.friendsList.findMany({
        where: {
          OR: [
            {
              to: intra_id,
              status: 'ACCEPTED',
            },
            {
              from: intra_id,
              status: 'ACCEPTED',
            },
          ],
        },
        select: {
          id: true,
          from: true,
          to: true,
          status: true,
        },
      });
    console.log(`requests from user ${intra_id} in db`, getAllFriendsFromDB);
    if (getAllFriendsFromDB !== null) {
      const parseReq: GetFriendRequestDto[] = await Promise.all(
        getAllFriendsFromDB.map(async (request) => {
          console.log('req', request);
          const req = await this.prisma.user.findUnique({
            where: {
              intra_id: request.from,
            },
            select: {
              user_name: true,
              image_url: true,
            },
          });
          return {
            id: request.id,
            to: req,
            status: request.status,
          };
        }),
      );
      return parseReq;
    }
    return null;
  }

  async getRequest(id: number): Promise<number> {
    const request = await this.prisma.friendsList.findUnique({
      where: {
        id: id,
      },
      select: {
        to: true,
      },
    });
    return request.to;
  }

  async update(
    id: number,
    auth: string,
  ) {
    const intra_id = this.userService.decode(auth).intra_id;
    const to = await this.getRequest(id);
    if (to === intra_id) {
      const update = this.prisma.friendsList.update({
        where: {
          id: id,
        },
        data: {
          status: FriendStatus.ACCEPTED,
        },
        select: {
          id: true,
          status: true,
        },
      });
      return update;
    }
    throw new UnauthorizedException();
  }

  async remove(id: number, auth: string) {
    const intra_id = this.userService.decode(auth).intra_id;
    const to = await this.getRequest(id);
    if (to === intra_id) {
      const removed = await this.prisma.friendsList.delete({
        where: {
          id: id,
        },
      });
      return removed;
    }
    throw new UnauthorizedException();
  }
}
