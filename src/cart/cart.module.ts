import {Module} from '@nestjs/common';
import {CartController} from './cart.controller';
import {CartService} from "./cart.service";
import {DeliveryModule} from "../delivery/delivery.module";
import {DiscountModule} from "../discount/discount.module";
import {ProductModule} from "../product/product.module";

@Module({
    providers: [
        CartService
    ],
    controllers: [
        CartController
    ],
    imports: [
        ProductModule,
        DeliveryModule,
        DiscountModule
    ],
    exports: [CartService]
})

export class CartModule {}