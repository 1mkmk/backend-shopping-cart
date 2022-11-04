import {Column, Entity} from 'typeorm';

@Entity('CartProductEntity')
export class CartProductEntity {

    @Column()
    productId: number;

    @Column()
    amount: number;

}