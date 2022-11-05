import {CACHE_MANAGER, Inject, Injectable, NestMiddleware, Res} from '@nestjs/common';
import {NextFunction, Response} from 'express';
import {Cache} from "cache-manager";
import {randomUUID} from "crypto";
import {JwtService} from "@nestjs/jwt";
import {UserEntity} from "./user/user.entity";
import {plainToInstance} from 'class-transformer';
import {CartEntity} from "./cart/cart.entity";
import {UserService} from "./user/user.service";
import {CartService} from "./cart/cart.service";
import cookieParser from "cookie-parser";


@Injectable()
export class AppMiddleware implements NestMiddleware {

    constructor(private userService: UserService,private cartService: CartService, private readonly jwtService: JwtService) {
    }

    async use(req: any, @Res({passthrough: true}) res: Response, next: NextFunction) {
        let u
        let c
        let token = req.cookies["token"]
        if (!token || token === null || token === "") {
            let userAndCartEntity = await this.userService.createUserAndCart()
            token = this.jwtService.sign(userAndCartEntity[0].uuid)
            let options = {
                maxAge: 1000 * 60 * 60,
                httpOnly: true
            }
            res.cookie("token", token,options)
            u = userAndCartEntity[0]
            c = userAndCartEntity[1]
        } else {
            let uuid = this.jwtService.decode(token)
            let user = await this.userService.getUserByUuid(uuid.toString())
            if (!user) {
                let userAndCartEntity = await this.userService.createUserAndCart(uuid.toString())
                u = userAndCartEntity[0]
                c = userAndCartEntity[1]
            } else {
                u = plainToInstance(UserEntity, user)
                c = await this.cartService.getCartByUuid(u.cartUuid)
                c = plainToInstance(CartEntity, c)
            }
        }
        req.cart = c
        req.user = u
        next();
    }


}