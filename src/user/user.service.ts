import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {CartEntity} from "../cart/cart.entity";
import {randomUUID} from "crypto";
import {UserEntity} from "./user.entity";
import {Cache} from "cache-manager";

@Injectable()
export class UserService {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    async getUserByUuid(userUuid: string){
        return await this.cacheManager.get("user:" + userUuid)
    }

    async createUserAndCart(userUuid?: string){
        let userEntity = new UserEntity()
        if (userUuid === undefined || userUuid === null) {
            userEntity.uuid = randomUUID()
        }
        else {
            userEntity.uuid = userUuid
        }
        userEntity.createdOn = Date.now()
        let cartEntity = new CartEntity()
        cartEntity.uuid = randomUUID()
        cartEntity.ownerUuid = userEntity.uuid
        cartEntity.products = []
        cartEntity.deliveryId = 1
        userEntity.cartUuid = cartEntity.uuid

        await this.cacheManager.set("cart:" + cartEntity.uuid, cartEntity)
        await this.cacheManager.set("user:" + userEntity.uuid, userEntity)

        return [userEntity, cartEntity]
    }

}