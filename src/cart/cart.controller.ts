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
import {Cart} from "./cart.decorator";

@Controller('/api/v1/cart')
export class CartController {

    constructor(private cartService: CartService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    @Get()
    async getCart(@Cart() cart, @User() user) : Promise<any> {
      return await this.cartService.getFormattedCart(cart,user)
    }

    @Post('addProduct')
    async addProductToCart(@Cart() cart, @User() user, @Body() product: ProductDto) {
        await this.cartService.addProductToCart(cart,user, product)
    }

    @Post('removeProduct')
    async removeProductFromCart(@Cart() cart, @User() user, @Body() product: ProductDto) {
        await this.cartService.removeProductFromCart(cart,user, product)
    }

    @Post('changeProductAmount')
    async changeProductAmount(@Cart() cart, @User() user, @Body() product: ProductDto){
        await this.cartService.changeProductAmount(cart,user, product)
    }

    @Post('addDiscountCode')
    async addDiscountCode(@Cart() cart, @User() user, @Body() discount: DiscountDto) {
        await this.cartService.addDiscountCode(cart,user, discount)
    }


    @Post('changeDeliveryType')
    async changeDeliveryType(@Cart() cart, @User() user, @Body() delivery: DeliveryDto) {
        await this.cartService.changeDeliveryType(cart,user, delivery)
    }

    @Get('generateShareLink')
    generateShareLink(@User() user): string {
        return this.cartService.generateShareLink(user)
    }


    @Get('share')
    async share(@Cart() cart, @User() user, @Query() query) {
        await this.cartService.share(cart,user, query)
    }

}
