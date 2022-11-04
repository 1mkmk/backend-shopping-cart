import {Module} from "@nestjs/common";
import {DiscountService} from "./discount.service";

@Module({
    providers: [
        DiscountService
    ],
    controllers: [

    ],
    exports: [DiscountService]
})

export class DiscountModule {}