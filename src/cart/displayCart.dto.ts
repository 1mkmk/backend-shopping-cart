import {CartProductEntity} from "./cartProduct/cartProduct.entity";
import {DiscountEntity} from "../discount/discount.entity";
import {DeliveryEntity} from "../delivery/delivery.entity";

export class DisplayCartDto {
    products: CartProductEntity[];
    productsPrice: number;
    discount: DiscountEntity;
    delivery: DeliveryEntity;
    finalPrice: number;
}
