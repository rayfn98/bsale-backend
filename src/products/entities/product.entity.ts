import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url_image: string;

  @Column()
  price: number;

  @Column()
  discount: number;

  @Column()
  category: number;
}
