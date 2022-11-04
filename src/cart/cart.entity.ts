import {CartProductEntity} from "./cartProduct/cartProduct.entity";

export class CartEntity {

    uuid: string;
    ownerUuid: string;
    products: CartProductEntity[];
    deliveryId: number;
    discountId: number;

}