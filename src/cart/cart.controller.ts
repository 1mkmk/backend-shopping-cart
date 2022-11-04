import {Cache} from 'cache-manager'
import {Body, CACHE_MANAGER, Controller, Get, Inject, Param, Post, Query} from '@nestjs/common';
import {ProductDto} from "./product.dto";
import {User} from "../user/user.decorator";
import {plainToInstance} from "class-transformer";
import {CartEntity} from "./cart.entity";
import {products} from "../product/products";
import {CartProductEntity} from "./cartProduct/cartProduct.entity";
import {DeliveryDto} from "../delivery/delivery.dto";
import {deliveries} from "../delivery/deliveries";
import {discounts} from "../discount/discounts";
import {DiscountDto} from "../discount/discount.dto";
import {DisplayCartDto} from "./displayCart.dto";
import {ProductEntity} from "../product/product.entity";
import {CartService} from "./cart.service";

@Controller('/api/v1/cart')
export class CartController {

    constructor(private cartService: CartService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    @Get()
    async getCart(@User() user) : Promise<any> {
      return await this.cartService.getFormattedCart(user)
    }

    @Post('addProduct')
    async addProductToCart(@User() user, @Body() product: ProductDto) {
        await this.cartService.addProductToCart(user, product)
    }

    @Post('removeProduct')
    async removeProductFromCart(@User() user, @Body() product: ProductDto) {
        await this.cartService.removeProductFromCart(user, product)
    }

    @Post('changeProductAmount')
    async changeProductAmount(@User() user, @Body() product: ProductDto){
        await this.cartService.changeProductAmount(user, product)
    }

    @Post('addDiscountCode')
    async addDiscountCode(@User() user, @Body() discount: DiscountDto) {
        await this.cartService.addDiscountCode(user, discount)
    }


    @Post('changeDeliveryType')
    async changeDeliveryType(@User() user, @Body() delivery: DeliveryDto) {
        await this.cartService.changeDeliveryType(user, delivery)
    }

    @Get('generateShareLink')
    generateShareLink(@User() user): string {
        return this.cartService.generateShareLink(user)
    }


    @Get('share')
    async share(@User() user, @Query() query) {
        await this.cartService.share(user, query)
    }

}
