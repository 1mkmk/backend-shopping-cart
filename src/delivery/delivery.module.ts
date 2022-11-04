import {DeliveryService} from "./delivery.service";
import {Module} from "@nestjs/common";

@Module({
    providers: [
        DeliveryService
    ],
    controllers: [

    ],
    exports: [DeliveryService]
})

export class DeliveryModule {}