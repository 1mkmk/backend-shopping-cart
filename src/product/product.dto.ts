import { IsNotEmpty } from 'class-validator';
export class ProductDto {

    @IsNotEmpty()
    productId: number;

    amount: number;
}
