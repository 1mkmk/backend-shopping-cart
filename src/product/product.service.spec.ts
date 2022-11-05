import {DiscountService} from "../discount/discount.service";
import {ProductService} from "./product.service";
import {products} from "./products";

describe('ProductService', () => {
    let productService: ProductService;

    beforeEach(() => {
        productService = new ProductService();
    });

    describe('findAll', () => {
        it('should return an array of products', async () => {
            expect(productService.findAll()).toBe(products);
        });
    });
});
