import { IsNotEmpty } from 'class-validator';
export class DiscountDto {
    @IsNotEmpty()
    discountCode: string;
}
