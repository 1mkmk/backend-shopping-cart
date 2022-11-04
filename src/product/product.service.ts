import {Injectable} from "@nestjs/common";
import {ProductEntity} from "./product.entity";
import {products} from "./products";

@Injectable()
export class ProductService {
    private readonly products: ProductEntity[] = products;

    findAll(): ProductEntity[] {
        return this.products;
    }
}