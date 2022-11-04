import {Module} from "@nestjs/common";
import {ProductService} from "./product.service";

@Module({
    providers: [
        ProductService
    ],
    controllers: [

    ],
    exports: [ProductService]
})

export class ProductModule {}