import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany} from 'typeorm';
import {ProductEntity} from "../../product/product.entity";

@Entity('CartProductEntity')
export class CartProductEntity {

    @Column()
    productId: number;

    @Column()
    amount: number;

}