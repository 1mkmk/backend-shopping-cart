import {Body, CACHE_MANAGER, Get, Inject, Injectable, InternalServerErrorException, Post, Query} from '@nestjs/common';
import {User} from "../user/user.decorator";
import {plainToInstance} from "class-transformer";
import {CartEntity} from "./cart.entity";
import {DisplayCartDto} from "./displayCart.dto";
import {CartProductEntity} from "./cartProduct/cartProduct.entity";
import {ProductDto} from "./product.dto";
import {DiscountDto} from "../discount/discount.dto";
import {DeliveryDto} from "../delivery/delivery.dto";
import {Cache} from "cache-manager";
import {DeliveryService} from "../delivery/delivery.service";
import {DiscountService} from "../discount/discount.service";
import {ProductService} from "../product/product.service";
import {Cart} from "./cart.decorator";

@Injectable()
export class CartService {

    constructor(private productService: ProductService, private discountService:  DiscountService, private deliveryService: DeliveryService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    async getFormattedCart(@Cart() cart, @User() user) : Promise<DisplayCartDto> {
        let products = this.productService.findAll()
        let discounts = this.discountService.findAll()
        let deliveries = this.deliveryService.findAll()
        let cartEntity = cart
        let displayCartDto = new DisplayCartDto()
        let productsArray: CartProductEntity[] = []
        displayCartDto.finalPrice = 0
        cartEntity.products.forEach(cp => {
            let index = products.map(p => p.id).indexOf(cp.productId);
            if (index !== -1) {
                displayCartDto.finalPrice += products[index].price * cp.amount
                let cartProductEntity = plainToInstance(CartProductEntity, products[index])
                cartProductEntity.amount = cp.amount
                productsArray.push(cartProductEntity)
            }
        })
        displayCartDto.productsPrice = displayCartDto.finalPrice
        displayCartDto.products = productsArray
        displayCartDto.discount = discounts.find(d => d.id === cartEntity.discountId)
        displayCartDto.delivery = deliveries.find(d => d.id === cartEntity.deliveryId)
        displayCartDto.finalPrice += displayCartDto.delivery.price;

        if (displayCartDto.discount) {
            if (displayCartDto.discount.type === "PERCENT") {
                displayCartDto.finalPrice = displayCartDto.finalPrice * (1 - displayCartDto.discount.value)
            } else if (displayCartDto.discount.type === "VALUE") {
                displayCartDto.finalPrice = displayCartDto.finalPrice - displayCartDto.discount.value
            }
        }
        displayCartDto.finalPrice = Math.round(displayCartDto.finalPrice * 100) / 100
        return displayCartDto;
    }


    async addProductToCart(@Cart() cart, @User() user,  @Body() product: ProductDto) {
        let products = this.productService.findAll()
        let cartEntity = cart
        let productEntity = products.find(p=>p.id===product.productId)
        let cartProductEntity = new CartProductEntity()
        if (productEntity && !cartEntity.products.map(cp => cp.productId).includes(productEntity.id)) {
            cartProductEntity.productId = productEntity.id
            if (!product.amount)
            {
                product.amount = 1
            }
            cartProductEntity.amount = product.amount
            cartEntity.products.push(cartProductEntity)
            await this.cacheManager.set("cart:" + user.cartUuid, cartEntity)
        }
        else {
            throw new InternalServerErrorException()
        }
    }

    async removeProductFromCart(@Cart() cart, @User() user,  @Body() product: ProductDto) {
        let products = this.productService.findAll()
        let cartEntity = cart
        let productEntity = products.find(p=>p.id===product.productId)
        if (productEntity && cartEntity.products.map(cp => cp.productId).includes(productEntity.id)) {
            let index = cartEntity.products.map(cp=> cp.productId).indexOf(productEntity.id);
            if (index !== -1) {
                cartEntity.products.splice(index, 1);
            }
            await this.cacheManager.set("cart:" + user.cartUuid, cartEntity)
        }
        else {
            throw new InternalServerErrorException()
        }
    }

    @Post('changeProductAmount')
    async changeProductAmount(@Cart() cart, @User() user,  @Body() product: ProductDto) {
        if (product.amount <= 0)
        {
            throw new InternalServerErrorException()
        }
        let products = this.productService.findAll()
        let cartEntity = cart
        let productEntity = products.find(p=>p.id===product.productId)
        if (productEntity && cartEntity.products.map(cp => cp.productId).includes(productEntity.id)) {
            let index = cartEntity.products.map(cp=> cp.productId).indexOf(productEntity.id);
            cartEntity.products.at(index).amount = product.amount
            await this.cacheManager.set("cart:" + user.cartUuid, cartEntity)
        }
        else {
            throw new InternalServerErrorException()
        }
    }

    @Post('addDiscountCode')
    async addDiscountCode(@Cart() cart, @User() user,  @Body() discount: DiscountDto) {
        let cartEntity = cart
        let discounts = this.discountService.findAll()
        let discountEntity = discounts.find(d=>d.name===discount.discountCode)
        if (discountEntity) {
            cartEntity.discountId = discountEntity.id
            await this.cacheManager.set("cart:" + user.cartUuid, cartEntity)
        }
        else {
            throw new InternalServerErrorException()
        }
    }


    @Post('changeDeliveryType')
    async changeDeliveryType(@Cart() cart, @User() user,  @Body() delivery: DeliveryDto) {
        let deliveries = this.deliveryService.findAll()
        let cartEntity = cart
        let deliveryEntity = deliveries.find(d=>d.id===delivery.deliveryId)
        if (deliveryEntity) {
            cartEntity.deliveryId = deliveryEntity.id
            await this.cacheManager.set("cart:" + user.cartUuid, cartEntity)
        }
        else {
            throw new InternalServerErrorException()
        }
    }

    @Get('generateShareLink')
    generateShareLink(@User() user) : string {
        return "http://localhost:3000/api/v1/cart/share?uuid="+user.cartUuid
    }

    @Get('share')
    async share(@Cart() cart, @User() user,  @Query() query) {
        let sharedCartUuid = query.uuid
        let sharedCartEntity = plainToInstance(CartEntity, await this.cacheManager.get("cart:" + sharedCartUuid))
        if (sharedCartEntity) {
            let userCartEntity = cart
            userCartEntity.products = userCartEntity.products.concat(sharedCartEntity.products)
            userCartEntity.products = userCartEntity.products.reduce((acc, curr) => {
                const objInAcc = acc.find((o) => o.productId === curr.productId);
                if (objInAcc) objInAcc.amount += curr.amount;
                else acc.push(curr);
                return acc;
            }, []);

            await this.cacheManager.set("cart:" + user.cartUuid, userCartEntity)
        }
    }
}
