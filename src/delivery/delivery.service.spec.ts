import { DeliveryService } from "./delivery.service";
import {deliveries} from "./deliveries";

describe('DeliveryService', () => {
    let deliveryService: DeliveryService;

    beforeEach(() => {
        deliveryService = new DeliveryService();
    });

    describe('findAll', () => {
        it('should return an array of deliveries', async () => {
            expect(deliveryService.findAll()).toBe(deliveries);
        });
    });
});
