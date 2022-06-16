import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {

  // Clave primaria de CAtegory
  @PrimaryGeneratedColumn()
  id: number;

  // Columna nombre de Categoría
  @Column()
  name: string;
}
