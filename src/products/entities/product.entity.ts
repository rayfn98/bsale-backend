import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  //COLUMNAS DE LA TABLA PRODUCTO
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

  // Id e la categoría a la que pertenece
  @Column()
  category: number;
}
