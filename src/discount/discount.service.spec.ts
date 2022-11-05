import {discounts} from "./discounts";
import {DiscountService} from "./discount.service";

describe('DiscountService', () => {
    let discountService: DiscountService;

    beforeEach(() => {
        discountService = new DiscountService();
    });

    describe('findAll', () => {
        it('should return an array of discounts', async () => {
            expect(discountService.findAll()).toBe(discounts);
        });
    });
});
