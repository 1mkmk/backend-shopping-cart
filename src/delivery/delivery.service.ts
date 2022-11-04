import {Injectable} from "@nestjs/common";
import {DeliveryEntity} from "./delivery.entity";
import {deliveries} from "./deliveries";

@Injectable()
export class DeliveryService {
    private readonly deliveries: DeliveryEntity[] = deliveries;

    findAll(): DeliveryEntity[] {
        return this.deliveries;
    }
}