import {Injectable} from "@nestjs/common";
import {DiscountEntity} from "./discount.entity";
import {discounts} from "./discounts";

@Injectable()
export class DiscountService {
    private readonly discounts: DiscountEntity[] = discounts;

    findAll(): DiscountEntity[] {
        return this.discounts;
    }
}