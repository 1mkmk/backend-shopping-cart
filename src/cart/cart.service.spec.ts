import {CartService} from "./cart.service";
import {ProductService} from "../product/product.service";
import {DiscountService} from "../discount/discount.service";
import {DeliveryService} from "../delivery/delivery.service";
import {CACHE_MANAGER, Inject} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {UserService} from "../user/user.service";
import {UserEntity} from "../user/user.entity";
import {randomUUID} from "crypto";
import {CartEntity} from "./cart.entity";
import {CartProductEntity} from "./cartProduct/cartProduct.entity";
import {DisplayCartDto} from "./displayCart.dto";
import {plainToInstance} from "class-transformer";

describe('CartService', () => {
    let cartService: CartService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DeliveryService, DiscountService, ProductService, CartService, UserService, {
                provide: CACHE_MANAGER,
                useValue: {},
            }],
        }).compile();
        cartService = module.get<CartService>(CartService);
    });
    describe('getFormattedCart not changed', () => {
        let user = new UserEntity()
        user.uuid = randomUUID()
        user.cartUuid = randomUUID()
        user.createdOn = Date.now()

        let cart = new CartEntity()
        cart.uuid = randomUUID()
        cart.products = []
        cart.deliveryId = 1
        cart.ownerUuid = user.uuid
        it('should return an formatted cart display', async () => {
            let c = await cartService.getFormattedCart(cart, user)
            await expect(c).toEqual({
                "finalPrice": 19.99,
                "productsPrice": 0,
                "products": [],
                "delivery": {"id": 1, "name": "KURIER", "displayName": "Kurier", "price": 19.99, "priceCurrency": "PLN"}
            });
        });
    });

    describe('getFormattedCart discountId=1', () => {
        let user = new UserEntity()
        user.uuid = randomUUID()
        user.cartUuid = randomUUID()
        user.createdOn = Date.now()

        let cart = new CartEntity()
        cart.uuid = randomUUID()
        cart.products = []
        cart.deliveryId = 1
        cart.ownerUuid = user.uuid
        cart.discountId = 1
        it('should return an formatted cart display', async () => {
            let c = await cartService.getFormattedCart(cart, user)
            await expect(c).toEqual({
                "finalPrice": 16.99,
                "productsPrice": 0,
                "products": [],
                "discount": {"id": 1, "name": "PROCENTOWY", "type": "PERCENT", "value": 0.15},
                "delivery": {"id": 1, "name": "KURIER", "displayName": "Kurier", "price": 19.99, "priceCurrency": "PLN"}
            });
        });
    });

    describe('getFormattedCart discountId=2', () => {
        let user = new UserEntity()
        user.uuid = randomUUID()
        user.cartUuid = randomUUID()
        user.createdOn = Date.now()

        let cart = new CartEntity()
        cart.uuid = randomUUID()
        cart.products = []
        cart.deliveryId = 1
        cart.ownerUuid = user.uuid
        cart.discountId = 2
        it('should return an formatted cart display', async () => {
            let c = await cartService.getFormattedCart(cart, user)
            await expect(c).toEqual({
                "finalPrice": 9.99,
                "productsPrice": 0,
                "products": [],
                "discount": {"id": 2, "name": "KWOTA", "type": "VALUE", "value": 10},
                "delivery": {"id": 1, "name": "KURIER", "displayName": "Kurier", "price": 19.99, "priceCurrency": "PLN"}
            });

        });
    });

    describe('getFormattedCart discountId=2', () => {
        let user = new UserEntity()
        user.uuid = randomUUID()
        user.cartUuid = randomUUID()
        user.createdOn = Date.now()

        let cart = new CartEntity()
        cart.uuid = randomUUID()
        cart.products = []
        cart.deliveryId = 1
        cart.ownerUuid = user.uuid
        cart.discountId = 2
        it('should return an formatted cart display', async () => {
            let c = await cartService.getFormattedCart(cart, user)
            await expect(c).toEqual({
                "finalPrice": 9.99,
                "productsPrice": 0,
                "products": [],
                "discount": {"id": 2, "name": "KWOTA", "type": "VALUE", "value": 10},
                "delivery": {"id": 1, "name": "KURIER", "displayName": "Kurier", "price": 19.99, "priceCurrency": "PLN"}
            });

        });
    });


    describe('getFormattedCart deliveryId=1', () => {
        let user = new UserEntity()
        user.uuid = randomUUID()
        user.cartUuid = randomUUID()
        user.createdOn = Date.now()

        let cart = new CartEntity()
        cart.uuid = randomUUID()
        cart.products = []
        cart.deliveryId = 1
        cart.ownerUuid = user.uuid
        it('should return an formatted cart display', async () => {
            let c = await cartService.getFormattedCart(cart, user)
            await expect(c).toEqual({
                "finalPrice": 19.99,
                "productsPrice": 0,
                "products": [],
                "delivery": {"id": 1, "name": "KURIER", "displayName": "Kurier", "price": 19.99, "priceCurrency": "PLN"}
            });

        });
    });


    describe('getFormattedCart deliveryId=2', () => {
        let user = new UserEntity()
        user.uuid = randomUUID()
        user.cartUuid = randomUUID()
        user.createdOn = Date.now()

        let cart = new CartEntity()
        cart.uuid = randomUUID()
        cart.products = []
        cart.deliveryId = 2
        cart.ownerUuid = user.uuid
        it('should return an formatted cart display', async () => {
            let c = await cartService.getFormattedCart(cart, user)
            await expect(c).toEqual({
                "finalPrice": 29.99,
                "productsPrice": 0,
                "products": [],
                "delivery": {
                    "displayName": "Kurier za pobraniem",
                    "id": 2,
                    "name": "KURIER_ZA_POBRANIEM",
                    "price": 29.99,
                    "priceCurrency": "PLN"
                }
            });
        });
    });


    describe('getFormattedCart deliveryId=3', () => {
        let user = new UserEntity()
        user.uuid = randomUUID()
        user.cartUuid = randomUUID()
        user.createdOn = Date.now()

        let cart = new CartEntity()
        cart.uuid = randomUUID()
        cart.products = []
        cart.deliveryId = 3
        cart.ownerUuid = user.uuid
        it('should return an formatted cart display', async () => {
            let c = await cartService.getFormattedCart(cart, user)
            await expect(c).toEqual({
                "finalPrice": 12.99,
                "productsPrice": 0,
                "products": [],
                "delivery": {
                    "id": 3,
                    "name": "PACZKOMAT",
                    "displayName": "Paczkomat",
                    "price": 12.99,
                    "priceCurrency": "PLN"
                }
            });
        });
    });

    describe('getFormattedCart discountId=1 deliveryId=1', () => {
        let user = new UserEntity()
        user.uuid = randomUUID()
        user.cartUuid = randomUUID()
        user.createdOn = Date.now()

        let cart = new CartEntity()
        cart.uuid = randomUUID()
        cart.products = []
        cart.deliveryId = 1
        cart.discountId = 1
        cart.ownerUuid = user.uuid
        it('should return an formatted cart display', async () => {
            let c = await cartService.getFormattedCart(cart, user)
            await expect(c).toEqual({
                "finalPrice": 16.99,
                "productsPrice": 0,
                "products": [],
                "discount": {"id": 1, "name": "PROCENTOWY", "type": "PERCENT", "value": 0.15},
                "delivery": {"id": 1, "name": "KURIER", "displayName": "Kurier", "price": 19.99, "priceCurrency": "PLN"}
            });
        });
    });


    describe('getFormattedCart discountId=2 deliveryId=2', () => {
        let user = new UserEntity()
        user.uuid = randomUUID()
        user.cartUuid = randomUUID()
        user.createdOn = Date.now()

        let cart = new CartEntity()
        cart.uuid = randomUUID()
        cart.products = []
        cart.deliveryId = 2
        cart.discountId = 2
        cart.ownerUuid = user.uuid
        it('should return an formatted cart display', async () => {
            let c = await cartService.getFormattedCart(cart, user)
            await expect(c).toEqual({
                "finalPrice": 19.99,
                "productsPrice": 0,
                "products": [],
                "discount": {"id": 2, "name": "KWOTA", "type": "VALUE", "value": 10},
                "delivery": {
                    "displayName": "Kurier za pobraniem",
                    "id": 2,
                    "name": "KURIER_ZA_POBRANIEM",
                    "price": 29.99,
                    "priceCurrency": "PLN"
                }
            });
        });
    });

    describe('getFormattedCart discountId=1 deliveryId=3', () => {
        let user = new UserEntity()
        user.uuid = randomUUID()
        user.cartUuid = randomUUID()
        user.createdOn = Date.now()

        let cart = new CartEntity()
        cart.uuid = randomUUID()
        cart.products = []
        cart.discountId = 1
        cart.deliveryId = 3
        cart.ownerUuid = user.uuid
        it('should return an formatted cart display', async () => {
            let c = await cartService.getFormattedCart(cart, user)
            await expect(c).toEqual({
                "finalPrice": 11.04,
                "productsPrice": 0,
                "products": [],
                "discount": {"id": 1, "name": "PROCENTOWY", "type": "PERCENT", "value": 0.15},
                "delivery": {
                    "id": 3,
                    "name": "PACZKOMAT",
                    "displayName": "Paczkomat",
                    "price": 12.99,
                    "priceCurrency": "PLN"
                }
            });
        });
    })

    describe('getFormattedCart discountId=1 deliveryId=1 with products', () => {
        let user = new UserEntity()
        user.uuid = randomUUID()
        user.cartUuid = randomUUID()
        user.createdOn = Date.now()

        let cart = new CartEntity()
        cart.uuid = randomUUID()
        cart.products = []

        let cartProductEntity = new CartProductEntity()
        cartProductEntity.productId = 1
        cartProductEntity.amount = 1
        cart.products.push(cartProductEntity)
        cart.discountId = 1
        cart.deliveryId = 1
        cart.ownerUuid = user.uuid
        it('should return an formatted cart display', async () => {
            let c = await cartService.getFormattedCart(cart, user)
            let displayCartDto = new DisplayCartDto()
            displayCartDto.delivery = {
                "id": 1,
                "name": "KURIER",
                "displayName": "Kurier",
                "price": 19.99,
                "priceCurrency": "PLN"
            }
            displayCartDto.discount = {"id": 1, "name": "PROCENTOWY", "type": "PERCENT", "value": 0.15}
            displayCartDto.finalPrice = 40.79
            displayCartDto.productsPrice = 28
            let product = {
                "amount": 1,
                "displayName": "Pizza Hawajska",
                "id": 1,
                "name": "PIZZA_HAWAJSKA",
                "price": 28,
                "priceCurrency": "PLN"
            }
            displayCartDto.products = []
            displayCartDto.products.push(plainToInstance(CartProductEntity, product))

            await expect(c).toEqual(displayCartDto);
        });
    })

    describe('generateShareLink', () => {

        let user = new UserEntity()
        user.uuid = randomUUID()
        user.cartUuid = randomUUID()

        it('should return an generated share link', async () => {
            expect(cartService.generateShareLink(user)).toBe("http://localhost:3000/api/v1/cart/share?uuid=" + user.cartUuid);
        });
    });

});
