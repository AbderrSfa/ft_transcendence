import { Header, HttpException, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/user/user.service";


@Injectable()
export class validateUserMiddleware implements NestMiddleware {
	constructor(private readonly userService: UserService) {}
	async use(req: Request, res: Response, next: NextFunction) {
		if (!req.headers.authorization) throw new HttpException("unauthorized", 401);
		const user = await this.userService.FindUser(req.headers.authorization)
		console.log(user);
		if (!user) {
			throw new UnauthorizedException();
		}
		next();
	}
}
