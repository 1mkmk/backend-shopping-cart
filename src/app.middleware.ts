import {CACHE_MANAGER, Inject, Injectable, NestMiddleware, Req, Res, Session} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {Cache} from "cache-manager";
import {randomUUID} from "crypto";
import {JwtService} from "@nestjs/jwt";
import {UserEntity} from "./user/user.entity";
import { plainToInstance } from 'class-transformer';
import {CartEntity} from "./cart/cart.entity";


@Injectable()
export class AppMiddleware implements NestMiddleware {

    constructor(private readonly jwtService: JwtService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    async use(req: Request, @Res({passthrough: true}) res: Response, next: NextFunction) {
        let u
        let token = req.cookies["token"]
        if (!token || token === null || token === "") {
            let userEntity = new UserEntity()
            userEntity.uuid = randomUUID()
            userEntity.createdOn = Date.now()
            token = this.jwtService.sign(userEntity.uuid)
            res.cookie("token", token)

            let cartEntity = new CartEntity()
            cartEntity.uuid = randomUUID()
            cartEntity.ownerUuid = userEntity.uuid
            cartEntity.products = []
            cartEntity.deliveryId = 1
            userEntity.cartUuid = cartEntity.uuid
            await this.cacheManager.set("cart:" + cartEntity.uuid, cartEntity)
            await this.cacheManager.set("user:" + userEntity.uuid, userEntity)
            u = userEntity
        } else {
            let uuid =this.jwtService.decode(token)
            let user = await this.cacheManager.get("user:" + uuid)
            if (!user) {
                let userEntity = new UserEntity()
                userEntity.uuid = uuid.toString()
                userEntity.createdOn = Date.now()
                u = userEntity

                let cartEntity = new CartEntity()
                cartEntity.uuid = randomUUID()
                cartEntity.ownerUuid = u.uuid
                cartEntity.products = []
                cartEntity.deliveryId = 1
                userEntity.cartUuid = cartEntity.uuid
                await this.cacheManager.set("cart:" + cartEntity.uuid, cartEntity)
                await this.cacheManager.set("user:" + userEntity.uuid, userEntity)
            } else{
                u = plainToInstance(UserEntity, user)
            }
        }

        req.user = u
        next();
    }


}